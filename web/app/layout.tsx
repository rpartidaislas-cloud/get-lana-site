import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./legacy.css";
import { jsonLd, SEO_DESCRIPTION, SEO_TITLE, SITE_URL } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter-next",
});

const title = SEO_TITLE;
const description = SEO_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: SITE_URL, languages: { "es-MX": SITE_URL } },
  robots: { index: true, follow: true },
  icons: { icon: "/icons/favicon.svg", apple: "/icons/apple-touch-icon.png" },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "LANA",
    locale: "es_MX",
    type: "website",
    images: [{ url: `${SITE_URL}/assets/og-lana.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${SITE_URL}/assets/og-lana.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`scroll-smooth ${inter.variable}`}>
      <body className="bg-gray-50 font-inter tracking-tight text-gray-900 antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <Script src="/supabase-config.js" strategy="beforeInteractive" />
        <Script src="/lana.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
