import type { Metadata } from "next";
import { NewsGridSection } from "@/components/news/news-grid-section";
import { EmptyState } from "@/components/news/empty-state";
import { serverNewsService } from "@/lib/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Latest News and Top Stories",
  description: "Read today's top stories, featured reports, and breaking updates across technology, business, politics, sports, and more.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "breaking news",
    "latest news",
    "top stories",
    "technology news",
    "business news",
    "world news",
  ],
};

export default async function HomePage() {
  const logError = (context: string) => (err: any) => {
    console.error(`HomePage fetch error [${context}]:`, err);
    return [];
  };

  try {
    const [featuredArticles, latestArticles, popularArticles, categories] = await Promise.all([
      serverNewsService.getFeaturedNews().catch(logError("featured")),
      serverNewsService.getLatestNews().catch(logError("latest")),
      serverNewsService.getPopularNews().catch(logError("popular")),
      serverNewsService.getCategories().catch(logError("categories")),
    ]);

    // If categories failed, we can't do the sub-fetches, so we use empty responses
    const techCategory = categories.find(
      (category) => category.slug === "technology" || category.name.toLowerCase().includes("tech"),
    );
    const businessCategory = categories.find(
      (category) => category.slug === "business" || category.name.toLowerCase().includes("business"),
    );

    const [techResponse, businessResponse] = await Promise.all([
      techCategory
        ? serverNewsService.getNews({ category_id: techCategory.id, per_page: 4 }).catch(logError("tech"))
        : Promise.resolve({ data: [], current_page: 1, per_page: 4, total: 0, last_page: 1 }),
      businessCategory
        ? serverNewsService.getNews({ category_id: businessCategory.id, per_page: 4 }).catch(logError("business"))
        : Promise.resolve({ data: [], current_page: 1, per_page: 4, total: 0, last_page: 1 }),
    ]);

    // Ensure techResponse and businessResponse follow Expected Shape if they failed and logError returned []
    const safeTechData = Array.isArray(techResponse) ? techResponse : (techResponse as any).data || [];
    const safeBusinessData = Array.isArray(businessResponse) ? businessResponse : (businessResponse as any).data || [];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const topArticles = [...featuredArticles, ...latestArticles].slice(0, 8);

    // If we have literally no news at all, show empty state instead of broken layout
    if (topArticles.length === 0 && safeTechData.length === 0 && safeBusinessData.length === 0) {
      throw new Error("No news data available from any source");
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Latest News and Top Stories",
      description:
        "Read today's top stories, featured reports, and breaking updates across technology, business, politics, sports, and more.",
      url: siteUrl,
      mainEntity: topArticles.map((article) => ({
        "@type": "NewsArticle",
        headline: article.title,
        url: `${siteUrl}/news/${article.id}`,
        datePublished: article.published_at ?? undefined,
        articleSection: article.category?.name ?? "General",
      })),
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <section className="relative overflow-hidden py-16 md:py-24 mb-6">
          <div className="container relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-actionRed/10 text-actionRed text-[10px] font-black uppercase tracking-widest border border-actionRed/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-actionRed opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-actionRed"></span>
                </span>
                Live Updates
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
                Breaking News and <br />
                <span className="text-muted-foreground italic">Real-Time</span> Updates
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground/80 max-w-xl leading-relaxed">
                Follow major stories across politics, business, technology, science, culture, and sports. 
                Experience news with a new perspective.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-foreground text-background font-bold uppercase tracking-widest text-xs rounded-full hover:bg-actionRed hover:text-white transition-all shadow-xl hover:shadow-actionRed/20 active:scale-95">
                  Latest Headlines
                </button>
                <button className="px-8 py-4 bg-background text-foreground border border-border/60 font-bold uppercase tracking-widest text-xs rounded-full hover:bg-muted transition-all active:scale-95">
                   Today&apos;s Edition
                </button>
              </div>
            </div>
          </div>
          
          {/* Decorative background element */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full bg-gradient-to-l from-muted/20 to-transparent blur-3xl rounded-full" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-actionRed/5 blur-3xl rounded-full" />
        </section>
        <NewsGridSection title="Featured News" articles={featuredArticles} />
        <NewsGridSection title="Latest News" articles={latestArticles} />
        <NewsGridSection title="Popular News" articles={popularArticles} />
        <NewsGridSection title="Technology" articles={safeTechData} />
        <NewsGridSection title="Business" articles={safeBusinessData} />
      </>
    );
  } catch (e) {
    console.error("HomePage data fetch error:", e);
    return (
      <EmptyState
        title="Unable to load homepage"
        description="The server could not fetch news data. Please retry shortly."
      />
    );
  }
}
