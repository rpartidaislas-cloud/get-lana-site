// Verificación de las páginas legales exportadas (raíz del repo). Sin dependencias.
// Uso: npm run check:legales   (después de `npm run deploy`)
// Protege que los textos legales sigan alineados con la landing: sin Beta, Fundadores, piloto ni
// precios sueltos, con versión y vigencia consistentes, y sin enlaces ni anclas rotos.
import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";

const web = resolve(import.meta.dirname, "..");
const root = resolve(web, "..");
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
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const PAGINAS = ["terminos.html", "contrato-servicio.html", "privacidad.html", "eliminacion-datos.html"];
const html = {};
for (const p of PAGINAS) {
  ok(existsSync(join(root, p)), `existe ${p} en la raíz exportada`);
  html[p] = existsSync(join(root, p)) ? leer(p) : "";
}

// 1) Vocabulario retirado: la landing ya no ofrece Beta, Fundadores, piloto ni precios únicos.
// «10 días»/«diez días» solo se prohíben en contexto de prueba o piloto (para no bloquear plazos legítimos
// como «10 días hábiles» para responder derechos ARCO). «Beta» se prohíbe como programa/etapa de LANA en el
// texto, y en cualquier forma dentro de ids y atributos.
const PRUEBA = "(?:prueba|piloto|evaluaci[oó]n|acompa[ñn]ad|tarjeta)";
const PROHIBIDOS = [
  [/\b(?:programa|etapa|versi[oó]n|naturaleza|fase|producto)\s+beta\b|\bbeta\s+(?:p[uú]blica|cerrada|de lana)\b|chat ia beta/i, "Beta como programa o etapa de LANA"],
  [/fundador/i, "Fundador"],
  [/\bpiloto/i, "piloto"],
  [new RegExp(`\\b(?:10|diez)\\s+d[ií]as\\b[^.]{0,60}\\b${PRUEBA}|\\b${PRUEBA}[^.]{0,60}\\b(?:10|diez)\\s+d[ií]as\\b`, "i"), "10 días de prueba/piloto"],
  [/\btier\s*[12]\b/i, "Tier 1/2"],
  [/499\s*\/\s*900/, "499/900"],
  [/799\s*\/\s*900/, "799/900"],
  [/\$\s*499\b/, "$499"],
  [/\$\s*799\b/, "$799"],
];
for (const p of PAGINAS) {
  const t = textoPlano(html[p]);
  for (const [re, nombre] of PROHIBIDOS) ok(!re.test(t), `${p}: no debe aparecer «${nombre}»`);
  ok(!/\bbeta\b/i.test(html[p].replace(/<style[\s\S]*?<\/style>/gi, "")), `${p}: ni «Beta» en ids ni atributos`);
}

// 1b) Reglas que NO deben perderse al editar (decisión de Ricardo: se quitó Fundadores, no la protección
// de una sola prueba por negocio ni el aviso de 30 días por cambio de precio).
{
  const tt = textoPlano(html["terminos.html"]);
  ok(/cada negocio o correo puede utilizar una sola prueba gratis/i.test(tt), "términos: conservan la regla de una sola prueba gratis (cada negocio o correo)");
  ok(/30 días naturales de anticipación/i.test(tt), "términos: conservan el aviso de 30 días naturales por cambio de precio");
  const tc = textoPlano(html["contrato-servicio.html"]);
  ok(/30 días naturales de anticipación/i.test(tc), "contrato: conserva el aviso de 30 días naturales por cambio de precio");
}

// 2) Versión y vigencia consistentes entre términos y contrato.
const ver = (h, re) => (h.match(re) || [])[1];
const vTerKicker = ver(html["terminos.html"], /legal-kicker">Versión (\d{4}-\d{2}-\d{2})</);
const vTerPie = ver(html["terminos.html"], /Documento contractual versión (\d{4}-\d{2}-\d{2})\./);
const vConKicker = ver(html["contrato-servicio.html"], /legal-kicker">Versión (\d{4}-\d{2}-\d{2})</);
const vConPie = ver(html["contrato-servicio.html"], /Contrato versión (\d{4}-\d{2}-\d{2})\./);
const vConAnexo = ver(html["contrato-servicio.html"], /Versión aceptada: (\d{4}-\d{2}-\d{2})</);
ok(!!vTerKicker, "términos declaran su versión");
ok(vTerKicker === vTerPie, `términos: versión del encabezado (${vTerKicker}) = pie (${vTerPie})`);
ok(vConKicker === vConPie && vConPie === vConAnexo, `contrato: versión encabezado/pie/anexo iguales (${vConKicker}/${vConPie}/${vConAnexo})`);
ok(vTerKicker === vConKicker, `términos (${vTerKicker}) y contrato (${vConKicker}) comparten versión`);
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
if (vTerKicker) {
  const [a, m, d] = vTerKicker.split("-").map(Number);
  const esperado = `Vigentes desde el ${d} de ${MESES[m - 1]} de ${a}`;
  ok(html["terminos.html"].includes(esperado), `términos: vigencia «${esperado}» coincide con la versión`);
}

// 3) Numeración: términos 1..N sin saltos; cláusulas del contrato en orden ordinal.
{
  const nums = [...html["terminos.html"].matchAll(/<h2>(\d+)\. /g)].map((m) => Number(m[1]));
  ok(nums.length >= 10 && nums.every((n, i) => n === i + 1), `términos: secciones numeradas 1..N sin saltos (${nums.join(",")})`);
  const ORD = ["Primera", "Segunda", "Tercera", "Cuarta", "Quinta", "Sexta", "Séptima", "Octava", "Novena", "Décima"];
  const esperadas = [...ORD, ...["primera", "segunda", "tercera", "cuarta", "quinta", "sexta"].map((s) => `Décima ${s}`)];
  const cls = [...html["contrato-servicio.html"].matchAll(/<h3>([A-ZÁÉÍÓÚ][^<.]*)\. /g)].map((m) => m[1]).filter((n) => !/^[IV]+$/.test(n));
  ok(cls.join("|") === esperadas.slice(0, cls.length).join("|") && cls.length >= 10, `contrato: cláusulas en orden sin saltos (${cls.join(", ")})`);
}

// 4) Enlaces: archivos locales y anclas deben existir; ningún <link>/<img>/<script> a un archivo ausente.
const ids = {};
const idsDe = (archivo) => {
  if (!ids[archivo]) {
    const h = existsSync(join(root, archivo)) ? leer(archivo) : "";
    ids[archivo] = new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  }
  return ids[archivo];
};
for (const p of PAGINAS) {
  const h = html[p];
  for (const m of h.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const v = m[1];
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(v)) continue;
    const [archivo, ancla] = v.split("#");
    const f = archivo || p;
    ok(existsSync(join(root, dirname(p), f)), `${p}: existe el archivo enlazado «${v}»`);
    if (ancla) ok(idsDe(f).has(ancla), `${p}: existe la ancla «${v}»`);
  }
  for (const m of h.matchAll(/href="#([^"]+)"/g)) ok(idsDe(p).has(m[1]), `${p}: existe la ancla interna «#${m[1]}»`);
}

// 5) El contrato sigue fuera del sitemap (regla de check-seo.mjs). Se informa su estado de indexación.
{
  const sitemap = existsSync(join(root, "sitemap.xml")) ? leer("sitemap.xml") : "";
  ok(!/contrato-servicio/.test(sitemap), "contrato-servicio.html no está en el sitemap");
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html["contrato-servicio.html"]);
  console.log(`info: contrato-servicio.html ${noindex ? "lleva" : "NO lleva"} noindex (decisión pendiente de Ricardo)`);
}

if (fallas) {
  console.log(`\n${fallas} falla(s) en check:legales`);
  process.exit(1);
}
console.log("LEGALES OK");
