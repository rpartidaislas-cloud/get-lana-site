"use client";

import { useState } from "react";
import { DisenoPanel } from "./Disenos";
import Cobro from "./Cobro";

/**
 * "Lo que hace LANA": galería con pestañas. Cada pestaña es una demostración
 * interactiva de una función. Para agregar otra, se suma un elemento a `tabs`.
 */
const tabs = [
  {
    id: "diseno",
    label: "Diseño sobre la prenda",
    kicker: "Diseño sobre el producto",
    title: "Tu cliente ve cómo quedará antes de aprobar",
    intro:
      "Dentro de la cotización colocas el logo sobre la prenda real, con medidas en centímetros. El cliente aprueba con una referencia visual y producción recibe exactamente qué va, de qué tamaño y dónde.",
  },
  {
    id: "cobro",
    label: "Cotización que se paga",
    kicker: "Cobro desde la cotización",
    title: "Tu cliente aprueba y paga desde el mismo enlace",
    intro:
      "La cotización que envías por WhatsApp es una página donde tu cliente revisa el pedido, elige anticipo o pago total y paga con el método que prefiera. Al pagar, el pedido entra solo a producción.",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Galeria() {
  const [tab, setTab] = useState<TabId>("diseno");
  const t = tabs.find((x) => x.id === tab)!;

  return (
    <section id="disenos" className="relative">
      <span id="galeria" className="sr-only" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl pb-8 text-center md:pb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand">Lo que hace LANA · Pruébalo</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">{t.title}</h2>
            <p className="mt-4 text-lg text-gray-600">{t.intro}</p>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-200" role="tablist" aria-label="Funciones de LANA">
              {tabs.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  id={`tab-${x.id}`}
                  aria-selected={tab === x.id}
                  aria-controls={`panel-${x.id}`}
                  onClick={() => setTab(x.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                    tab === x.id ? "bg-brand text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
          </div>

          {/* Se montan ambos paneles para conservar el estado al cambiar de pestaña. */}
          <div id="panel-diseno" role="tabpanel" aria-labelledby="tab-diseno" hidden={tab !== "diseno"}>
            <DisenoPanel />
          </div>
          <div id="panel-cobro" role="tabpanel" aria-labelledby="tab-cobro" hidden={tab !== "cobro"}>
            <Cobro />
          </div>
        </div>
      </div>
    </section>
  );
}
