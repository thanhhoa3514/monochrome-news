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
    <section className="container py-8 md:py-12">
      <div className="flex items-center justify-between mb-8 border-b border-border/40 pb-4">
        <h2 className="font-serif text-3xl md:text-4xl font-black tracking-tight text-foreground/90 uppercase">
          {title}
        </h2>
        <div className="h-1 flex-1 ml-6 bg-gradient-to-r from-border/60 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {articles.map((article) => (
          <NewsCardServer key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
