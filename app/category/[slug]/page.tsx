import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/news/empty-state";
import { NewsCardServer } from "@/components/news/news-card-server";
import { serverNewsService } from "@/lib/server";

export const dynamic = "force-dynamic";

function parsePage(input?: string): number {
  const value = Number(input ?? "1");
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
}

function formatCategoryName(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function resolveCategoryName(slug: string): Promise<string> {
  try {
    const categories = await serverNewsService.getCategories();
    const match = categories.find((category) => category.slug === slug);
    return match?.name ?? formatCategoryName(slug);
  } catch {
    return formatCategoryName(slug);
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const categoryName = await resolveCategoryName(params.slug);
  const title = `${categoryName} News`;
  const description = `Latest ${categoryName.toLowerCase()} updates, headlines, and analysis from Monochrome News Flash.`;
  const canonicalPath = `/category/${params.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { page?: string };
}) {
  const page = parsePage(searchParams?.page);
  const categoryName = await resolveCategoryName(params.slug);

  try {
    const response = await serverNewsService.getNewsByCategorySlug(params.slug, page);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${categoryName} News`,
      description: `Latest ${categoryName.toLowerCase()} updates, headlines, and analysis.`,
      url: `${siteUrl}/category/${params.slug}`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: response.data.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/news/${article.id}`,
          name: article.title,
        })),
      },
    };

    return (
      <section className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 38, marginBottom: 8 }}>
          {categoryName} News
        </h1>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Page {response.current_page} of {response.last_page}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {response.data.map((article) => (
            <NewsCardServer key={article.id} article={article} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          {response.current_page > 1 ? (
            <Link href={`/category/${params.slug}?page=${response.current_page - 1}`}>Previous</Link>
          ) : (
            <span style={{ color: "#999" }}>Previous</span>
          )}

          {response.current_page < response.last_page ? (
            <Link href={`/category/${params.slug}?page=${response.current_page + 1}`}>Next</Link>
          ) : (
            <span style={{ color: "#999" }}>Next</span>
          )}
        </div>
      </section>
    );
  } catch {
    return (
      <EmptyState
        title="Unable to load category"
        description="The category page is currently unavailable."
      />
    );
  }
}
