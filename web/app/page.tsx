import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Faq from "@/components/Faq";
import Legacy from "@/components/Legacy";
import Producto from "@/components/Producto";
import Flujo from "@/components/Flujo";
import Precios from "@/components/Precios";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
      <Header />
      <main className="grow">
        <Hero />
        <Marquee />
        <Producto />
        <Flujo />
        {/* Fase 3: testimonio → carrusel con betas reales. */}
        <Legacy name="taller" />
        <Precios />
        <Faq />
        <Legacy name="cta" />
      </main>
      <Legacy name="footer" />
      {/* Diálogo de demo del chat, controlado por public/lana.js. */}
      <Legacy name="demo" />
    </div>
  );
}
