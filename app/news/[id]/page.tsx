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
      <main className="container max-w-4xl py-12 md:py-20">
        <nav className="mb-10">
          <Link 
            href="/" 
            className="group inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
            Back to Home
          </Link>
        </nav>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-actionRed/10 text-actionRed text-[10px] font-black uppercase tracking-widest">
              {article.category?.name ?? "General"}
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl font-black leading-[1.1] mb-8 tracking-tighter">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between py-6 border-y border-border/40 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span>By Monochrome Editorial</span>
            <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'March 16, 2026'}</span>
          </div>
        </header>

        <div className="relative aspect-[16/9] mb-12 rounded-2xl overflow-hidden shadow-2xl border border-border/20 group">
          <Image
            src={article.thumbnail || "/placeholder.svg"}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-black prose-p:leading-relaxed prose-p:text-foreground/90">
          <p className="text-xl md:text-2xl font-medium text-foreground/80 mb-10 leading-relaxed font-serif italic border-l-4 border-actionRed pl-6">
            {article.summary ?? ""}
          </p>
          
          <div className="space-y-6 text-lg leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:font-serif">
            {article.content ? (
              article.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <p>Content is unavailable for this article.</p>
            )}
          </div>
        </article>

        <footer className="mt-20 pt-10 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors cursor-pointer">
              <span className="text-sm font-bold">f</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors cursor-pointer">
              <span className="text-sm font-bold">t</span>
            </div>
          </div>
          <Link 
            href="/" 
            className="px-8 py-3 bg-foreground text-background font-bold uppercase tracking-widest text-xs rounded-full hover:bg-actionRed hover:text-white transition-all shadow-lg hover:shadow-actionRed/20 active:scale-95"
          >
            Explore More Stories
          </Link>
        </footer>
      </main>
    );
  } catch {
    return (
      <EmptyState
        title="Unable to load article"
        description="The requested article could not be loaded. It may have been removed."
      />
    );
  }
}
