import Link from "next/link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link href="/" className="site-title">
            NewsPortal
          </Link>
          <nav className="site-nav" aria-label="Main">
            <Link href="/">Home</Link>
            <Link href="/category/technology">Technology</Link>
            <Link href="/tag/ai">AI</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container">Next.js migration in progress.</div>
      </footer>
    </>
  );
}
