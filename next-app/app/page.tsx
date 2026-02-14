import Link from "next/link";

export default function HomePage() {
  return (
    <section className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <h1 style={{ fontSize: 40, marginBottom: 12, fontFamily: "var(--font-serif)" }}>
        Next.js Migration Workspace
      </h1>
      <p style={{ marginBottom: 24, color: "#555" }}>
        This app is the new Server Components target. Public routes will be migrated incrementally.
      </p>
      <ul style={{ lineHeight: 1.8 }}>
        <li>
          <Link href="/news/1">Planned: /news/[id]</Link>
        </li>
        <li>
          <Link href="/category/technology">Planned: /category/[slug]</Link>
        </li>
        <li>
          <Link href="/tag/ai">Planned: /tag/[slug]</Link>
        </li>
      </ul>
    </section>
  );
}
