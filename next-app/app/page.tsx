import { NewsGridSection } from "@/components/news/news-grid-section";
import { EmptyState } from "@/components/news/empty-state";
import { serverNewsService } from "@/lib/services/server/news-service";

export const dynamic = "force-dynamic";

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

    return (
      <>
        <NewsGridSection title="Featured News" articles={featuredArticles} />
        <NewsGridSection title="Latest News" articles={latestArticles} />
        <NewsGridSection title="Popular News" articles={popularArticles} />
        <NewsGridSection title="Technology" articles={techResponse.data} />
        <NewsGridSection title="Business" articles={businessResponse.data} />
      </>
    );
  } catch (error) {
    return (
      <EmptyState
        title="Unable to load homepage"
        description="The server could not fetch news data. Please retry shortly."
      />
    );
  }
}
