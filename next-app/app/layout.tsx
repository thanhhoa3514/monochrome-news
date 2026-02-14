import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "NewsPortal",
  description: "Migration from Vite SPA to Next.js App Router and Server Components"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
