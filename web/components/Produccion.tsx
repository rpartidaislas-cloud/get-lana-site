"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Icon } from "./icons";
import { Beneficio } from "./Disenos";

/**
 * "Producción / Workflow": tablero como el de LANA (Sin asignar → Pendiente →
 * En proceso → QC → Listo → Entregado). Los trabajos avanzan con un botón,
 * igual que en el panel. Datos ficticios; OT-1842 es el pedido pagado en la
 * pestaña de cobro.
 */

const columnas = ["Sin asignar", "Pendiente", "En proceso", "QC", "Listo", "Entregado"] as const;
type Columna = (typeof columnas)[number];

type Trabajo = {
  ot: string;
  cliente: string;
  detalle: string;
  piezas: number;
  tecnica: string;
  recurso: string;
  responsable: string;
  entrega: string;
  col: Columna;
  nuevo?: boolean;
};

const inicial: Trabajo[] = [
  { ot: "OT-1844", cliente: "Constructora Norte", detalle: "Chalecos", piezas: 50, tecnica: "Serigrafía", recurso: "Pulpo 6 estaciones", responsable: "—", entrega: "18 nov", col: "Sin asignar" },
  { ot: "OT-1842", cliente: "Uniformes del Bajío", detalle: "Camisas manga larga", piezas: 20, tecnica: "Bordado", recurso: "Bordadora 6 cabezas", responsable: "Luis", entrega: "14 nov", col: "Pendiente", nuevo: true },
  { ot: "OT-1838", cliente: "Halcones F.C.", detalle: "Playeras", piezas: 36, tecnica: "DTF", recurso: "Prensa DTF", responsable: "Ana", entrega: "12 nov", col: "En proceso" },
  { ot: "OT-1835", cliente: "Café La Montaña", detalle: "Mandiles", piezas: 15, tecnica: "Bordado", recurso: "Bordadora 6 cabezas", responsable: "Luis", entrega: "11 nov", col: "QC" },
  { ot: "OT-1831", cliente: "Clínica Dental Alba", detalle: "Filipinas", piezas: 10, tecnica: "Bordado", recurso: "Bordadora 2 cabezas", responsable: "Marta", entrega: "10 nov", col: "Listo" },
];

const CAPACIDAD = 120;

export default function Produccion() {
  const [trabajos, setTrabajos] = useState(inicial);

  const avanzar = (ot: string) =>
    setTrabajos((ts) =>
      ts.map((t) => {
        if (t.ot !== ot) return t;
        const i = columnas.indexOf(t.col);
        const col = columnas[Math.min(i + 1, columnas.length - 1)];
        return { ...t, col, nuevo: false, responsable: t.responsable === "—" ? "Ana" : t.responsable };
      }),
    );

  const enCurso = trabajos.filter((t) => t.col === "Pendiente" || t.col === "En proceso").reduce((s, t) => s + t.piezas, 0);
  const pct = Math.min(100, Math.round((enCurso / CAPACIDAD) * 100));

  return (
    <Reveal className="reveal-stagger grid items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div className="reveal min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-40px_rgba(27,23,53,.45)] ring-1 ring-gray-200/80">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <strong className="text-sm">Producción / Workflow</strong>
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">Semana 46</span>
          </div>
          <button type="button" onClick={() => setTrabajos(inicial)} className="text-[11px] font-semibold text-brand hover:underline">
            Reiniciar demostración
          </button>
        </div>

        {/* Capacidad */}
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-gray-600">
            <span className="flex items-center gap-1.5">
              <Icon.calendar className="h-4 w-4 text-brand" /> Capacidad programada esta semana
            </span>
            <strong className="text-gray-900">
              {enCurso} de {CAPACIDAD} piezas
            </strong>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full rounded-full transition-all duration-500 ${pct > 85 ? "bg-amber-500" : "bg-brand"}`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Tablero */}
        <div className="overflow-x-auto">
          <div className="grid min-w-[690px] grid-cols-6 gap-1.5 p-2.5">
            {columnas.map((c) => {
              const items = trabajos.filter((t) => t.col === c);
              return (
                <div key={c} className="flex min-h-[260px] min-w-0 flex-col rounded-xl bg-gray-50 p-1.5 ring-1 ring-gray-200">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="truncate text-[11px] font-semibold text-gray-700">{c}</span>
                    <span className="rounded-full bg-white px-1.5 text-[10px] font-semibold text-gray-500 ring-1 ring-gray-200">{items.length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {items.map((t) => (
                      <article
                        key={t.ot}
                        className={`animate-appear min-w-0 rounded-lg bg-white p-2 text-[11px] shadow-sm ring-1 ${t.nuevo ? "ring-2 ring-brand" : "ring-gray-200"}`}
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-[12px] text-gray-900">{t.ot}</strong>
                          {t.nuevo && <span className="rounded bg-brand-soft px-1 text-[9px] font-bold text-brand-deep">PAGADA</span>}
                        </div>
                        <div className="mt-0.5 truncate font-medium text-gray-700">{t.cliente}</div>
                        <div className="text-[10px] leading-tight text-gray-500">
                          {t.piezas} {t.detalle.toLowerCase()} · {t.tecnica}
                        </div>
                        <div className="mt-1.5 grid gap-0.5 text-[10px] text-gray-500">
                          <span className="truncate">⚙ {t.recurso}</span>
                          <span>👤 {t.responsable}</span>
                          <span>📅 Entrega {t.entrega}</span>
                        </div>
                        {c !== "Entregado" ? (
                          <button
                            type="button"
                            onClick={() => avanzar(t.ot)}
                            aria-label={`Avanzar ${t.ot} a ${columnas[columnas.indexOf(c) + 1]}`}
                            className="mt-2 w-full rounded-md bg-gray-900 py-1 text-[10px] font-semibold text-white hover:bg-gray-800"
                          >
                            Avanzar
                          </button>
                        ) : (
                          <div className="mt-2 rounded-md bg-emerald-50 py-1 text-center text-[10px] font-semibold text-emerald-700">Entregado</div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="px-4 pb-3 text-[10px] text-gray-400 sm:hidden">Desliza el tablero hacia los lados para ver todas las etapas.</p>
      </div>

      <div className="reveal grid gap-4">
        <Beneficio icon={<Icon.clipboard className="h-5 w-5" />} title="La orden nace del pago">
          Cuando el cliente paga, LANA crea la orden de trabajo con productos, diseños y medidas. Nadie vuelve a capturar el
          pedido.
        </Beneficio>
        <Beneficio icon={<Icon.calendar className="h-5 w-5" />} title="Programada con tu capacidad">
          Cada trabajo lleva fecha compromiso, máquina o recurso y responsable, y la fecha de entrega sale de la capacidad
          real del taller.
        </Beneficio>
        <Beneficio icon={<Icon.check className="h-5 w-5" />} title="Cada quien ve su trabajo">
          El equipo entra a &ldquo;Mi trabajo&rdquo;, marca Empecé y Terminé y deja reportes escritos o por audio.
        </Beneficio>
        <Beneficio icon={<Icon.shield className="h-5 w-5" />} title="Calidad antes de entregar">
          Revisión de calidad como etapa propia: lo que sale al cliente ya fue revisado.
        </Beneficio>
      </div>
    </Reveal>
  );
}
