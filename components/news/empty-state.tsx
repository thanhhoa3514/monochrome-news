import { Newspaper } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="container flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 rounded-full bg-muted/50 p-6">
        <Newspaper className="h-12 w-12 text-muted-foreground/60" />
      </div>
      <h1 className="mb-3 font-serif text-3xl font-black tracking-tight">{title}</h1>
      <p className="max-w-md text-muted-foreground">{description}</p>
    </section>
  );
}
