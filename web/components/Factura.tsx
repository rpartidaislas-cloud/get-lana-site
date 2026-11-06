"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Icon } from "./icons";
import { Beneficio } from "./Disenos";

/**
 * "Factura CFDI 4.0": versión simplificada de la página donde el cliente se
 * factura solo (facturar.html). Datos fiscales ficticios ya cargados, sin
 * campos para escribir; "Timbrar" muestra un comprobante de ejemplo.
 */

const TOTAL = 7900; // mismo pedido de la pestaña de cobro (IVA incluido)
const SUBTOTAL = Math.round((TOTAL / 1.16) * 100) / 100;
const IVA = Math.round((TOTAL - SUBTOTAL) * 100) / 100;
const mxn = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const conceptos = [
  { clave: "53101602", unidad: "H87 · Pieza", desc: "Camisa manga larga caballero con bordado", cant: 12, pu: 395 },
  { clave: "53101604", unidad: "H87 · Pieza", desc: "Camisa manga larga dama con bordado", cant: 8, pu: 395 },
];

const receptor = [
  ["RFC", "UCB120315AB1"],
  ["Razón social", "UNIFORMES CORPORATIVOS DEL BAJIO"],
  ["Régimen fiscal", "601 · General de Ley Personas Morales"],
  ["Uso del CFDI", "G03 · Gastos en general"],
  ["Código postal", "37000"],
];

export default function Factura() {
  const [estado, setEstado] = useState<"datos" | "timbrando" | "timbrada">("datos");

  const timbrar = () => {
    if (estado !== "datos") return;
    setEstado("timbrando");
    window.setTimeout(() => setEstado("timbrada"), 1100);
  };

  return (
    <Reveal className="reveal-stagger grid items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div className="reveal overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-40px_rgba(27,23,53,.45)] ring-1 ring-gray-200/80">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2 text-[11px] text-gray-500">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="ml-2 truncate rounded-md bg-white px-2 py-0.5 ring-1 ring-gray-200">tutaller.mx/facturar/TT-2481</span>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-gray-500">Factura tu pedido</p>
              <h3 className="text-xl font-bold">Taller Ejemplo</h3>
              <p className="text-xs text-gray-500">Pedido TT-2481 · OT-1842 · Total {mxn(TOTAL)}</p>
            </div>
            <span className="rounded-lg bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-deep ring-1 ring-brand/20">CFDI 4.0</span>
          </div>

          {estado !== "timbrada" ? (
            <>
              <div className="rounded-xl ring-1 ring-gray-200">
                <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
                  <span className="text-xs font-semibold text-gray-700">Datos fiscales del cliente</span>
                  <span className="text-[10px] text-gray-400">Guardados de su última factura</span>
                </div>
                <dl className="divide-y divide-gray-100 text-xs">
                  {receptor.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 px-3 py-2">
                      <dt className="text-gray-500">{k}</dt>
                      <dd className="text-right font-semibold text-gray-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <Conceptos />
              <button
                type="button"
                onClick={timbrar}
                disabled={estado === "timbrando"}
                className="btn w-full bg-[linear-gradient(to_bottom,var(--color-brand),var(--color-brand-deep))] text-white shadow-brand/30 hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
              >
                {estado === "timbrando" ? "Timbrando ante el SAT…" : "Timbrar factura"}
              </button>
              <p className="text-center text-[10px] text-gray-400">Demostración: datos ficticios, no se timbra ningún comprobante.</p>
            </>
          ) : (
            <div className="animate-appear space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Icon.check className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-emerald-800">Factura timbrada</p>
                  <p className="truncate font-mono text-[11px] text-emerald-700">UUID 3F2A9C1D-7B4E-4C8A-9E21-5D0B6A7F1C34</p>
                </div>
              </div>

              <div className="rounded-xl ring-1 ring-gray-200">
                <div className="grid gap-x-4 gap-y-1 border-b border-gray-100 px-3 py-2.5 text-[11px] sm:grid-cols-2">
                  <Dato k="Emisor" v="TALLER EJEMPLO" />
                  <Dato k="Receptor" v="UCB120315AB1" />
                  <Dato k="Serie y folio" v="A-1027" />
                  <Dato k="Fecha de timbrado" v="06/11/2026 12:41" />
                  <Dato k="Forma de pago" v="04 · Tarjeta de crédito" />
                  <Dato k="Método de pago" v="PPD · Parcialidades" />
                </div>
                <Conceptos embebido />
              </div>

              <div className="flex flex-wrap gap-2">
                {["PDF", "XML"].map((f) => (
                  <span key={f} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                    <Icon.invoice className="h-4 w-4 text-brand" /> {f}
                  </span>
                ))}
                <span className="ml-auto self-center text-[11px] text-gray-500">Enviados al correo del cliente</span>
              </div>

              <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800 ring-1 ring-amber-200">
                Se pagó un anticipo de {mxn(TOTAL / 2)}: al liquidar el saldo, LANA genera el complemento de pago.
              </p>

              <button type="button" onClick={() => setEstado("datos")} className="text-xs font-semibold text-brand hover:underline">
                Ver de nuevo la demostración
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="reveal grid gap-4">
        <Beneficio icon={<Icon.receipt className="h-5 w-5" />} title="Tu cliente se factura solo">
          Desde el enlace de su pedido confirma sus datos fiscales y obtiene su factura, sin pedírtela por WhatsApp.
        </Beneficio>
        <Beneficio icon={<Icon.invoice className="h-5 w-5" />} title="PDF y XML al instante">
          CFDI 4.0 con claves del SAT por producto y técnica, IVA desglosado y envío automático al correo del cliente.
        </Beneficio>
        <Beneficio icon={<Icon.card className="h-5 w-5" />} title="Complementos de pago">
          Si el cliente pagó anticipo, al liquidar se genera el complemento de pago del saldo.
        </Beneficio>
        <Beneficio icon={<Icon.shield className="h-5 w-5" />} title="Cancelaciones ante el SAT">
          Cancela con el motivo oficial desde el panel. Los timbres vienen incluidos en tu plan.
        </Beneficio>
      </div>
    </Reveal>
  );
}

function Conceptos({ embebido = false }: { embebido?: boolean }) {
  return (
    <div className={embebido ? "" : "rounded-xl ring-1 ring-gray-200"}>
      {conceptos.map((c) => (
        <div key={c.clave} className="flex items-start justify-between gap-3 border-b border-gray-100 px-3 py-2 text-[11px]">
          <div className="min-w-0">
            <div className="font-semibold text-gray-900">{c.desc}</div>
            <div className="text-gray-500">
              Clave SAT {c.clave} · {c.unidad} · {c.cant} × {mxn(c.pu)}
            </div>
          </div>
          <span className="whitespace-nowrap font-semibold">{mxn(c.cant * c.pu)}</span>
        </div>
      ))}
      <div className="grid gap-0.5 px-3 py-2 text-[11px]">
        <Dato k="Subtotal" v={mxn(SUBTOTAL)} />
        <Dato k="IVA 16 %" v={mxn(IVA)} />
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-gray-700">Total</span>
          <strong className="text-brand-deep">{mxn(TOTAL)}</strong>
        </div>
      </div>
    </div>
  );
}

function Dato({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500">{k}</span>
      <span className="text-right font-semibold text-gray-900">{v}</span>
    </div>
  );
}
