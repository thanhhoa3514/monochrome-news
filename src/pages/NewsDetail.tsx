import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/language-context';
import { newsService } from '@/services/newsService';
import { News } from '@/types/news';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await newsService.getNewsById(id);
        setArticle(data);
      } catch (err) {
        console.error('Failed to fetch news detail:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

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
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <article className="container mx-auto px-4 py-8 max-w-3xl min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {article.category && (
              <Badge variant="outline" className="bg-actionRed/10 text-actionRed border-actionRed/20">
                {article.category.name}
              </Badge>
            )}
            {article.published_at && (
              <span className="text-muted-foreground text-sm">
                {format(new Date(article.published_at), 'PPP')}
              </span>
            )}
            {article.user && (
              <span className="text-muted-foreground text-sm">
                By {article.user.name}
              </span>
            )}
            <span className="text-muted-foreground text-sm flex items-center">
              {article.views} views
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Featured Image */}
        {article.thumbnail && (
          <div className="w-full aspect-video mb-8 overflow-hidden rounded-lg bg-muted">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=No+Image';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert prose-img:rounded-lg prose-headings:font-serif"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>
      <Footer />
    </>
  );
}