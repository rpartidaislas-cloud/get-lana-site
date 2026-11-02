"use client";

import { useState } from "react";
import faq from "../legacy/faq.json";

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          <h2 className="pb-8 text-center text-3xl font-bold md:text-4xl">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="rounded-lg bg-white/70 shadow-sm shadow-black/[0.03] ring-1 ring-gray-200/80">
                  <h3>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <span>{item.q}</span>
                      <span className="ml-8 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white shadow-xs">
                        <svg
                          className={`origin-center fill-gray-400 transition duration-200 ease-out ${isOpen ? "rotate-180" : ""}`}
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                        >
                          <path d="m2 .586 3 3 3-3L9.414 2 5.707 5.707a1 1 0 0 1-1.414 0L.586 2 2 .586Z" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    className={`grid overflow-hidden text-sm text-gray-600 transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden" dangerouslySetInnerHTML={{ __html: item.a }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
