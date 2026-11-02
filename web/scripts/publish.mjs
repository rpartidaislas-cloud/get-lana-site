// Copia el export estático (web/out) a la raíz del repo, que es lo que
// GitHub Pages sirve en get-lana.com. Borra el _next/ anterior para no
// acumular chunks viejos y respeta todo lo que no genera Next (CNAME,
// .nojekyll, lana.js, etc. vienen de web/public y se copian igual).
import { cpSync, existsSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const web = resolve(import.meta.dirname, "..");
const out = join(web, "out");
const root = resolve(web, "..");

if (!existsSync(join(out, "index.html"))) {
  console.error("No existe web/out/index.html. Corre `npm run build` primero.");
  process.exit(1);
}

rmSync(join(root, "_next"), { recursive: true, force: true });

for (const name of readdirSync(out)) {
  const src = join(out, name);
  const dst = join(root, name);
  if (statSync(src).isDirectory()) rmSync(dst, { recursive: true, force: true });
  cpSync(src, dst, { recursive: true });
}
console.log("Publicado web/out → raíz del repo.");
