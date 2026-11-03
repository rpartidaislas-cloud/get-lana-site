"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Icon } from "./icons";

/**
 * "Diseño sobre el producto": ilustra el editor de posición y arte de las
 * cotizaciones con las mismas prendas fotográficas recoloreables que usa
 * LANA (public/assets/prendas, recortadas del repo promodesk). El color se
 * aplica multiplicando sobre la foto blanca con la propia silueta como
 * máscara, igual que el configurador. Logo genérico de ejemplo.
 */

type Prenda = {
  id: string;
  label: string;
  src: string;
  vista: string;
  // Posición del logo en % del lienzo (800×1000) y ancho del logo en %.
  logo: { x: number; y: number; w: number };
  cm: string;
  desde: string;
};

const prendas: Prenda[] = [
  {
    id: "camisa-caballero",
    label: "Camisa caballero",
    src: "/assets/prendas/camisa-caballero-frontal.webp",
    vista: "Frente",
    logo: { x: 65.4, y: 29.8, w: 13 },
    cm: "6.0 × 2.1 cm",
    desde: "Pecho izquierdo · 20.2 cm desde el hombro",
  },
  {
    id: "camisa-dama",
    label: "Camisa dama",
    src: "/assets/prendas/camisa-dama-frontal.webp",
    vista: "Frente",
    logo: { x: 63.9, y: 26.7, w: 12 },
    cm: "5.5 × 1.9 cm",
    desde: "Pecho izquierdo · 17.5 cm desde el hombro",
  },
];

const colores: { hex: string; name: string }[] = [
  { hex: "#ffffff", name: "Blanco" },
  { hex: "#9aa3b2", name: "Gris" },
  { hex: "#24345e", name: "Azul marino" },
  { hex: "#3a3a40", name: "Negro" },
  { hex: "#7a2430", name: "Vino" },
];

export default function Disenos() {
  const [prendaId, setPrendaId] = useState(prendas[0].id);
  const [color, setColor] = useState(colores[2]);
  const prenda = prendas.find((p) => p.id === prendaId)!;
  const mask = `url(${prenda.src}) center / contain no-repeat`;

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
              Dentro de la cotización colocas el logo sobre la prenda real, en frente, espalda o mangas, con medidas en
              centímetros. El cliente aprueba con una referencia visual y producción recibe exactamente qué va, de qué
              tamaño y dónde.
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
                <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Prenda">
                  {prendas.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={p.id === prendaId}
                      onClick={() => setPrendaId(p.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        p.id === prendaId ? "bg-brand text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-4 py-2.5">
                <div className="inline-flex overflow-hidden rounded-lg text-xs ring-1 ring-gray-200">
                  <span className="bg-brand-soft px-3 py-1.5 font-medium text-brand-deep">Frente</span>
                  <span className="px-3 py-1.5 text-gray-400">Espalda</span>
                  <span className="px-3 py-1.5 text-gray-400">Lateral izq.</span>
                  <span className="px-3 py-1.5 text-gray-400">Lateral der.</span>
                </div>
                <span className="ml-auto text-[11px] text-gray-500">Color: {color.name}</span>
                <div className="flex gap-1.5">
                  {colores.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      aria-label={`Color ${c.name}`}
                      aria-pressed={c.hex === color.hex}
                      onClick={() => setColor(c)}
                      className={`h-6 w-6 rounded-full ring-2 ring-offset-1 ${c.hex === color.hex ? "ring-brand" : "ring-gray-200"}`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative bg-[radial-gradient(circle_at_center,#f5f4fa,#e9e8f1)] px-4 py-6">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[400px]">
                  {/* Foto de la prenda (blanca) + capa de color con la silueta como máscara */}
                  <img
                    src={prenda.src}
                    alt={`${prenda.label}, vista frontal`}
                    width={800}
                    height={1000}
                    className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_20px_30px_rgba(27,23,53,.18)]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 transition-colors duration-300"
                    style={{
                      background: color.hex,
                      mixBlendMode: "multiply",
                      WebkitMask: mask,
                      mask,
                    }}
                  />
                  {/* Logo colocado */}
                  <div
                    key={prendaId}
                    className="animate-appear absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${prenda.logo.x}%`, top: `${prenda.logo.y}%`, width: `${prenda.logo.w}%` }}
                  >
                    <div className="relative rounded-[2px] outline outline-2 outline-offset-2 outline-brand">
                      <LogoEjemplo />
                      <span className="absolute -right-2 -bottom-2 h-3 w-3 rounded-full border-2 border-white bg-brand shadow" aria-hidden="true" />
                      <span className="absolute -top-5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-white bg-brand shadow" aria-hidden="true" />
                    </div>
                    <span className="absolute left-1/2 top-full mt-2.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {prenda.cm}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3 text-[11px]">
                <Chip strong>Posición 1</Chip>
                <Chip>{prenda.vista}</Chip>
                <Chip>{prenda.cm}</Chip>
                <Chip>{prenda.desde}</Chip>
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
