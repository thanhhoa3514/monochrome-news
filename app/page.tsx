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
  try {
    const [featuredArticles, latestArticles, popularArticles, categories] = await Promise.all([
      serverNewsService.getFeaturedNews(),
      serverNewsService.getLatestNews(),
      serverNewsService.getPopularNews(),
      serverNewsService.getCategories(),
    ]);

    const techCategory = categories.find(
      (category) => category.slug === "technology" || category.name.toLowerCase().includes("tech"),
    );
    const businessCategory = categories.find(
      (category) => category.slug === "business" || category.name.toLowerCase().includes("business"),
    );

    const [techResponse, businessResponse] = await Promise.all([
      techCategory
        ? serverNewsService.getNews({ category_id: techCategory.id, per_page: 4 })
        : Promise.resolve({ data: [], current_page: 1, per_page: 4, total: 0, last_page: 1 }),
      businessCategory
        ? serverNewsService.getNews({ category_id: businessCategory.id, per_page: 4 })
        : Promise.resolve({ data: [], current_page: 1, per_page: 4, total: 0, last_page: 1 }),
    ]);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const topArticles = [...featuredArticles, ...latestArticles].slice(0, 8);

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
        <section className="container" style={{ paddingTop: 24, paddingBottom: 8 }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 42, lineHeight: 1.1 }}>
            Breaking News and Real-Time Updates
          </h1>
          <p style={{ marginTop: 10, color: "#666" }}>
            Follow major stories across politics, business, technology, science, culture, and sports.
          </p>
        </section>
        <NewsGridSection title="Featured News" articles={featuredArticles} />
        <NewsGridSection title="Latest News" articles={latestArticles} />
        <NewsGridSection title="Popular News" articles={popularArticles} />
        <NewsGridSection title="Technology" articles={techResponse.data} />
        <NewsGridSection title="Business" articles={businessResponse.data} />
      </>
    );
  } catch {
    return (
      <EmptyState
        title="Unable to load homepage"
        description="The server could not fetch news data. Please retry shortly."
      />
    );
  }
}
