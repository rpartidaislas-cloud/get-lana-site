import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Faq from "@/components/Faq";
import Legacy from "@/components/Legacy";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
      <Header />
      <main className="grow">
        <Hero />
        <Marquee />
        {/* Fase 2: estas secciones se rediseñan (bento, flujo animado, pricing). */}
        <Legacy name="producto" />
        <Legacy name="flujo" />
        <Legacy name="taller" />
        <Legacy name="precios" />
        <Faq />
        <Legacy name="cta" />
      </main>
      <Legacy name="footer" />
      {/* Diálogos que controla public/lana.js (beta y demo de chat). */}
      <Legacy name="beta" />
      <Legacy name="demo" />
    </div>
  );
}
