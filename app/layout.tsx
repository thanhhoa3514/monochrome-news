import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL(process.env.SITE_URL as string),
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
    apple: [
      { url: "/favicon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Monochrome News Flash | Fast Updates and Trusted Information",
    description: "Breaking news, analysis, and live updates across politics, business, technology, sports, and culture.",
    type: "website",
    url: "/",
    siteName: "Monochrome News Flash",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monochrome News Flash | Fast Updates and Trusted Information",
    description: "Breaking news, analysis, and live updates across major categories.",
    creator: "@monochromenews",
  },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: "#000000",
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
