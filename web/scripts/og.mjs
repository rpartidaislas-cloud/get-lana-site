// Renderiza og/og.html a public/assets/og-lana.png (1200×630) con el Chromium de Playwright.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PKG ?? "playwright");
import { resolve } from "node:path";
const web = resolve(import.meta.dirname, "..");
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.goto("file://" + resolve(web, "og/og.html"), { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: resolve(web, "public/assets/og-lana.png"), type: "png" });
await b.close();
console.log("OG image → public/assets/og-lana.png");
