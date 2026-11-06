"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Icon } from "./icons";
import { Beneficio } from "./Disenos";

/**
 * "Cotización que se paga sola": versión simplificada de la página que recibe
 * el cliente (aceptar.html) con anticipo/total, métodos de pago y el paso a
 * orden de trabajo. Todo es ilustrativo: datos ficticios y sin campos donde
 * escribir datos de tarjeta.
 */

type Metodo = "tarjeta" | "mercadopago" | "stripe" | "spei" | "efectivo";

const metodos: { id: Metodo; label: string; sub: string; badge: string }[] = [
  { id: "tarjeta", label: "Tarjeta", sub: "Crédito o débito", badge: "▭" },
  { id: "mercadopago", label: "Mercado Pago", sub: "Pago en línea", badge: "MP" },
  { id: "stripe", label: "Stripe", sub: "Tarjeta", badge: "S" },
  { id: "spei", label: "SPEI", sub: "Transferencia", badge: "⇄" },
  { id: "efectivo", label: "Efectivo en tiendas", sub: "Referencia", badge: "$" },
];

const lineas = [
  { img: "/assets/prendas/camisa-caballero-frontal.webp", nombre: "Camisa manga larga caballero", det: "Azul marino · Bordado pecho 6 × 2 cm", cant: 12, pu: 395 },
  { img: "/assets/prendas/camisa-dama-frontal.webp", nombre: "Camisa manga larga dama", det: "Azul marino · Bordado pecho 5.5 × 1.9 cm", cant: 8, pu: 395 },
];
const TOTAL = lineas.reduce((t, l) => t + l.cant * l.pu, 0);
const mxn = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Cobro() {
  const [anticipo, setAnticipo] = useState(true);
  const [metodo, setMetodo] = useState<Metodo>("tarjeta");
  const [estado, setEstado] = useState<"pendiente" | "pagando" | "pagado">("pendiente");
  const monto = anticipo ? TOTAL / 2 : TOTAL;
  const paso = estado === "pagado" ? 3 : 2;

  const pagar = () => {
    if (estado !== "pendiente") return;
    setEstado("pagando");
    window.setTimeout(() => setEstado("pagado"), 1100);
  };

  return (
    <Reveal className="reveal-stagger grid items-start gap-6 lg:grid-cols-[1fr_340px]">
      {/* Página del cliente, en marco de navegador */}
      <div className="reveal overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-40px_rgba(27,23,53,.45)] ring-1 ring-gray-200/80">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2 text-[11px] text-gray-500">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="ml-2 truncate rounded-md bg-white px-2 py-0.5 ring-1 ring-gray-200">tutaller.mx/cotizacion/TT-2481</span>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          {/* Encabezado */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-gray-500">Tu pedido</p>
              <h3 className="text-xl font-bold">Taller Ejemplo</h3>
              <p className="text-xs text-gray-500">Cliente: Uniformes Corporativos del Bajío · 20 piezas</p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-lg bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-deep ring-1 ring-brand/20">Folio TT-2481</span>
              <p className="mt-1 text-[11px] text-emerald-700">Vigente 15 días</p>
            </div>
          </div>

          {/* Avance */}
          <ol className="grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3 text-center text-[11px] ring-1 ring-gray-200">
            {["Cotización enviada", "Pago", "Aceptada"].map((t, i) => {
              const n = i + 1;
              const hecho = n < paso || (n === 3 && estado === "pagado");
              const actual = n === paso && !hecho;
              return (
                <li key={t} className="flex flex-col items-center gap-1">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                      hecho ? "bg-emerald-600 text-white" : actual ? "bg-brand text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {hecho ? "✓" : n}
                  </span>
                  <span className={hecho ? "font-semibold text-emerald-700" : actual ? "font-semibold text-brand-deep" : "text-gray-400"}>{t}</span>
                </li>
              );
            })}
          </ol>

          {/* Resumen */}
          <div className="rounded-xl ring-1 ring-gray-200">
            {lineas.map((l) => (
              <div key={l.nombre} className="flex items-center gap-3 border-b border-gray-100 px-3 py-2.5 last:border-b-0">
                <span className="relative h-12 w-10 flex-none overflow-hidden rounded-md bg-gray-100">
                  <img src={l.img} alt="" className="absolute inset-0 h-full w-full object-contain" />
                  <span
                    className="absolute inset-0"
                    style={{ background: "#24345e", mixBlendMode: "multiply", WebkitMask: `url(${l.img}) center / contain no-repeat`, mask: `url(${l.img}) center / contain no-repeat` }}
                    aria-hidden="true"
                  />
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="truncate text-[13px] font-semibold">{l.nombre}</div>
                  <div className="truncate text-[11px] text-gray-500">{l.det}</div>
                </div>
                <div className="text-right text-[12px]">
                  <div className="text-gray-500">
                    {l.cant} × {mxn(l.pu)}
                  </div>
                  <div className="font-semibold">{mxn(l.cant * l.pu)}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between bg-gray-50 px-3 py-2.5 text-sm">
              <span className="text-gray-600">Total del pedido</span>
              <strong className="text-brand-deep">{mxn(TOTAL)}</strong>
            </div>
          </div>

          {estado !== "pagado" ? (
            <>
              {/* Anticipo / total */}
              <div>
                <p className="mb-1.5 text-xs font-semibold text-gray-700">¿Cuánto quieres pagar ahora?</p>
                <div className="flex flex-wrap gap-2">
                  {[true, false].map((a) => (
                    <button
                      key={String(a)}
                      type="button"
                      onClick={() => setAnticipo(a)}
                      aria-pressed={anticipo === a}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                        anticipo === a ? "bg-brand-soft text-brand-deep ring-brand" : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {a ? `Anticipo 50 % · ${mxn(TOTAL / 2)}` : `Total · ${mxn(TOTAL)}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Métodos */}
              <div>
                <p className="mb-1.5 text-xs font-semibold text-gray-700">¿Cómo deseas pagar?</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {metodos.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMetodo(m.id)}
                      aria-pressed={metodo === m.id}
                      className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-center ring-1 transition ${
                        metodo === m.id ? "bg-brand-soft ring-2 ring-brand" : "bg-white ring-gray-200 hover:ring-brand/40"
                      }`}
                    >
                      <span className={`flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[10px] font-bold ${metodo === m.id ? "bg-brand text-white" : "bg-gray-100 text-gray-600"}`}>
                        {m.badge}
                      </span>
                      <span className="text-[12px] font-semibold leading-tight">{m.label}</span>
                      <span className="text-[10px] text-gray-500">{m.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vista previa del método (ilustrativa, sin campos) */}
              <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200" aria-live="polite">
                <VistaMetodo metodo={metodo} monto={monto} />
              </div>

              <button
                type="button"
                onClick={pagar}
                disabled={estado === "pagando"}
                className="btn w-full bg-[linear-gradient(to_bottom,var(--color-brand),var(--color-brand-deep))] text-white shadow-brand/30 hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
              >
                {estado === "pagando" ? "Procesando pago…" : `Pagar ${mxn(monto)} MXN`}
              </button>
              <p className="text-center text-[10px] text-gray-400">Demostración: no se realiza ningún cobro.</p>
            </>
          ) : (
            <div className="animate-appear space-y-3 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Icon.check className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-emerald-800">Pago recibido · {mxn(monto)}</p>
                  <p className="text-xs text-emerald-700">{anticipo ? `Saldo pendiente ${mxn(TOTAL - monto)} contra entrega.` : "Pedido liquidado."}</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs ring-1 ring-emerald-100">
                <span className="flex items-center gap-2 text-gray-700">
                  <Icon.clipboard className="h-4 w-4 text-brand" /> Se creó la orden de trabajo
                </span>
                <strong className="text-brand-deep">OT-1842</strong>
              </div>
              <button type="button" onClick={() => setEstado("pendiente")} className="text-xs font-semibold text-brand hover:underline">
                Ver de nuevo la demostración
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Beneficios */}
      <div className="reveal grid gap-4">
        <Beneficio icon={<Icon.receipt className="h-5 w-5" />} title="Un enlace, lista para pagar">
          Envías la cotización por WhatsApp. Tu cliente revisa productos, diseños y total, y paga desde la misma página.
        </Beneficio>
        <Beneficio icon={<Icon.card className="h-5 w-5" />} title="Cinco formas de pago">
          Tarjeta, Mercado Pago, Stripe, transferencia SPEI y efectivo en tiendas. Tu cliente elige la que le acomode.
        </Beneficio>
        <Beneficio icon={<Icon.check className="h-5 w-5" />} title="Anticipo o pago total">
          Define el porcentaje de anticipo. El saldo queda registrado y se cobra al entregar.
        </Beneficio>
        <Beneficio icon={<Icon.clipboard className="h-5 w-5" />} title="Pagado = orden de trabajo">
          Al confirmarse el pago, LANA crea la orden de trabajo con los diseños y medidas. Nadie vuelve a capturar el pedido.
        </Beneficio>
      </div>
    </Reveal>
  );
}

function VistaMetodo({ metodo, monto }: { metodo: Metodo; monto: number }) {
  if (metodo === "spei") {
    return (
      <div className="grid gap-1.5 text-xs">
        <Fila k="Banco" v="Banco de ejemplo" />
        <Fila k="CLABE" v="000 000 0000 0000 0000" mono />
        <Fila k="Importe" v={`${mxn(monto)} MXN`} />
        <p className="text-[11px] text-gray-500">El pago se confirma automáticamente al recibir la transferencia.</p>
      </div>
    );
  }
  if (metodo === "efectivo") {
    return (
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex h-12 flex-1 items-end gap-[2px] rounded-md bg-white px-3 py-2 ring-1 ring-gray-200" aria-hidden="true">
          {Array.from({ length: 46 }, (_, i) => (
            <span key={i} className="bg-gray-800" style={{ width: i % 3 === 0 ? 3 : 1.5, height: "100%" }} />
          ))}
        </div>
        <div className="grid gap-1">
          <Fila k="Referencia" v="0000 0000 0000" mono />
          <Fila k="Importe" v={`${mxn(monto)} MXN`} />
        </div>
        <p className="w-full text-[11px] text-gray-500">Paga en tiendas de conveniencia con esta referencia.</p>
      </div>
    );
  }
  if (metodo === "mercadopago" || metodo === "stripe") {
    return (
      <p className="text-xs text-gray-600">
        Al pagar, tu cliente continúa en la página segura de <strong>{metodo === "stripe" ? "Stripe" : "Mercado Pago"}</strong> y regresa a su
        cotización con el pago confirmado.
      </p>
    );
  }
  // Tarjeta: ilustración de la tarjeta, sin campos para escribir.
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative h-[90px] w-[160px] flex-none overflow-hidden rounded-xl bg-[linear-gradient(135deg,#5b3bd5,#24345e)] p-3 text-white shadow-md" aria-hidden="true">
        <span className="block h-4 w-6 rounded-sm bg-amber-300/90" />
        <span className="mt-3 block whitespace-nowrap font-mono text-[10px] tracking-[.12em]">•••• •••• •••• 4242</span>
        <span className="mt-1 block text-[9px] uppercase opacity-80">Titular de ejemplo</span>
      </div>
      <p className="min-w-[160px] flex-1 text-xs text-gray-600">
        Tu cliente captura su tarjeta en un formulario cifrado del procesador de pagos. Los datos se tokenizan y no se
        guardan en LANA.
      </p>
    </div>
  );
}

function Fila({ k, v, mono = false }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500">{k}</span>
      <span className={`font-semibold text-gray-900 ${mono ? "font-mono" : ""}`}>{v}</span>
    </div>
  );
}
