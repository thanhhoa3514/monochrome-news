import { serverNewsService } from "@/lib/server";
import type { ReactNode } from "react";
import { SiteShellClient } from "./site-shell-client";

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

export async function SiteShell({ children }: { children: ReactNode }) {
  const categories = await serverNewsService
    .getCategories()
    .then((list) => list.slice(0, 14))
    .catch(() => fallbackCategories);

  return (
    <SiteShellClient categories={categories}>
      {children}
    </SiteShellClient>
  );
}
