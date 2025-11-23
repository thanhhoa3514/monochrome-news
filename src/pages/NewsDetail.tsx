import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/lib/language-context';
import { newsService } from '@/services/newsService';
import { News } from '@/types/news';
import {
  Loader2, Calendar, User, Eye, Share2, Facebook, Twitter, Link as LinkIcon,
  Bookmark, MessageSquare, ThumbsUp, TrendingUp, Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [trendingNews, setTrendingNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // 1. Fetch current article
        const data = await newsService.getNewsById(id);
        setArticle(data);

        // 2. Fetch related news (same category, exclude current)
        if (data.category_id) {
          const related = await newsService.getNews({
            category_id: data.category_id,
            per_page: 4
          });
          setRelatedNews(related.data.filter(n => n.id !== data.id).slice(0, 3));
        }

        // 3. Fetch trending news
        const trending = await newsService.getPopularNews();
        setTrendingNews(trending);

      } catch (err) {
        console.error('Failed to fetch news detail:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Scroll to top when id changes
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article?.title || '')}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center min-h-[50vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-serif font-bold mb-4">{t('news.article.not.found')}</h1>
          <p className="mb-8 text-muted-foreground">{t('news.article.not.found.desc')}</p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen pb-12">
        {/* Hero Section / Header */}
        <div className="bg-muted/30 border-b mb-8">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="flex items-center justify-center gap-2">
                {article.category && (
                  <Badge variant="secondary" className="uppercase tracking-wider font-bold">
                    {article.category.name}
                  </Badge>
                )}
                {article.is_premium && (
                  <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                    Premium
                  </Badge>
                )}
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm md:text-base">
                {article.user && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.user.name}`} />
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{article.user.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{article.published_at ? format(new Date(article.published_at), 'MMMM d, yyyy') : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Sidebar - Interaction (1/12 -> 1/12 on large screens) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-4 items-center">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-100 hover:text-blue-600" onClick={() => handleShare('facebook')}>
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-sky-100 hover:text-sky-500" onClick={() => handleShare('twitter')}>
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100" onClick={() => handleShare('copy')}>
                  <LinkIcon className="h-5 w-5" />
                </Button>
                <Separator className="w-8" />
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-100 hover:text-red-500">
                  <Bookmark className="h-5 w-5" />
                </Button>
                <div className="text-xs font-bold text-muted-foreground mt-2 rotate-90 whitespace-nowrap origin-center translate-y-8">
                  SHARE
                </div>
              </div>
            </div>

            {/* Main Content (7/12) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Featured Image */}
              {article.thumbnail && (
                <div className="rounded-xl overflow-hidden shadow-lg border">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-auto object-cover aspect-video"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=No+Image';
                    }}
                  />
                </div>
              )}

              {/* Article Body */}
              <div
                className="prose prose-lg max-w-none dark:prose-invert 
                prose-headings:font-serif prose-headings:font-bold 
                prose-p:leading-relaxed prose-img:rounded-lg 
                first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px]"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-6 border-t">
                  {article.tags.map(tag => (
                    <Badge key={tag.id} variant="secondary" className="px-3 py-1 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Author Bio */}
              {article.user && (
                <Card className="bg-muted/30 border-none shadow-sm">
                  <CardContent className="flex gap-4 p-6 items-center sm:items-start">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.user.name}`} />
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{article.user.name}</h3>
                        <Badge variant="outline" className="text-xs">Author</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Senior editor and tech enthusiast. Passionate about bringing the latest news in technology and innovation.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Articles */}
              <div className="space-y-6 pt-8">
                <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                  <span className="bg-primary w-1 h-6 rounded-full"></span>
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedNews.map(item => (
                    <Link key={item.id} to={`/news/${item.id}`} className="group space-y-3">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.thumbnail || 'https://placehold.co/400x300?text=No+Image'}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <span className="text-xs text-muted-foreground block">
                        {item.published_at ? format(new Date(item.published_at), 'MMM d, yyyy') : ''}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Comments Section (Mock) */}
              <div className="space-y-6 pt-8">
                <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments
                </h3>
                <Card>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="bg-muted/50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium">Join the conversation</h4>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      Comments are currently available for registered users only. Please sign in to share your thoughts.
                    </p>
                    <Button variant="outline">Sign In to Comment</Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Sidebar (4/12) */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-24 space-y-8">

                {/* Subscribe Box */}
                <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Stay Updated
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <p className="text-sm text-primary-foreground/90">
                      Get the latest news and updates delivered directly to your inbox.
                    </p>
                    <div className="flex gap-2">
                      <Input placeholder="Your email address" className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" />
                      <Button variant="secondary">Join</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Trending News */}
                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="font-serif flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-actionRed" />
                      Top Trending
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 px-0">
                    <div className="space-y-1">
                      {trendingNews.map((item, index) => (
                        <Link
                          key={item.id}
                          to={`/news/${item.id}`}
                          className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors group"
                        >
                          <span className="text-3xl font-black text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
                            {index + 1}
                          </span>
                          <div className="space-y-1">
                            <h4 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{item.views} views</span>
                              <span>•</span>
                              <span>{item.category?.name}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Popular Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {['Technology', 'AI', 'Business', 'Crypto', 'Design', 'Startup', 'Innovation', 'Future'].map(tag => (
                        <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-secondary hover:border-secondary transition-colors">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}