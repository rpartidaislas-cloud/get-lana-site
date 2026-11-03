"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Icon } from "./icons";

/**
 * "Diseño sobre el producto": ilustra el editor de posición y arte de las
 * cotizaciones. El cliente ve cómo quedará el diseño sobre la prenda y
 * producción recibe la posición y medidas exactas. Ilustración propia con un
 * logo genérico (no se usan logos de clientes reales).
 */

type Vista = "Frente" | "Espalda" | "Manga";
type Producto = {
  id: string;
  label: string;
  vistas: Vista[];
  // Posición del logo por vista, en % del lienzo, y medidas mostradas.
  pos: Partial<Record<Vista, { x: number; y: number; w: number; cm: string; desde: string }>>;
  Silueta: (p: { vista: Vista; color: string }) => React.ReactElement;
};

const productos: Producto[] = [
  {
    id: "camisa",
    label: "Camisa",
    vistas: ["Frente", "Espalda", "Manga"],
    pos: {
      Frente: { x: 61, y: 30, w: 15, cm: "6.0 × 2.1 cm", desde: "Pecho izquierdo · 20.2 cm desde el hombro" },
      Espalda: { x: 50, y: 30, w: 34, cm: "24.0 × 8.4 cm", desde: "Centro · 9.0 cm bajo el cuello" },
      Manga: { x: 50, y: 34, w: 30, cm: "5.0 × 1.8 cm", desde: "Manga izq. · 8.0 cm bajo el hombro" },
    },
    Silueta: Camisa,
  },
  {
    id: "playera",
    label: "Playera",
    vistas: ["Frente", "Espalda"],
    pos: {
      Frente: { x: 50, y: 36, w: 32, cm: "22.0 × 7.7 cm", desde: "Centro · 8.0 cm bajo el cuello" },
      Espalda: { x: 50, y: 26, w: 22, cm: "15.0 × 5.3 cm", desde: "Centro · 4.0 cm bajo el cuello" },
    },
    Silueta: Playera,
  },
  {
    id: "gorra",
    label: "Gorra",
    vistas: ["Frente", "Espalda"],
    pos: {
      Frente: { x: 50, y: 42, w: 30, cm: "10.0 × 3.5 cm", desde: "Panel frontal · centrado" },
      Espalda: { x: 50, y: 46, w: 20, cm: "6.0 × 2.1 cm", desde: "Panel trasero · sobre el ajustador" },
    },
    Silueta: Gorra,
  },
];

const colores = ["#2b2b30", "#1e3a8a", "#f4f4f5", "#7f1d1d"];

export default function Disenos() {
  const [prodId, setProdId] = useState("camisa");
  const [vista, setVista] = useState<Vista>("Frente");
  const [color, setColor] = useState(colores[0]);
  const prod = productos.find((p) => p.id === prodId)!;
  const v = prod.vistas.includes(vista) ? vista : "Frente";
  const pos = prod.pos[v]!;

  return (
    <section id="disenos" className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl pb-10 text-center md:pb-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand">Diseño sobre el producto</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Tu cliente ve cómo quedará antes de aprobar
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Dentro de la cotización colocas el logo sobre la silueta del producto, en frente, espalda o mangas, con
              medidas reales en centímetros. El cliente aprueba con una referencia visual y producción recibe exactamente
              qué va, de qué tamaño y dónde.
            </p>
          </div>

          <Reveal className="reveal-stagger grid items-start gap-6 lg:grid-cols-[1fr_340px]">
            {/* Editor ilustrado */}
            <div className="reveal overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-40px_rgba(27,23,53,.45)] ring-1 ring-gray-200/80">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <strong className="text-sm">Posición y arte</strong>
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">Posición 1</span>
                </div>
                <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Producto">
                  {productos.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={p.id === prodId}
                      onClick={() => setProdId(p.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        p.id === prodId ? "bg-brand text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-4 py-2.5">
                <div className="inline-flex overflow-hidden rounded-lg ring-1 ring-gray-200" role="tablist" aria-label="Vista">
                  {prod.vistas.map((x) => (
                    <button
                      key={x}
                      type="button"
                      role="tab"
                      aria-selected={x === v}
                      onClick={() => setVista(x)}
                      className={`px-3 py-1.5 text-xs font-medium ${x === v ? "bg-brand-soft text-brand-deep" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                      {x === "Manga" ? "Lateral izq." : x}
                    </button>
                  ))}
                </div>
                <span className="ml-auto text-[11px] text-gray-500">Color de la prenda</span>
                <div className="flex gap-1.5">
                  {colores.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Color ${c}`}
                      aria-pressed={c === color}
                      onClick={() => setColor(c)}
                      className={`h-6 w-6 rounded-full ring-2 ring-offset-1 ${c === color ? "ring-brand" : "ring-gray-200"}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative bg-[radial-gradient(circle_at_center,#f5f4fa,#ecebf3)] px-4 py-6">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[380px]">
                  <prod.Silueta vista={v} color={color} />
                  {/* Logo colocado */}
                  <div
                    key={prodId + v}
                    className="animate-appear absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${pos.w}%` }}
                  >
                    <div className="relative rounded-[3px] outline outline-2 outline-offset-2 outline-brand">
                      <LogoEjemplo />
                      <span className="absolute -right-2 -bottom-2 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand shadow" aria-hidden="true" />
                      <span className="absolute -top-6 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-brand shadow" aria-hidden="true" />
                    </div>
                    <span className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {pos.cm}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3 text-[11px]">
                <Chip strong>Posición 1</Chip>
                <Chip>{v === "Manga" ? "Lateral izq." : v}</Chip>
                <Chip>{pos.cm}</Chip>
                <Chip>{pos.desde}</Chip>
              </div>
            </div>

            {/* Beneficios */}
            <div className="reveal grid gap-4">
              <Beneficio icon={<Icon.check className="h-5 w-5" />} title="El cliente aprueba con certeza">
                Ve su logo sobre la prenda, el color y el tamaño reales. Menos idas y vueltas por WhatsApp y menos
                reclamos al entregar.
              </Beneficio>
              <Beneficio icon={<Icon.ruler className="h-5 w-5" />} title="Medidas reales en centímetros">
                Ancho, alto y distancia desde el hombro o el cuello, con proporciones bloqueadas y ajuste fino por
                flechas.
              </Beneficio>
              <Beneficio icon={<Icon.clipboard className="h-5 w-5" />} title="Producción sabe qué va y dónde">
                La orden de trabajo lleva cada posición con su vista, tamaño y arte. Nadie interpreta un mensaje de
                voz ni una foto borrosa.
              </Beneficio>
              <Beneficio icon={<Icon.sparkle className="h-5 w-5" />} title="Edición del arte incluida">
                Capas, colores y nodos del vector desde la misma cotización, para limpiar el logo antes de digitalizar o
                imprimir.
              </Beneficio>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Chip({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-1 ring-1 ${strong ? "bg-brand-soft font-semibold text-brand-deep ring-brand/30" : "bg-white text-gray-600 ring-gray-200"}`}>
      {children}
    </span>
  );
}

function Beneficio({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <article className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm shadow-black/[0.03] ring-1 ring-gray-200/80">
      <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-soft text-brand">{icon}</span>
      <div>
        <h3 className="font-semibold leading-snug">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{children}</p>
      </div>
    </article>
  );
}

/** Logo genérico de ejemplo (marca ficticia). */
function LogoEjemplo() {
  return (
    <svg viewBox="0 0 120 42" className="block h-auto w-full" aria-label="Logo de ejemplo">
      <rect x="1" y="1" width="118" height="40" rx="8" fill="#fff" />
      <rect x="4" y="4" width="112" height="34" rx="6" fill="#5b3bd5" />
      <text x="60" y="27.5" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="17" fill="#fff" letterSpacing="-0.5">
        TU LOGO
      </text>
    </svg>
  );
}

/* ── Siluetas (viewBox 0 0 400 500) ────────────────────────────────────── */

function Shade() {
  return (
    <defs>
      <linearGradient id="sil-shade" x1="0" x2="1">
        <stop offset="0" stopColor="#000" stopOpacity=".18" />
        <stop offset=".5" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".18" />
      </linearGradient>
    </defs>
  );
}

function Camisa({ vista, color }: { vista: Vista; color: string }) {
  const stroke = "rgba(0,0,0,.25)";
  if (vista === "Manga") {
    return (
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <Shade />
        <path d="M150 40 C190 30 230 34 255 50 L285 430 C250 448 175 450 140 432 Z" fill={color} stroke={stroke} strokeWidth="2" />
        <path d="M140 432 C175 450 250 448 285 430 L288 470 C250 486 172 486 138 470 Z" fill={color} stroke={stroke} strokeWidth="2" />
        <path d="M150 40 C190 30 230 34 255 50 L285 430 C250 448 175 450 140 432 Z" fill="url(#sil-shade)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <Shade />
      <path
        d="M150 40 L120 52 C95 62 72 70 62 95 L30 300 C28 330 30 360 34 395 L70 398 L82 215 L92 455 C140 480 260 480 308 455 L318 215 L330 398 L366 395 C370 360 372 330 370 300 L338 95 C328 70 305 62 280 52 L250 40 C232 52 168 52 150 40 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d="M150 40 L120 52 C95 62 72 70 62 95 L30 300 C28 330 30 360 34 395 L70 398 L82 215 L92 455 C140 480 260 480 308 455 L318 215 L330 398 L366 395 C370 360 372 330 370 300 L338 95 C328 70 305 62 280 52 L250 40 C232 52 168 52 150 40 Z"
        fill="url(#sil-shade)"
      />
      {vista === "Frente" ? (
        <>
          <path d="M150 40 L176 92 L200 64 L224 92 L250 40" fill="none" stroke={stroke} strokeWidth="2" />
          <line x1="200" y1="64" x2="200" y2="468" stroke={stroke} strokeWidth="1.5" />
          {[120, 180, 240, 300, 360, 420].map((y) => (
            <circle key={y} cx="207" cy={y} r="3" fill="rgba(255,255,255,.35)" />
          ))}
        </>
      ) : (
        <path d="M150 40 C170 56 230 56 250 40 M120 100 C170 115 230 115 280 100" fill="none" stroke={stroke} strokeWidth="2" />
      )}
    </svg>
  );
}

function Playera({ vista, color }: { vista: Vista; color: string }) {
  const stroke = "rgba(0,0,0,.25)";
  const body =
    "M145 50 L95 70 L35 135 L80 185 L112 160 L108 455 C160 472 240 472 292 455 L288 160 L320 185 L365 135 L305 70 L255 50 C240 74 160 74 145 50 Z";
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <Shade />
      <path d={body} fill={color} stroke={stroke} strokeWidth="2" />
      <path d={body} fill="url(#sil-shade)" />
      {vista === "Frente" ? (
        <path d="M145 50 C160 92 240 92 255 50" fill="none" stroke={stroke} strokeWidth="3" />
      ) : (
        <path d="M145 50 C165 66 235 66 255 50" fill="none" stroke={stroke} strokeWidth="3" />
      )}
    </svg>
  );
}

function Gorra({ vista, color }: { vista: Vista; color: string }) {
  const stroke = "rgba(0,0,0,.25)";
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <Shade />
      <path d="M70 300 C70 160 135 110 200 110 C265 110 330 160 330 300 Z" fill={color} stroke={stroke} strokeWidth="2" />
      <path d="M70 300 C70 160 135 110 200 110 C265 110 330 160 330 300 Z" fill="url(#sil-shade)" />
      <circle cx="200" cy="112" r="7" fill={color} stroke={stroke} strokeWidth="2" />
      {vista === "Frente" ? (
        <>
          <path d="M200 112 L200 300 M135 135 C120 190 115 250 118 300 M265 135 C280 190 285 250 282 300" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M60 300 C110 345 290 345 340 300 C330 330 280 370 200 372 C120 370 70 330 60 300 Z" fill={color} stroke={stroke} strokeWidth="2" />
        </>
      ) : (
        <>
          <path d="M150 300 C150 262 172 245 200 245 C228 245 250 262 250 300 Z" fill="#ecebf3" stroke={stroke} strokeWidth="2" />
          <rect x="160" y="292" width="80" height="10" rx="4" fill={color} stroke={stroke} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}
