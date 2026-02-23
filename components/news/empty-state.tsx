export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, marginBottom: 8 }}>{title}</h1>
      <p style={{ color: "#666" }}>{description}</p>
    </section>
  );
}
