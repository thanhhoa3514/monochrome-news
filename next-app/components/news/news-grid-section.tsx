import type { NewsItem } from "@/lib/api/news";
import { NewsCardServer } from "@/components/news/news-card-server";

export function NewsGridSection({
  title,
  articles,
}: {
  title: string;
  articles: NewsItem[];
}) {
  if (!articles.length) return null;

  return (
    <section className="container" style={{ paddingTop: 24, paddingBottom: 12 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 34, marginBottom: 16 }}>{title}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {articles.map((article) => (
          <NewsCardServer key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
