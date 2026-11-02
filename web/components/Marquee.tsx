/**
 * Marquesina infinita con bordes difuminados y pausa al pasar el cursor
 * (patrón "Logo Marquee" de 21st.dev, escrito en CSS puro).
 * Fila 1: técnicas y productos que LANA cotiza. Fila 2: integraciones.
 */

const tecnicas = [
  "Bordado",
  "Serigrafía",
  "DTF",
  "Sublimación",
  "Vinil textil",
  "Lona y gran formato",
  "Gorras",
  "Playeras y polos",
  "Uniformes",
  "Artículos promocionales",
  "Chamarras",
  "Mochilas y bolsas",
];

const integraciones: { label: string; color: string }[] = [
  { label: "WhatsApp Business Platform", color: "#25D366" },
  { label: "Messenger Platform", color: "#0866FF" },
  { label: "Instagram Messaging API", color: "#C13584" },
  { label: "Meta · Proveedor verificado", color: "#0866FF" },
  { label: "Stripe · Pagos", color: "#635BFF" },
  { label: "CFDI 4.0 · Facturación", color: "#1d7a45" },
];

export default function Marquee() {
  return (
    <section aria-label="Técnicas, productos e integraciones de LANA" className="border-y border-gray-200/70 bg-white/60 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[.18em] text-gray-500">
          Cotiza cualquier técnica y producto de tu taller
        </p>
      </div>
      <Track>
        {tecnicas.map((t) => (
          <span key={t} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200">
            <Needle />
            {t}
          </span>
        ))}
      </Track>
      <div className="mt-4">
        <Track reverse>
          {integraciones.map((i) => (
            <span key={i.label} className="inline-flex items-center gap-2 whitespace-nowrap px-4 py-1 text-sm font-semibold text-gray-500">
              <span className="h-2 w-2 rounded-full" style={{ background: i.color }} aria-hidden="true" />
              {i.label}
            </span>
          ))}
        </Track>
      </div>
    </section>
  );
}

function Track({ children, reverse = false }: { children: React.ReactNode; reverse?: boolean }) {
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div
        className="animate-marquee flex w-max gap-3 group-hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        <div className="flex shrink-0 gap-3 pr-3">{children}</div>
        <div className="flex shrink-0 gap-3 pr-3" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

function Needle() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 20 18 6m0 0-2-2m2 2 2 2M8 16l-4 4" />
    </svg>
  );
}
