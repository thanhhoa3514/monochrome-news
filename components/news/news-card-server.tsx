import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/lib/api/news";

function formatPublished(value?: string): string {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function NewsCardServer({ article }: { article: NewsItem }) {
  return (
    <article
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <Link href={`/news/${article.id}`}>
        <div style={{ position: "relative", width: "100%", height: 220, background: "var(--muted)" }}>
          <Image
            src={article.thumbnail || "/placeholder.svg"}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </Link>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
          {article.category?.name ?? "General"} • {formatPublished(article.published_at)}
        </div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, margin: "0 0 8px" }}>
          <Link href={`/news/${article.id}`}>{article.title}</Link>
        </h3>
        <p style={{ color: "#555", margin: 0 }}>{article.summary ?? "No summary available."}</p>
      </div>
    </article>
  );
}
