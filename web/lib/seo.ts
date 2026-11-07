import faq from "../legacy/faq.json";

/**
 * SEO de la landing: títulos, descripción y datos estructurados (JSON-LD).
 * Una sola fuente para <head>, Open Graph, Twitter y JSON-LD.
 * Los precios de `PLANES_SEO` deben coincidir con `components/Precios.tsx`
 * (los verifica `npm run check:seo`).
 */
export const SITE_URL = "https://get-lana.com";
export const SEO_TITLE = "LANA: WhatsApp, Messenger e Instagram con IA para talleres";
export const SEO_DESCRIPTION =
  "Bandeja unificada de WhatsApp, Messenger e Instagram con IA que cotiza con tu catálogo. Para talleres de bordado, impresión y promocionales en México.";

export const PLANES_SEO = [
  { name: "Inicio", mensual: 499 },
  { name: "Esencial", mensual: 990 },
  { name: "Profesional", mensual: 1990 },
  { name: "Empresarial", mensual: 3990 },
] as const;

/** Quita etiquetas HTML y decodifica las entidades básicas de las respuestas del FAQ. */
export function textoPlano(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "LANA",
      url: SITE_URL,
      logo: `${SITE_URL}/icons/apple-touch-icon.png`,
      email: "contacto@get-lana.com",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "LANA",
      inLanguage: "es-MX",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "LANA",
      description: SEO_DESCRIPTION,
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "es-MX",
      publisher: { "@id": `${SITE_URL}/#organization` },
      offers: PLANES_SEO.map((p) => ({
        "@type": "Offer",
        name: `Plan ${p.name}`,
        price: p.mensual.toFixed(2),
        priceCurrency: "MXN",
        description: `Plan ${p.name}: precio mensual en pesos mexicanos, IVA incluido. Prueba de 14 días sin tarjeta.`,
        url: `${SITE_URL}/#precios`,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      inLanguage: "es-MX",
      mainEntity: (faq as { q: string; a: string }[]).map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: textoPlano(item.a) },
      })),
    },
  ],
};
