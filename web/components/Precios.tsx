"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Icon } from "./icons";
import { waPlan } from "@/lib/whatsapp";

/**
 * Planes y precios con toggle Mensual/Anual (−20 %). Cada botón abre WhatsApp
 * con un mensaje que ya indica el plan y el periodo elegidos.
 */
type Periodo = "mensual" | "anual";

type Plan = {
  kicker: string;
  name: string;
  mensual: number;
  anual?: number; // precio mensual equivalente en plan anual
  anualTotal?: number;
  ahorro?: number;
  popular?: boolean;
  capacidad?: [string, string, string][];
  items: string[];
  cta: string;
};

const planes: Plan[] = [
  {
    kicker: "Mensajería",
    name: "Inicio",
    mensual: 499,
    anual: 399,
    anualTotal: 4788,
    ahorro: 1200,
    capacidad: [
      ["Mensajes", "1,000", "/ mes"],
      ["Almacenamiento", "1 GB", "en la nube"],
      ["Facturación CFDI", "15", "timbres"],
    ],
    items: ["WhatsApp · Messenger · Instagram", "1 usuario", "Panel de administración completo", "Modo Tienda / POS", "Catálogo público", "Soporte por chat"],
    cta: "Crear cuenta gratis",
  },
  {
    kicker: "Mensajería + IA",
    name: "Esencial",
    mensual: 990,
    anual: 792,
    anualTotal: 9504,
    ahorro: 2376,
    capacidad: [
      ["Mensajes IA", "1,000", "/ mes"],
      ["Tokens Copilot", "1M", "/ mes"],
      ["Almacenamiento", "5 GB", "en la nube"],
      ["Facturación CFDI", "50", "timbres"],
    ],
    items: [
      "WhatsApp · Messenger · Instagram",
      "3 usuarios",
      "IA que cotiza, responde y atiende 24/7",
      "Panel de administración completo",
      "Modo Tienda / POS",
      "Catálogo público",
      "Portal del cliente",
      "Soporte por chat",
    ],
    cta: "Crear cuenta gratis",
  },
  {
    kicker: "★ Más popular",
    name: "Profesional",
    mensual: 1990,
    anual: 1592,
    anualTotal: 19104,
    ahorro: 4776,
    popular: true,
    capacidad: [
      ["Mensajes IA", "2,000", "/ mes"],
      ["Tokens Copilot", "4M", "/ mes"],
      ["Almacenamiento", "20 GB", "en la nube"],
      ["Facturación CFDI", "150", "timbres"],
    ],
    items: [
      "WhatsApp · Messenger · Instagram",
      "5 usuarios",
      "IA que cotiza, responde y atiende 24/7",
      "Panel de administración completo",
      "Modo Tienda / POS",
      "Catálogo público",
      "Portal del cliente",
      "Citas y agenda",
      "Mensajes masivos",
      "Soporte prioritario",
    ],
    cta: "Crear cuenta gratis",
  },
  {
    kicker: "Operación completa",
    name: "Empresarial",
    mensual: 3990,
    anual: 3192,
    anualTotal: 38304,
    ahorro: 9576,
    capacidad: [
      ["Mensajes IA", "4,000", "/ mes"],
      ["Tokens Copilot", "8M", "/ mes"],
      ["Almacenamiento", "50 GB", "en la nube"],
      ["Facturación CFDI", "300", "timbres"],
    ],
    items: [
      "Hasta 3 números de WhatsApp",
      "WhatsApp · Messenger · Instagram",
      "15 usuarios",
      "IA que cotiza, responde y atiende 24/7",
      "Panel de administración completo",
      "Modo Tienda / POS",
      "Catálogo público",
      "Portal del cliente",
      "Citas y agenda",
      "Mensajes masivos",
      "Sucursales",
      "Soporte prioritario",
    ],
    cta: "Crear cuenta gratis",
  },
];

const mxn = (n: number) => "$" + n.toLocaleString("en-US");

export default function Precios() {
  const [periodo, setPeriodo] = useState<Periodo>("mensual");

  return (
    <section id="precios">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl pb-10 text-center md:pb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand">Planes y precios</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              El plan que crece contigo
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              14 días de prueba gratuita en todos los planes, sin tarjeta. Integración acompañada en
              aproximadamente una semana. Cancela cuando quieras.
            </p>

            <div
              className="relative mx-auto mt-8 inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-200"
              role="group"
              aria-label="Periodo de facturación"
            >
              <span
                className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-brand transition-transform duration-300 ${periodo === "anual" ? "translate-x-full" : ""}`}
                aria-hidden="true"
              />
              {(["mensual", "anual"] as Periodo[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriodo(p)}
                  aria-pressed={periodo === p}
                  className={`relative z-10 w-36 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${periodo === p ? "text-white" : "text-gray-700"}`}
                >
                  {p === "mensual" ? "Mensual" : "Anual"}
                  {p === "anual" && (
                    <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${periodo === "anual" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"}`}>
                      −20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Reveal className="reveal-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {planes.map((plan) => (
              <Card key={plan.name} plan={plan} periodo={periodo} />
            ))}
          </Reveal>

          <p className="mx-auto mt-8 max-w-4xl text-center text-xs text-gray-500">
            Precios en pesos mexicanos, IVA incluido. Todos los planes incluyen 14 días de prueba gratuita sin tarjeta
            de crédito. Las conversaciones IA se cobran por mensajes; packs adicionales disponibles desde el panel. Los
            timbres CFDI comprados no vencen. No incluye cargos de mensajería de Meta ni otros servicios externos.
          </p>
        </div>
      </div>
    </section>
  );
}

function Card({ plan, periodo }: { plan: Plan; periodo: Periodo }) {
  const precio = periodo === "anual" && plan.anual != null ? plan.anual : plan.mensual;
  const detalle =
    periodo === "anual"
      ? `IVA incluido · ${mxn(plan.anualTotal!)} MXN/año · ahorras ${mxn(plan.ahorro!)}.`
      : "IVA incluido · 14 días de prueba gratuita, sin tarjeta.";

  return (
    <article
      className={`reveal relative flex flex-col rounded-2xl bg-white p-6 shadow-sm shadow-black/[0.03] ring-1 ${
        plan.popular ? "ring-2 ring-brand shadow-[0_30px_60px_-30px_rgba(91,59,213,.45)]" : "ring-gray-200/80"
      }`}
      aria-labelledby={`plan-${plan.name}`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Más popular
        </span>
      )}
      <div className={`text-[11px] font-semibold uppercase tracking-[.14em] ${plan.popular ? "text-brand" : "text-gray-500"}`}>
        {plan.popular ? "Recomendado" : plan.kicker}
      </div>
      <h3 id={`plan-${plan.name}`} className="mt-2 text-2xl font-bold">
        {plan.name}
      </h3>
      <div className="mt-3 flex items-baseline gap-1.5" aria-live="polite">
        <strong className="text-4xl font-bold tracking-tight">{mxn(precio)}</strong>
        <span className="text-sm text-gray-500">MXN / mes</span>
      </div>
      <p className="mt-1.5 min-h-[2.5rem] text-xs text-gray-500">{detalle}</p>

      {plan.capacidad && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="text-[11px] font-semibold text-gray-700">Capacidad mensual incluida</div>
          <dl className="mt-1.5 divide-y divide-gray-200 text-[12px]">
            {plan.capacidad.map(([k, v, u]) => (
              <div key={k} className="flex items-baseline justify-between gap-2 py-1.5">
                <dt className="text-gray-500">{k}</dt>
                <dd className="whitespace-nowrap text-right font-semibold text-gray-900">
                  {v} <small className="font-normal text-gray-500">{u}</small>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <ul className="mb-6 mt-4 space-y-2 text-[13px] text-gray-600">
        {plan.items.map((t) => (
          <li key={t} className="flex gap-2">
            <Icon.check className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
            {t}
          </li>
        ))}
      </ul>

      <a
        href={waPlan(plan.name, periodo)}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn mt-auto w-full ${
          plan.popular
            ? "bg-[linear-gradient(to_bottom,var(--color-brand),var(--color-brand-deep))] text-white shadow-brand/30 hover:brightness-110"
            : "bg-white text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50"
        }`}
      >
        {plan.cta}
      </a>
      <p className="mt-2 text-center text-[11px] text-gray-400">Te atendemos por WhatsApp</p>
    </article>
  );
}
