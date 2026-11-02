import Reveal from "./Reveal";
import { Icon } from "./icons";

/**
 * "Qué pasa después de que el cliente paga": tres pasos unidos por una línea
 * que se dibuja al entrar en pantalla, y una rejilla de capacidades.
 */
const pasos = [
  { n: "01", icon: <Icon.check className="h-5 w-5" />, t: "Cotización aprobada", d: "El cliente aprueba y paga desde el chat o el cotizador en línea." },
  { n: "02", icon: <Icon.clipboard className="h-5 w-5" />, t: "Orden de trabajo", d: "LANA crea la OT con producto, cantidades, técnica y datos del cliente." },
  { n: "03", icon: <Icon.factory className="h-5 w-5" />, t: "Compras y producción", d: "La OT genera la compra al proveedor y entra al calendario del taller." },
];

const capacidades = [
  { icon: <Icon.once className="h-5 w-5" />, t: "Sin doble captura", d: "El pedido se escribe una vez, en la conversación. De ahí sale todo lo demás." },
  { icon: <Icon.ruler className="h-5 w-5" />, t: "Reglas de arte por técnica", d: "Zonas, tamaños y costos de bordado, serigrafía, DTF, sublimación, vinil y lona." },
  { icon: <Icon.truck className="h-5 w-5" />, t: "Compras conectadas", d: "Cada OT indica qué prendas o insumos faltan y a qué proveedor pedirlos." },
  { icon: <Icon.calendar className="h-5 w-5" />, t: "Calendario de producción", d: "Capacidad, fechas comprometidas y qué está en máquina hoy." },
  { icon: <Icon.card className="h-5 w-5" />, t: "Pagos y remisiones", d: "Anticipos, liquidaciones y entrega con remisión desde el mismo registro." },
  { icon: <Icon.invoice className="h-5 w-5" />, t: "Facturación CFDI 4.0", d: "PDF y XML, cancelaciones y complementos de pago (paquete Operación)." },
];

export default function Flujo() {
  return (
    <section id="flujo" className="relative overflow-hidden bg-gray-950 text-gray-200">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/25 blur-3xl" />
        <div className="absolute inset-0 opacity-[.25] [background-image:linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand-glow">Cómo funciona</p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Qué pasa después de que el cliente paga
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              La cotización aprobada se vuelve orden de trabajo, la orden genera la compra y el trabajo entra a
              producción. Nadie vuelve a capturar el pedido.
            </p>
          </div>

          <Reveal className="reveal-stagger relative grid gap-6 md:grid-cols-3">
            <svg className="pointer-events-none absolute left-0 top-11 hidden h-0.5 w-full md:block" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
              <line x1="10" y1="1" x2="90" y2="1" stroke="url(#flow-grad)" strokeWidth="2" pathLength={1} className="flow-line" />
              <defs>
                <linearGradient id="flow-grad" x1="0" x2="1">
                  <stop offset="0" stopColor="#5b3bd5" stopOpacity="0" />
                  <stop offset=".2" stopColor="#8e74e8" />
                  <stop offset=".8" stopColor="#8e74e8" />
                  <stop offset="1" stopColor="#5b3bd5" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            {pasos.map((p) => (
              <article key={p.n} className="reveal relative rounded-2xl border border-white/10 bg-white/[.04] p-6 backdrop-blur-sm md:p-7">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-[0_0_0_6px_rgba(91,59,213,.18)]">{p.icon}</span>
                  <span className="text-xs font-semibold tracking-widest text-brand-glow">{p.n}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{p.t}</h3>
                <p className="mt-2 text-sm text-gray-400">{p.d}</p>
              </article>
            ))}
          </Reveal>

          <Reveal className="reveal-stagger mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
            {capacidades.map((c) => (
              <div key={c.t} className="reveal bg-gray-950 p-6 md:p-8">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/[.06] text-brand-glow">{c.icon}</span>
                <h3 className="mt-4 font-semibold text-white">{c.t}</h3>
                <p className="mt-1.5 text-sm text-gray-400">{c.d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
