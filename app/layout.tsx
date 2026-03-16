import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Monochrome News Flash For Updating News and Information",
    template: "%s | Monochrome News Flash For Updating News and Information",
  },
  description: "Breaking news, analysis, and live updates across politics, business, technology, sports, and culture.",
  keywords: [
    "breaking news",
    "latest news",
    "top stories",
    "technology news",
    "business news",
    "world news",
    "sports news",
    "culture news",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Monochrome News Flash For Updating News and Information",
    description: "Breaking news, analysis, and live updates across major categories.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    siteName: "Monochrome News Flash For Updating News and Information",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monochrome News Flash For Updating News and Information",
    description: "Breaking news, analysis, and live updates across major categories.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
