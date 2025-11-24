
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import NewsList from "../components/NewsList";
import CategoryList from "../components/CategoryList";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { newsService } from "@/services/newsService";
import { News } from "@/types/news";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();
  const [featuredArticles, setFeaturedArticles] = useState<News[]>([]);
  const [latestArticles, setLatestArticles] = useState<News[]>([]);
  const [popularArticles, setPopularArticles] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, latest, popular] = await Promise.all([
          newsService.getFeaturedNews(),
          newsService.getLatestNews(),
          newsService.getPopularNews()
        ]);

        setFeaturedArticles(featured);
        setLatestArticles(latest);
        setPopularArticles(popular);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-actionRed" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-secondary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="headline mb-4">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg max-w-xl mx-auto mb-8">
              {t('home.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-actionRed hover:bg-actionRed-hover">
                {t('home.hero.button.today')}
              </Button>
              <Button variant="outline">
                {t('home.hero.button.explore')}
              </Button>
            </div>
          </div>
        </section>

        <div className="news-container">
          {/* Featured Article */}
          {featuredArticles.length > 0 && (
            <NewsList articles={featuredArticles} featured={true} />
          )}

          {/* Latest News */}
          <NewsList title={t('latest.news')} articles={latestArticles} />

          {/* Categories */}
          <CategoryList />

          {/* Popular News */}
          <NewsList title={t('popular.articles')} articles={popularArticles} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
