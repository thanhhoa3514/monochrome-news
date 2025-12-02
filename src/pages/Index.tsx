
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import NewsList from "../components/NewsList";
import Footer from "../components/Footer";
import { useLanguage } from "@/lib/language-context";
import { newsService } from "@/services/newsService";
import { News } from "@/types/news";
import { Loader2 } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import NewsSidebar from "@/components/home/NewsSidebar";
import CategorySection from "@/components/home/CategorySection";

const Index = () => {
  const { t } = useLanguage();
  const [featuredArticles, setFeaturedArticles] = useState<News[]>([]);
  const [latestArticles, setLatestArticles] = useState<News[]>([]);
  const [popularArticles, setPopularArticles] = useState<News[]>([]);

  // Category specific articles
  const [techArticles, setTechArticles] = useState<News[]>([]);
  const [businessArticles, setBusinessArticles] = useState<News[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch basic data
        const [featured, latest, popular] = await Promise.all([
          newsService.getFeaturedNews(),
          newsService.getLatestNews(),
          newsService.getPopularNews()
        ]);

        setFeaturedArticles(featured);
        setLatestArticles(latest);
        setPopularArticles(popular);

        const categories = await newsService.getCategories();
        const techCat = categories.find(c => c.slug === 'technology' || c.name.toLowerCase().includes('tech'));
        const businessCat = categories.find(c => c.slug === 'business' || c.name.toLowerCase().includes('business'));

        if (techCat) {
          const techRes = await newsService.getNews({ category_id: techCat.id, per_page: 4 });
          setTechArticles(techRes.data);
        }

        if (businessCat) {
          const businessRes = await newsService.getNews({ category_id: businessCat.id, per_page: 4 });
          setBusinessArticles(businessRes.data);
        }

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* 1. Hero Section (Tin Nổi Bật) */}
        <HeroSection articles={featuredArticles} />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 2. Main Content (70%) */}
            <div className="lg:col-span-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold font-serif mb-6 border-b pb-2">
                  {t('latest.news')}
                </h2>
                <NewsList articles={latestArticles} />
              </div>
            </div>

            {/* 3. Sidebar (30%) */}
            <aside className="lg:col-span-4 pl-0 lg:pl-4">
              <div className="sticky top-24">
                <NewsSidebar trendingArticles={popularArticles} />
              </div>
            </aside>
          </div>
        </div>

        {/* 4. Category Blocks */}
        {techArticles.length > 0 && (
          <CategorySection title="Technology" articles={techArticles} />
        )}

        {businessArticles.length > 0 && (
          <CategorySection title="Business" articles={businessArticles} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
