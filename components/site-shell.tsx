import Link from "next/link";
import { serverNewsService, serverAuthService } from "@/lib/server";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/lib/language-context";
import AuthLink from "./AuthLink";

const fallbackCategories = [
  { name: "World", slug: "world" },
  { name: "Politics", slug: "politics" },
  { name: "Business", slug: "business" },
  { name: "Technology", slug: "technology" },
  { name: "Science", slug: "science" },
  { name: "Health", slug: "health" },
  { name: "Sports", slug: "sports" },
  { name: "Culture", slug: "culture" },
  { name: "Education", slug: "education" },
  { name: "Environment", slug: "environment" },
  { name: "Travel", slug: "travel" },
  { name: "Opinion", slug: "opinion" },
];

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [categories, initialUser] = await Promise.all([
    serverNewsService.getCategories().then((list) => list.slice(0, 14)).catch(() => fallbackCategories),
    serverAuthService.me(),
  ]);
  const primaryCategories = categories.slice(0, 10);
  const overflowCategories = categories.slice(10);

  return (
    <LanguageProvider>
      <AuthProvider initialUser={initialUser}>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-serif text-2xl font-black tracking-tight">
              MONOCHROME NEWS FLASH
            </Link>
            <nav aria-label="Quick links" className="hidden items-center gap-5 text-sm md:flex">
              <Link href="/" className="hover:text-actionRed transition-colors">Top Stories</Link>
              <Link href="/tag/ai" className="hover:text-actionRed transition-colors">AI</Link>
            </nav>
          </div>
          <AuthLink />
        </div>
        <nav aria-label="News categories" className="border-y">
          <ul className="container flex items-center gap-5 overflow-x-auto py-3 text-sm font-medium whitespace-nowrap md:hidden">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-foreground/90 hover:text-actionRed transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="container hidden items-center gap-5 py-3 text-sm font-medium md:flex">
            {primaryCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-foreground/90 hover:text-actionRed transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            {overflowCategories.length > 0 ? (
              <li className="relative ml-auto">
                <details className="group">
                  <summary className="list-none cursor-pointer text-foreground/90 hover:text-actionRed transition-colors">
                    More
                  </summary>
                  <ul className="absolute right-0 top-8 z-20 min-w-44 rounded-md border bg-background p-2 shadow-md">
                    {overflowCategories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/category/${category.slug}`}
                          className="block rounded px-3 py-1.5 text-foreground/90 hover:bg-muted hover:text-actionRed transition-colors"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ) : null}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t bg-muted/30">
        <div className="container py-6 text-sm text-muted-foreground">
          Monochrome News Flash. Fast updates across politics, business, technology, and culture.
        </div>
      </footer>
      </AuthProvider>
    </LanguageProvider>
  );
}
