import Legacy from "./Legacy";
import PhoneChat from "./PhoneChat";

/**
 * Hero adaptado de "Hero with Mockup" (serafimcloud, 21st.dev): titular con
 * degradado, entradas escalonadas (animate-appear), glow de fondo y mockup.
 * El mockup combina la bandeja de LANA (heredada) con el teléfono animado.
 */
export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* Glow de fondo */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="animate-appear-zoom absolute left-1/2 top-[-10%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,59,213,.28),rgba(91,59,213,0))] opacity-0 blur-2xl [animation-delay:400ms]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--color-gray-50))]" />
        <div className="absolute inset-0 opacity-[.35] [background-image:linear-gradient(to_right,rgba(27,23,53,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(27,23,53,.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-10 pt-32 md:pb-16 md:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-appear mb-6 inline-flex flex-wrap items-center justify-center gap-2 opacity-0">
              <Channel color="#25D366" label="WhatsApp Business" />
              <Channel color="#0866FF" label="Messenger" />
              <Channel color="#C13584" label="Instagram" />
            </div>
            <h1 className="animate-appear mb-6 bg-[linear-gradient(to_bottom,var(--color-gray-900),var(--color-gray-900)_60%,var(--color-gray-600))] bg-clip-text text-5xl font-bold leading-[1.05] tracking-tight text-transparent opacity-0 [animation-delay:120ms] md:text-6xl lg:text-7xl">
              Responde, cotiza y produce desde una sola conversación
            </h1>
            <p className="animate-appear mx-auto mb-8 max-w-2xl text-lg text-gray-600 opacity-0 [animation-delay:240ms] md:text-xl">
              LANA es la plataforma comercial para talleres de bordado, impresión y artículos promocionales. Tus chats
              llegan a una sola bandeja, la IA cotiza con tu catálogo y tus precios, y cada pedido pagado se convierte en
              una orden de trabajo.
            </p>
            <div className="animate-appear flex flex-wrap items-center justify-center gap-3 opacity-0 [animation-delay:360ms]">
              <a
                href="#precios"
                data-demo-request-open="true"
                className="btn group bg-[linear-gradient(to_bottom,var(--color-brand),var(--color-brand-deep))] text-white shadow-brand/30 hover:brightness-110"
              >
                Solicitar una demostración
                <span className="ml-1 text-white/60 transition-transform group-hover:translate-x-0.5">-&gt;</span>
              </a>
              <a href="#demo" data-demo-open="true" className="btn bg-white text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50">
                Probar el chat con IA
              </a>
            </div>
            <p className="animate-appear mt-4 text-xs text-gray-500 opacity-0 [animation-delay:480ms]">
              Proveedor tecnológico verificado por Meta · Beta con 20 lugares de Fundador
            </p>
          </div>

          {/* Mockup: bandeja + teléfono */}
          <div className="animate-appear relative mx-auto mt-14 max-w-5xl opacity-0 [animation-delay:600ms] md:mt-20">
            <div className="hidden md:block">
              <div className="lana-mock relative mr-52 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_40px_80px_-30px_rgba(27,23,53,.35)] lg:mr-60">
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  <span className="ml-3 rounded-md bg-white px-2 py-0.5 ring-1 ring-gray-200">app.get-lana.com</span>
                </div>
                <Legacy name="mock" />
              </div>
              <div className="animate-float absolute -bottom-6 right-0 z-10 origin-bottom-right scale-[.82] lg:scale-90">
                <PhoneChat />
              </div>
            </div>
            <div className="md:hidden">
              <PhoneChat />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Channel({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
      {label}
    </span>
  );
}
