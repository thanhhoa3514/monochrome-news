import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { newsService } from '@/services/newsService';
import { News, PaginatedResponse } from '@/types/news';
import { Loader2, Tag, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/lib/language-context';

interface TagInfo {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const [tag, setTag] = useState<TagInfo | null>(null);
  const [news, setNews] = useState<PaginatedResponse<News> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await newsService.getNewsByTag(slug, currentPage);
        setTag(data.tag);
        setNews(data.news);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tag news:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [slug, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  if (error || !tag) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center min-h-[50vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Tag không tồn tại</h1>
          <p className="mb-8 text-muted-foreground">Không tìm thấy tag này.</p>
          <Button asChild>
            <Link to="/">Về trang chủ</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Tag className="h-6 w-6 text-primary" />
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  #{tag.name}
                </Badge>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">
                Bài viết với tag "{tag.name}"
              </h1>
              {tag.description && (
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {tag.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {news?.total || 0} bài viết
              </p>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="container mx-auto px-4 py-12">
          {news && news.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.data.map((item) => (
                  <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <Link to={`/news/${item.id}`}>
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={item.thumbnail || 'https://placehold.co/400x225?text=No+Image'}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-4 space-y-3">
                      {item.category && (
                        <Badge variant="outline" className="text-xs">
                          {item.category.name}
                        </Badge>
                      )}
                      <Link to={`/news/${item.id}`}>
                        <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {item.published_at
                              ? format(new Date(item.published_at), 'dd/MM/yyyy')
                              : ''}
                          </span>
                        </div>
                        {item.user && <span>• {item.user.name}</span>}
                      </div>
                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((t) => (
                            <Link key={t.id} to={`/tag/${t.slug || t.id}`}>
                              <Badge
                                variant="secondary"
                                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                              >
                                #{t.name}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {news.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: news.last_page }, (_, i) => i + 1)
                    .filter(page => {
                      return page === 1 || page === news.last_page || Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, index, arr) => (
                      <span key={page}>
                        {index > 0 && arr[index - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </span>
                    ))}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === news.last_page}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t('no.articles.found')}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
