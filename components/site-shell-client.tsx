"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/lib/language-context";
import { Toaster } from "@/components/ui/toaster";
import AuthLink from "./AuthLink";

interface CategoryNavItem {
  name: string;
  slug: string;
}

interface SiteShellClientProps {
  children: ReactNode;
  categories: CategoryNavItem[];
}

export function SiteShellClient({ children, categories }: SiteShellClientProps) {
  const pathname = usePathname();
  const hidePublicChrome = pathname?.startsWith("/admin") || pathname?.startsWith("/editor");
  const primaryCategories = categories.slice(0, 10);
  const overflowCategories = categories.slice(10);

  return (
    <LanguageProvider>
      <AuthProvider initialUser={null}>
        {!hidePublicChrome ? (
          <>
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
          </>
        ) : (
          <main>{children}</main>
        )}
        <Toaster />
      </AuthProvider>
    </LanguageProvider>
  );
}
