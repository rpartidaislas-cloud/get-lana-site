# Landing de LANA — fuente (`web/`)

La raíz del repo es el **resultado exportado** que GitHub Pages sirve en
https://get-lana.com. No se edita a mano: se genera desde aquí.

```bash
cd web
npm install
npm run dev          # http://localhost:3000
npm run deploy       # next build + copia web/out → raíz del repo
```

Después de `npm run deploy`, commitea la raíz (`index.html`, `_next/`, etc.)
junto con los cambios de `web/`.

## Estructura

- `app/` — layout (metadata, fuente Inter, `lana.js` y `supabase-config.js`) y página.
- `components/` — secciones: `Header`, `Hero` (adaptado de *Hero with Mockup* de
  21st.dev), `PhoneChat` (conversación de WhatsApp animada), `Marquee`, `Producto`
  (bento), `Flujo`, `Precios`, `Faq`; `Reveal` (animación al hacer scroll) e `icons`.
- `legacy/` — fragmentos HTML de la landing anterior que todavía no se rediseñan
  (`taller`, `cta`, `footer`, `mock`) y los diálogos
  `beta` y `demo`, cuyos IDs usa `public/lana.js`. Se montan con `components/Legacy.tsx`.
- `app/legacy.css` — CSS no-Tailwind de la landing anterior (variables, mockup, diálogos).
- `og/og.html` + `scripts/og.mjs` — plantilla y render de la OG image (`npm run og`, usa el
  Chromium de Playwright; con `PLAYWRIGHT_PKG` se apunta a una instalación global).
- `public/` — assets estáticos, `CNAME`, `.nojekyll`, `lana.js`, `supabase-config.js`,
  `privacidad.html`, `eliminacion-datos.html`.

## Fases

1. **Hecha** — proyecto Next 15 + Tailwind 4, hero nuevo, teléfono con chat animado,
   marquesina de técnicas e integraciones, FAQ en React; resto migrado tal cual.
2. **Hecha** — `Producto` en bento con ilustraciones propias, `Flujo` con pasos
   conectados y rejilla de capacidades, `Precios` con 5 planes, toggle mensual/anual y
   CTA a WhatsApp con el plan elegido (`lib/whatsapp.ts`); el módulo Beta se retiró. Entradas al hacer scroll con `components/Reveal.tsx`.
3. **En curso** — OG image nueva hecha. Pendiente: fotografía/video de producto
   (Higgsfield requiere plan Basic; mejor fotos reales del taller) y testimonios de betas.
