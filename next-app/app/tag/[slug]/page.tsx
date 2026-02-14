import Link from "next/link";
import { EmptyState } from "@/components/news/empty-state";
import { NewsCardServer } from "@/components/news/news-card-server";
import { serverNewsService } from "@/lib/services/server/news-service";

export const dynamic = "force-dynamic";

function parsePage(input?: string): number {
  const value = Number(input ?? "1");
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { page?: string };
}) {
  const page = parsePage(searchParams?.page);

  try {
    const response = await serverNewsService.getNewsByTag(params.slug, page);

    return (
      <section className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 38, marginBottom: 8 }}>
          Tag: {response.tag.name}
        </h1>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Page {response.news.current_page} of {response.news.last_page}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {response.news.data.map((article) => (
            <NewsCardServer key={article.id} article={article} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          {response.news.current_page > 1 ? (
            <Link href={`/tag/${params.slug}?page=${response.news.current_page - 1}`}>Previous</Link>
          ) : (
            <span style={{ color: "#999" }}>Previous</span>
          )}

          {response.news.current_page < response.news.last_page ? (
            <Link href={`/tag/${params.slug}?page=${response.news.current_page + 1}`}>Next</Link>
          ) : (
            <span style={{ color: "#999" }}>Next</span>
          )}
        </div>
      </section>
    );
  } catch (error) {
    return (
      <EmptyState
        title="Unable to load tag"
        description="The tag page is currently unavailable."
      />
    );
  }
}
