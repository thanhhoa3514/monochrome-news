import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsList from "../components/NewsList";
import { useLanguage } from "@/lib/language-context";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { newsService } from "@/services/newsService";
import { News } from "@/types/news";
import { Loader2, LayoutGrid, List, Filter, Hash } from "lucide-react";
import NewsSidebar from "@/components/home/NewsSidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [articles, setArticles] = useState<News[]>([]);
  const [popularArticles, setPopularArticles] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const [categoryNewsRes, popularNewsRes] = await Promise.all([
          newsService.getNewsByCategorySlug(slug, currentPage),
          newsService.getPopularNews() // Ideally fetch popular in this category
        ]);

        setArticles(categoryNewsRes.data);
        setTotalPages(categoryNewsRes.last_page);
        setPopularArticles(popularNewsRes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, currentPage]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const getCategoryIcon = (slug: string) => {
    // Simple mapping or default
    switch (slug) {
      case 'technology': return <Hash className="w-8 h-8" />;
      case 'business': return <LayoutGrid className="w-8 h-8" />;
      default: return <Hash className="w-8 h-8" />;
    }
  };

  const getCategoryColor = (slug: string) => {
    switch (slug) {
      case 'technology': return 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400';
      case 'business': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'politics': return 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400';
      default: return 'bg-secondary text-foreground';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Category Header */}
        <div className={`py-12 border-b ${slug ? getCategoryColor(slug) : ''}`}>
          <div className="container mx-auto px-4">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>Categories</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">{t(`nav.${slug}`) || slug}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-background/50 backdrop-blur-sm rounded-xl shadow-sm">
                {slug && getCategoryIcon(slug)}
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold capitalize mb-2">
                  {t(`nav.${slug}`) || slug}
                </h1>
                <p className="text-lg opacity-80 max-w-2xl">
                  {t(`category.${slug}.desc`) || `Explore the latest news and updates in ${slug}.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content (2/3) */}
            <div className="lg:col-span-8">
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</span>
                  <Select defaultValue="latest">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : articles.length > 0 ? (
                <>
                  <div className={viewMode === 'grid' ? '' : 'space-y-6'}>
                    <NewsList
                      articles={articles}
                      layout={viewMode}
                      containerClassName={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : undefined}
                    />
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-12">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            href="#"
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>

                        {/* Simplified pagination for now */}
                        <PaginationItem>
                          <span className="px-4 text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                          </span>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            href="#"
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-xl">
                  <h2 className="text-2xl font-medium mb-2">{t('no.articles.found')}</h2>
                  <p className="text-muted-foreground">{t('check.back.later')}</p>
                </div>
              )}
            </div>

            {/* Sidebar (1/3) */}
            <aside className="lg:col-span-4 pl-0 lg:pl-4">
              <div className="sticky top-24">
                <div className="mb-6">
                  <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter by Time
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Today</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">This Week</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">This Month</Badge>
                    <Badge className="cursor-pointer">All Time</Badge>
                  </div>
                </div>

                <NewsSidebar trendingArticles={popularArticles} />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
