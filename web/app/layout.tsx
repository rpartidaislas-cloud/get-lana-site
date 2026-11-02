import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./legacy.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter-next",
});

const title = "LANA — Responde, cotiza y produce desde una sola conversación";
const description =
  "LANA une WhatsApp Business, Messenger e Instagram en una bandeja con IA que cotiza con tu catálogo y convierte cada pedido pagado en una orden de trabajo. Para talleres de bordado, impresión y promocionales.";

export const metadata: Metadata = {
  metadataBase: new URL("https://get-lana.com"),
  title,
  description,
  alternates: { canonical: "https://get-lana.com" },
  icons: { icon: "/icons/favicon.svg", apple: "/icons/apple-touch-icon.png" },
  openGraph: {
    title,
    description:
      "WhatsApp, Messenger e Instagram en una bandeja con IA que cotiza con tu catálogo real. Para talleres de bordado, impresión y promocionales.",
    url: "https://get-lana.com",
    siteName: "LANA",
    locale: "es_MX",
    type: "website",
    images: [{ url: "https://get-lana.com/assets/og-lana.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "WhatsApp, Messenger e Instagram en una bandeja con IA que cotiza con tu catálogo real. Para talleres de bordado, impresión y promocionales.",
    images: ["https://get-lana.com/assets/og-lana.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`scroll-smooth ${inter.variable}`}>
      <body className="bg-gray-50 font-inter tracking-tight text-gray-900 antialiased">
        {children}
        <Script src="/supabase-config.js" strategy="beforeInteractive" />
        <Script src="/lana.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
