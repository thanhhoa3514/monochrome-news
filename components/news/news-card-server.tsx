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
    <article className="group flex flex-col bg-card border border-border/40 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/news/${article.id}`} className="relative block aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={article.thumbnail || "/placeholder.svg"}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </Link>
      
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/10">
            {article.category?.name ?? "General"}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            {formatPublished(article.published_at)}
          </span>
        </div>
        
        <h3 className="font-serif text-xl font-bold leading-tight mb-3 line-clamp-2 group-hover:text-actionRed transition-colors">
          <Link href={`/news/${article.id}`}>
            {article.title}
          </Link>
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {article.summary ?? "Discover more details about this story on Monochrome News Flash."}
        </p>
        
        <Link 
          href={`/news/${article.id}`}
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-foreground hover:text-actionRed transition-colors group/link"
        >
          Read Article
          <span className="ml-1 inline-block transition-transform group-hover/link:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
