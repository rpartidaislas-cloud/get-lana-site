import Reveal from "./Reveal";
import { Icon } from "./icons";

/**
 * Precios. El plan Beta es el único con precio hoy, así que va resaltado y
 * ancho; Operación y Multisucursal como "Próximamente". Todos los IDs y el
 * `data-beta-open` los usa public/lana.js (precio, cupo, botón de reserva).
 */
const incluye = [
  "WhatsApp Business, Messenger e Instagram en una sola bandeja.",
  "Agentes de IA entrenados con tu catálogo, condiciones, preguntas frecuentes y estilo de atención.",
  "Catálogo interno con precios fijos, márgenes y escalas por volumen.",
  "Reglas de arte para bordado, serigrafía, DTF, sublimación, vinil y lona.",
  "Seguimiento por etapas y cotización rápida desde la conversación.",
  "E-commerce con catálogo, precios y cotizador de autoservicio.",
  "Sin límite de conversaciones ni cotizaciones durante la Beta.",
  "Soporte directo del equipo y cancelación cuando quieras.",
];

const proximos = [
  {
    kicker: "Operación completa",
    name: "LANA Operación",
    intro: "Ventas, administración y producción con una sola fuente de información. Todo lo de Chat IA, más:",
    items: [
      "Cotizaciones, aprobaciones, órdenes de trabajo, ventas y remisiones.",
      "Clientes, pagos, compras, proveedores e inventario.",
      "Workflow de producción, calendario y reportes.",
      "Facturación CFDI 4.0 con PDF, XML y complementos de pago.",
      "Mensajes masivos y campañas de Meta.",
    ],
  },
  {
    kicker: "Escala empresarial",
    name: "LANA Multisucursal",
    intro: "El mismo proceso comercial y operativo en todas tus sucursales. Todo lo de Operación, más:",
    items: [
      "Configuración multisucursal con procesos consistentes.",
      "Usuarios, roles y permisos por equipo.",
      "Acompañamiento para homologar catálogos y reglas.",
      "Soporte prioritario en la puesta en marcha.",
    ],
  },
];

export default function Precios() {
  return (
    <section id="precios">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl pb-10 text-center md:pb-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand">Precios</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Un precio de Fundador para los primeros 20 talleres
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              LANA Chat IA está en Beta con 20 lugares. Es un producto funcional que sigue mejorando; a cambio del
              acceso temprano, los primeros negocios pagan menos y trabajan directo con nosotros.
            </p>
          </div>

          <div className="beta-result mx-auto mb-6 max-w-3xl" id="betaResult" role="status" aria-live="polite">
            <Icon.check className="h-4 w-4" />
            <span id="betaResultText" />
          </div>

          <Reveal className="reveal-stagger">
            {/* Plan Beta */}
            <article
              className="reveal relative mx-auto grid max-w-4xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-40px_rgba(91,59,213,.45)] ring-1 ring-brand/20 md:grid-cols-2"
              aria-labelledby="pkg-chat"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(to_right,transparent,var(--color-brand),transparent)]" aria-hidden="true" />
              <div className="p-7 md:border-r md:border-gray-100 md:p-9">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Mensajería con IA</span>
                  <span className="rounded-md bg-lana-50 px-2 py-0.5 font-medium text-lana-700" id="betaStatusBadge">
                    Beta
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold" id="pkg-chat">
                  LANA Chat IA
                </h3>
                <div className="mt-5 flex flex-wrap items-baseline gap-x-3" aria-label="Precio Fundador 499 pesos al mes; precio regular 900">
                  <strong className="text-5xl font-bold tracking-tight" id="betaPrice">
                    $499
                  </strong>
                  <span className="text-gray-500">MXN / mes</span>
                  <s className="text-lg text-gray-400" aria-label="Precio regular">
                    $900
                  </s>
                </div>
                <div className="mt-2 text-sm text-gray-700">Precio Fundador Beta · IVA incluido</div>
                <p className="mt-1 text-xs text-gray-500">El primer cobro se realiza al activar tu lugar. Cancela cuando quieras.</p>
                <div className="mt-5 border-t border-gray-100 pt-4 text-sm" aria-label="Incluye siete días adicionales sin costo">
                  <strong>
                    <span id="betaBonusDays">7</span> días adicionales sin costo
                  </strong>
                  <p className="mt-0.5 text-gray-600">
                    Pagas hoy <span id="betaChargeToday">$499</span> y tu primer periodo dura <span id="betaInitialDays">37</span> días.
                    Después se renueva mensualmente.
                  </p>
                </div>
                <div className="mt-5" id="betaAvailability">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Lugares de Fundador</span>
                    <strong className="text-gray-900" id="betaAvailabilityText">
                      Consultando disponibilidad…
                    </strong>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
                    <div className="h-full w-0 rounded-full bg-lana-500 transition-[width] duration-700" id="betaAvailabilityValue" />
                  </div>
                </div>
                <button
                  type="button"
                  id="betaOpenButton"
                  data-beta-open="true"
                  className="btn mt-6 w-full bg-[linear-gradient(to_bottom,var(--color-brand),var(--color-brand-deep))] text-white shadow-brand/30 hover:brightness-110"
                >
                  Reservar mi lugar
                </button>
                <p className="mt-3 text-center text-xs text-gray-500" id="betaActionNote">
                  Pago seguro con Stripe. Tu primera renovación será 37 días después.
                </p>
              </div>
              <div className="bg-gray-50/70 p-7 md:p-9">
                <h4 className="font-semibold">Incluye</h4>
                <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
                  {incluye.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <Icon.check className="mt-0.5 h-4 w-4 flex-none text-brand" />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-gray-200 pt-4 text-sm text-gray-600">
                  Los primeros 20 negocios obtienen además <strong className="text-gray-900">30% de descuento</strong> en LANA Operación y
                  Multisucursal durante sus primeros 12 meses.
                </p>
              </div>
            </article>

            {/* Próximamente */}
            <div className="mx-auto mt-4 grid max-w-4xl gap-4 md:grid-cols-2">
              {proximos.map((p) => (
                <article key={p.name} className="reveal rounded-2xl bg-white p-7 shadow-sm shadow-black/[0.03] ring-1 ring-gray-200/80">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{p.kicker}</span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-600">Próximamente</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">{p.name}</h3>
                  <p className="mt-3 text-sm text-gray-600">{p.intro}</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    {p.items.map((t) => (
                      <li key={t} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gray-300" aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Reveal>

          <p className="mx-auto mt-8 max-w-4xl text-center text-xs text-gray-500">
            El precio de LANA Chat IA Beta incluye IVA. No incluye cargos que Meta u otros proveedores externos puedan
            aplicar por mensajería o servicios contratados directamente con ellos. La condición de Fundador no es un
            precio de por vida.
          </p>
        </div>
      </div>
    </section>
  );
}
