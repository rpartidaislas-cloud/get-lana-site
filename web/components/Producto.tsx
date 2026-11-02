import Reveal from "./Reveal";
import { Icon } from "./icons";

/**
 * Sección "Producto" en bento grid (patrón "Feature Section with Bento Grid",
 * 21st.dev): dos pilares grandes con ilustración propia, cuatro celdas de apoyo.
 */
export default function Producto() {
  return (
    <section id="producto" className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand">Producto</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Lo que escribe un cliente termina en una cotización, no en un pendiente
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              LANA está hecha para la operación real de un taller: mensajes que llegan a cualquier hora, pedidos con
              cambios y precios que dependen de cantidad, técnica y tamaño.
            </p>
          </div>

          <Reveal className="reveal-stagger grid gap-4 md:grid-cols-6">
            {/* Pilar 1: bandeja */}
            <Cell className="md:col-span-3 lg:col-span-4">
              <CellHead icon={<Icon.inbox className="h-5 w-5" />} title="Una bandeja para WhatsApp, Messenger e Instagram">
                Cada conversación llega al mismo lugar con su historial. Tu equipo responde desde ahí sin cambiar de app
                ni perder el hilo.
              </CellHead>
              <InboxArt />
            </Cell>

            {/* Pilar 2: IA cotiza */}
            <Cell className="md:col-span-3 lg:col-span-2">
              <CellHead icon={<Icon.sparkle className="h-5 w-5" />} title="La IA cotiza con tu catálogo y tus reglas">
                Precios fijos, escalas por volumen, costos por técnica. Responde con tus números, no con estimaciones.
              </CellHead>
              <RulesArt />
            </Cell>

            <Small icon={<Icon.receipt className="h-5 w-5" />} title="Cotización formal desde el chat">
              Con folio, desglose por partida, descuento y total. El cliente la aprueba y paga sin que nadie vuelva a
              capturar el pedido.
            </Small>
            <Small icon={<Icon.cart className="h-5 w-5" />} title="Cotizador en línea para autoservicio">
              Publica tu catálogo con tus márgenes protegidos. El cliente elige producto, cantidad, técnica y zona del
              logo, y recibe su cotización al instante.
            </Small>
            <Small icon={<Icon.stages className="h-5 w-5" />} title="Seguimiento comercial por etapas">
              Cada oportunidad avanza de nuevo mensaje a cotizado, aprobado y pagado. Sabes qué está detenido y por qué.
            </Small>
            <Small icon={<Icon.shield className="h-5 w-5" />} title="Integración oficial con Meta">
              LANA opera sobre WhatsApp Business Platform, Messenger Platform e Instagram Messaging API como proveedor
              tecnológico verificado por Meta.
            </Small>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Cell({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <article
      className={`reveal group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-sm shadow-black/[0.03] ring-1 ring-gray-200/80 transition-shadow hover:shadow-[0_20px_50px_-24px_rgba(27,23,53,.35)] md:p-8 ${className}`}
    >
      {children}
    </article>
  );
}

function CellHead({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="relative z-10">
      <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">{icon}</span>
      <h3 className="text-lg font-semibold leading-snug">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{children}</p>
    </div>
  );
}

function Small({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Cell className="md:col-span-3 lg:col-span-3">
      <div className="flex gap-4">
        <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors group-hover:bg-brand-soft group-hover:text-brand">
          {icon}
        </span>
        <div>
          <h3 className="font-semibold leading-snug">{title}</h3>
          <p className="mt-1.5 text-sm text-gray-600">{children}</p>
        </div>
      </div>
    </Cell>
  );
}

/* ── Ilustraciones ─────────────────────────────────────────────────────── */

function InboxArt() {
  const rows = [
    { c: "#25D366", n: "Grupo Vértice", t: "Necesito 40 polos bordados…", s: "Cotizado" },
    { c: "#0866FF", n: "Café Central", t: "¿Tienen mandiles en negro?", s: "Nuevo" },
    { c: "#C13584", n: "Estudio Norte", t: "Respondió una historia", s: "Aprobado" },
    { c: "#25D366", n: "Colegio del Valle", t: "Gorras para el torneo, 120 pzas", s: "Pagado" },
  ];
  const tone: Record<string, string> = {
    Cotizado: "bg-brand-soft text-brand-deep",
    Nuevo: "bg-amber-50 text-amber-700",
    Aprobado: "bg-emerald-50 text-emerald-700",
    Pagado: "bg-emerald-600 text-white",
  };
  return (
    <div className="relative mt-6 flex-1 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
        {rows.map((r, i) => (
          <div
            key={r.n}
            className="flex items-center gap-3 rounded-lg bg-white px-3 py-2.5 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:translate-x-1 [&:not(:last-child)]:mb-1.5"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: r.c }} />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-[13px] font-semibold text-gray-900">{r.n}</div>
              <div className="truncate text-xs text-gray-500">{r.t}</div>
            </div>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${tone[r.s]}`}>{r.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RulesArt() {
  return (
    <div className="mt-6 flex-1 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs">
      <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span>Polo ejecutivo · bordado 8 × 8</span>
          <span className="rounded bg-brand-soft px-1.5 py-0.5 font-semibold text-brand-deep">Regla</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
          {[
            ["1–24", "$379"],
            ["25–99", "$319"],
            ["100+", "$289"],
          ].map(([q, p], i) => (
            <div key={q} className={`rounded-md px-1 py-1.5 ring-1 ${i === 1 ? "bg-brand text-white ring-brand" : "bg-gray-50 text-gray-700 ring-gray-200"}`}>
              <div className="text-[10px] opacity-80">{q} pzas</div>
              <div className="text-sm font-bold">{p}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 text-[11px]">
          <span className="text-gray-500">40 pzas × $319</span>
          <strong className="text-gray-900">$12,760</strong>
        </div>
      </div>
      <p className="mt-2 px-1 text-[11px] text-gray-500">Bordado · Serigrafía · DTF · Sublimación · Vinil · Lona</p>
    </div>
  );
}
