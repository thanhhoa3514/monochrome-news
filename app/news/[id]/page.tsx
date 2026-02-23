import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/news/empty-state";
import { serverNewsService } from "@/lib/server";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  try {
    const article = await serverNewsService.getNewsById(params.id);

    if (!article || !article.id) {
      notFound();
    }

    return (
      <section className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <p style={{ marginBottom: 12 }}>
          <Link href="/" style={{ color: "#555" }}>
            Back to home
          </Link>
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 42, marginBottom: 12 }}>{article.title}</h1>
        <p style={{ color: "#666", marginTop: 0, marginBottom: 20 }}>
          {article.category?.name ?? "General"}
        </p>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: 420,
            marginBottom: 20,
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--muted)",
          }}
        >
          <Image
            src={article.thumbnail || "/placeholder.svg"}
            alt={article.title}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        <article style={{ lineHeight: 1.8, color: "#2d2d2d" }}>
          <p>{article.summary ?? ""}</p>
          <p>{article.content ?? "Content is unavailable for this article."}</p>
        </article>
      </section>
    );
  } catch (error) {
    return (
      <EmptyState
        title="Unable to load article"
        description="The requested article could not be loaded. It may have been removed."
      />
    );
  }
}
