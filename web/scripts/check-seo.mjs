// Verificación del SEO de la landing exportada (raíz del repo). Sin dependencias.
// Uso: npm run check:seo   (después de `npm run deploy`)
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const web = resolve(import.meta.dirname, "..");
const root = resolve(web, "..");
const SITE = "https://get-lana.com";
let fallas = 0;
const ok = (c, m) => {
  if (!c) {
    fallas++;
    console.log("FALLA:", m);
  }
};
const leer = (p) => readFileSync(join(root, p), "utf8");
const textoPlano = (h) =>
  h
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
const attr = (html, re) => (html.match(re) || [])[1];

const html = leer("index.html");
const title = attr(html, /<title>([^<]*)<\/title>/);
ok(title && title.length <= 60, `title ≤60 (${title && title.length}): ${title}`);
for (const w of ["WhatsApp", "Messenger", "Instagram"]) ok(title && title.includes(w), `title incluye ${w}`);
const desc = attr(html, /<meta name="description" content="([^"]*)"/);
ok(desc && desc.length <= 160, `description ≤160 (${desc && desc.length})`);
ok(desc && /México/.test(desc) && /talleres/.test(desc), "description menciona México y talleres");
ok(attr(html, /<link rel="canonical" href="([^"]*)"/) === SITE, "canonical exacta " + SITE);
ok(attr(html, /<meta property="og:title" content="([^"]*)"/) === title, "og:title = title");
ok(attr(html, /<meta property="og:description" content="([^"]*)"/) === desc, "og:description = description");
ok(attr(html, /<meta name="twitter:title" content="([^"]*)"/) === title, "twitter:title = title");
ok(attr(html, /<meta name="twitter:description" content="([^"]*)"/) === desc, "twitter:description = description");
ok(attr(html, /<meta property="og:url" content="([^"]*)"/) === SITE, "og:url");
ok(/<meta property="og:image" content="https:\/\/get-lana\.com\/assets\/og-lana\.png"/.test(html), "og:image");
ok(existsSync(join(root, "assets/og-lana.png")), "og-lana.png existe");
ok(/<meta name="robots" content="index, follow"/.test(html), "robots index, follow");
ok((html.match(/<h1[\s>]/g) || []).length === 1, "un solo h1");

// JSON-LD
const bloques = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
ok(bloques.length === 1, "un bloque JSON-LD");
let ld = null;
try {
  ld = JSON.parse(bloques[0][1]);
} catch (e) {
  ok(false, "JSON-LD parseable");
}
if (ld) {
  const tipos = (ld["@graph"] || []).map((n) => n["@type"]);
  for (const t of ["Organization", "WebSite", "SoftwareApplication", "FAQPage"]) ok(tipos.includes(t), `JSON-LD incluye ${t}`);
  ok(!/AggregateRating|"Review"/.test(bloques[0][1]), "sin AggregateRating/Review");
  // FAQPage = FAQ visible
  const faq = ld["@graph"].find((n) => n["@type"] === "FAQPage");
  const visibles = [...html.matchAll(/<h3><button[^>]*>\s*<span>([\s\S]*?)<\/span>[\s\S]*?<div class="overflow-hidden">([\s\S]*?)<\/div><\/div><\/div>/g)].map((m) => [
    textoPlano(m[1]),
    textoPlano(m[2]),
  ]);
  ok(faq && visibles.length === faq.mainEntity.length && visibles.length >= 8, `FAQ visible (${visibles.length}) = FAQPage (${faq && faq.mainEntity.length})`);
  if (faq)
    faq.mainEntity.forEach((q, i) => {
      ok(visibles[i] && q.name === visibles[i][0], `pregunta ${i + 1} idéntica`);
      ok(visibles[i] && q.acceptedAnswer.text === visibles[i][1], `respuesta ${i + 1} idéntica`);
    });
  // Precios = Precios.tsx
  const src = readFileSync(join(web, "components/Precios.tsx"), "utf8");
  const planes = [...src.matchAll(/name: "([^"]+)",\s*mensual: (\d+)/g)].map((m) => [m[1], Number(m[2])]);
  const sw = ld["@graph"].find((n) => n["@type"] === "SoftwareApplication");
  const ofertas = (sw && sw.offers) || [];
  ok(planes.length === 4 && ofertas.length === planes.length, `4 planes en Precios.tsx y ${ofertas.length} ofertas`);
  planes.forEach(([n, p], i) => {
    ok(ofertas[i] && ofertas[i].name === `Plan ${n}` && Number(ofertas[i].price) === p && ofertas[i].priceCurrency === "MXN", `oferta ${n} = ${p} MXN`);
  });
}

// Claims prohibidos
for (const re of [/Meta Partner/i, /\bBSP\b/, /Tech Provider oficial/i]) ok(!re.test(html), `sin claim ${re}`);

// robots.txt y sitemap.xml
const robots = leer("robots.txt");
ok(/^User-agent: \*/m.test(robots) && /^Allow: \//m.test(robots) && !/^Disallow:\s*\S/m.test(robots), "robots.txt permisivo");
ok(/^Sitemap: https:\/\/get-lana\.com\/sitemap\.xml$/m.test(robots), "robots.txt apunta al sitemap del apex");
const sm = leer("sitemap.xml");
ok(/^<\?xml/.test(sm) && /<urlset [^>]*sitemaps\.org/.test(sm), "sitemap.xml bien formado (cabecera)");
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
ok(locs.length >= 4 && locs.every((l) => l.startsWith(SITE + "/")), "sitemap con URLs del apex");
ok(!locs.some((l) => /lana-demo|demo-video|contrato-servicio|www\./.test(l)), "sitemap sin demo/contrato/www");
ok([...sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].every((m) => /^\d{4}-\d{2}-\d{2}$/.test(m[1])), "lastmod ISO");
locs.forEach((l) => {
  const f = l.replace(SITE + "/", "") || "index.html";
  ok(existsSync(join(root, f)), `existe ${f}`);
});

// noindex en demos
for (const f of ["lana-demo.html", "demo-video.html"]) ok(/<meta name="robots" content="noindex, nofollow">/.test(leer(f)), `${f} con noindex`);
ok(/<title>[^<]*LANA[^<]*<\/title>/.test(leer("404.html")) && !/This page could not be found/.test(leer("404.html").replace(/<script[\s\S]*?<\/script>/g, "")), "404 en español");

console.log(fallas ? `\n${fallas} falla(s)` : "SEO OK");
process.exit(fallas ? 1 : 0);
