import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/news/empty-state";
import { NewsCardServer } from "@/components/news/news-card-server";
import { serverNewsService } from "@/lib/server";
import { SITE_URL } from "@/config/environment";

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
    const siteUrl = SITE_URL;
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
      <section className="container py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <header className="mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-actionRed mb-4 transition-all">
            <span className="h-px w-8 bg-actionRed" />
            Category
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tighter mb-6 uppercase">
            {categoryName}
          </h1>
          <div className="h-1.5 w-24 bg-foreground mb-8" />
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            Showing Page <span className="text-foreground font-bold">{response.current_page}</span> of <span className="text-foreground font-bold">{response.last_page}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {response.data.map((article) => (
            <NewsCardServer key={article.id} article={article} />
          ))}
        </div>

        {response.last_page > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-border/40">
            <Link 
              href={`/category/${params.slug}?page=${response.current_page - 1}`}
              className={`px-6 py-2 rounded-full border text-sm font-bold uppercase tracking-wider transition-all
                ${response.current_page > 1 
                  ? "border-border hover:bg-foreground hover:text-background" 
                  : "border-border/20 text-muted-foreground/40 pointer-events-none"}`}
            >
              Previous
            </Link>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, response.last_page) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Link
                    key={pageNum}
                    href={`/category/${params.slug}?page=${pageNum}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all
                      ${response.current_page === pageNum 
                        ? "bg-actionRed text-white" 
                        : "hover:bg-muted font-medium"}`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            <Link 
              href={`/category/${params.slug}?page=${response.current_page + 1}`}
              className={`px-6 py-2 rounded-full border text-sm font-bold uppercase tracking-wider transition-all
                ${response.current_page < response.last_page 
                  ? "border-border hover:bg-foreground hover:text-background" 
                  : "border-border/20 text-muted-foreground/40 pointer-events-none"}`}
            >
              Next
            </Link>
          </div>
        )}
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
