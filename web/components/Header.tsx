"use client";

import { useEffect, useState } from "react";
import { WA_CREAR_CUENTA } from "@/lib/whatsapp";

const links = [
  { href: "#producto", label: "Producto" },
  { href: "#flujo", label: "Cómo funciona" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "Preguntas" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude]! before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          <div className="flex flex-1 items-center gap-3">
            <a className="inline-flex items-center" aria-label="LANA, inicio" href="/">
              <img src="/icons/LANACLARO.png" alt="LANA" width={100} height={17} />
            </a>
            <span className="hidden items-center gap-1.5 border-l border-gray-200 pl-3 text-xs text-gray-500 lg:inline-flex">
              <img src="/assets/meta-logo-official.webp" alt="Meta" width={44} height={10} />
              Proveedor tecnológico verificado
            </span>
          </div>
          <nav className="hidden flex-1 items-center justify-center gap-5 text-sm font-medium text-gray-600 md:flex">
            {links.map((l) => (
              <a key={l.href} className="hover:text-gray-900" href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <ul className="flex flex-1 items-center justify-end gap-3">
            <li className="hidden sm:block">
              <a href="https://app.get-lana.com" className="btn-sm bg-white text-gray-800 shadow-sm hover:bg-gray-50">
                Iniciar sesión
              </a>
            </li>
            <li>
              <a href={WA_CREAR_CUENTA} target="_blank" rel="noopener noreferrer" className="btn-sm bg-gray-900 text-white shadow-sm hover:bg-gray-800">
                Crear cuenta gratis
              </a>
            </li>
            <li className="md:hidden">
              <button
                type="button"
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </li>
          </ul>
        </div>
        {open && (
          <nav className="mt-2 rounded-2xl bg-white p-3 shadow-lg md:hidden">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {l.label}
              </a>
            ))}
            <a href="https://app.get-lana.com" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:hidden">
              Iniciar sesión
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
