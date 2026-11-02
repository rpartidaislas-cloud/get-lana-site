import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Render de un fragmento HTML heredado de la landing anterior (web/legacy/*.html).
 * Fase 1: las secciones que todavía no se rediseñan se montan tal cual para
 * conservar copy, IDs (lana.js depende de ellos) y estilos. En fases
 * siguientes cada fragmento se reemplaza por un componente real.
 */
export default function Legacy({ name }: { name: string }) {
  const file = join(process.cwd(), "legacy", `${name}.html`);
  const html = readFileSync(file, "utf8")
    // La landing anterior animaba con AOS; aquí no lo cargamos.
    .replace(/\s*data-aos(?:-[a-z]+)?="[^"]*"/g, "");
  return <div data-legacy={name} dangerouslySetInnerHTML={{ __html: html }} />;
}
