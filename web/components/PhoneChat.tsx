"use client";

import { useEffect, useState } from "react";

/**
 * Teléfono con una conversación de WhatsApp que se revela mensaje por mensaje
 * (inspirado en "Chat Messages" de solaceui en 21st.dev, adaptado a WhatsApp y
 * a la cotización que genera LANA). Sin dependencias.
 */

type Msg =
  | { kind: "text"; from: "client" | "lana"; text: string }
  | { kind: "quote"; from: "lana" };

const script: Msg[] = [
  { kind: "text", from: "client", text: "Hola, necesito 40 polos azul marino con nuestro logo bordado en el pecho." },
  { kind: "text", from: "lana", text: "¡Claro! Tengo dos modelos ejecutivos en azul marino. ¿El bordado va de 8 × 8 cm aprox.?" },
  { kind: "text", from: "client", text: "Sí, ese tamaño está bien. ¿Cuánto saldría?" },
  { kind: "quote", from: "lana" },
  { kind: "text", from: "lana", text: "Si te parece bien, apruébala desde el enlace y la pasamos a producción." },
  { kind: "text", from: "client", text: "Perfecto, aprobada 👍" },
];

const STEP = 1500;
const TYPING = 900;
const RESTART = 5000;

export default function PhoneChat() {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(script.length);
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    if (shown >= script.length) {
      t = setTimeout(() => setShown(0), RESTART);
      return () => clearTimeout(t);
    }
    const next = script[shown];
    if (next.from === "lana") {
      t = setTimeout(() => {
        setTyping(true);
        t = setTimeout(() => {
          setTyping(false);
          setShown(shown + 1);
        }, TYPING);
      }, STEP - TYPING);
    } else {
      t = setTimeout(() => setShown(shown + 1), STEP);
    }
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px]" aria-label="Simulación de una conversación de WhatsApp cotizada por LANA">
      <div className="relative rounded-[44px] border-[6px] border-gray-900 bg-gray-900 shadow-[0_30px_60px_-20px_rgba(27,23,53,.55)]">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-gray-900" aria-hidden="true" />
        <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[38px] bg-[#efe7dd]">
          <div className="flex items-center gap-2.5 bg-[#075e54] px-4 pb-2.5 pt-9 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold">GV</span>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[13px] font-semibold">Grupo Vértice</div>
              <div className="text-[11px] text-white/75">{typing ? "escribiendo…" : "en línea"}</div>
            </div>
            <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">LANA activa</span>
          </div>

          <div className="flex flex-1 flex-col justify-end gap-1.5 overflow-hidden px-3 pb-3 pt-3">
            {script.slice(0, shown).map((m, i) => (
              <Bubble key={i} msg={m} />
            ))}
            {typing && (
              <div className="animate-appear flex w-fit items-center gap-1 rounded-xl rounded-tl-sm bg-white px-3 py-2.5 shadow-sm">
                <Dot delay="0s" /> <Dot delay=".15s" /> <Dot delay=".3s" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[#f0f0f0] px-3 py-2">
            <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-[11px] text-gray-400">Escribe un mensaje</div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25d366] text-white" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return <span className="h-1.5 w-1.5 rounded-full bg-gray-400" style={{ animation: `lanaTyping 1.2s ${delay} infinite` }} />;
}

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.from === "client";
  const base = "animate-appear max-w-[86%] rounded-xl px-2.5 py-1.5 text-[12px] leading-snug shadow-sm";
  if (msg.kind === "quote") {
    return (
      <div className={`${base} w-[88%] max-w-none rounded-tl-sm bg-white p-2.5`}>
        <div className="flex items-center justify-between gap-2">
          <strong className="text-[12px] text-gray-900">Cotización LANA-1842</strong>
          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">Lista</span>
        </div>
        <div className="mt-2 grid gap-1 text-[11px] text-gray-600">
          <Row l="40 polos ejecutivos" r="$12,760" />
          <Row l="Bordado · 8 × 8 cm" r="$2,400" />
          <div className="mt-1 flex justify-between border-t border-gray-100 pt-1.5 font-semibold text-gray-900">
            <span>Total estimado</span>
            <span>$15,160</span>
          </div>
        </div>
        <div className="mt-2 rounded-lg bg-brand py-1.5 text-center text-[11px] font-semibold text-white">Ver y aprobar</div>
      </div>
    );
  }
  return (
    <div className={`${base} ${mine ? "self-end rounded-tr-sm bg-[#dcf8c6] text-gray-900" : "rounded-tl-sm bg-white text-gray-900"}`}>
      {msg.text}
      <span className="ml-2 align-bottom text-[9px] text-gray-400">{mine ? "10:42" : "10:43"}</span>
    </div>
  );
}

function Row({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex justify-between">
      <span>{l}</span>
      <b className="font-medium text-gray-900">{r}</b>
    </div>
  );
}
