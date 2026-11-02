"use client";

import { useEffect, useRef } from "react";

/**
 * Marca el contenedor con `is-visible` cuando entra al viewport (una sola vez).
 * Los hijos usan las clases `reveal` / `reveal-stagger` de globals.css.
 */
export default function Reveal({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: { as?: "div" | "section" | "ul" | "article"; className?: string; children: React.ReactNode } & Record<string, unknown>) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in-view");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("in-view");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const T = Tag as unknown as "div";
  return (
    <T ref={ref as React.Ref<HTMLDivElement>} className={className} {...rest}>
      {children}
    </T>
  );
}
