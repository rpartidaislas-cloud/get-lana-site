/** Iconos de línea (24×24) usados en las secciones de producto, flujo y precios. */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Icon = {
  inbox: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M3 12l2.5-7h13L21 12v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M3 12h5l1.5 3h5L16 12h5" /></svg>
  ),
  sparkle: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /></svg>
  ),
  receipt: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>
  ),
  cart: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M3 4h2l2.4 11h11L21 7H7" /><circle cx="9" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></svg>
  ),
  stages: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M4 6h6v4H4zM14 6h6v4h-6zM9 14h6v4H9z" /><path d="M10 8h4M12 10v4" /></svg>
  ),
  shield: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
  ),
  check: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M5 12l4 4L19 7" /></svg>
  ),
  clipboard: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M9 4h6v3H9zM7 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1" /><path d="M9 12h6M9 16h4" /></svg>
  ),
  factory: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M3 20V9l6 4V9l6 4V9l6 4v7z" /><path d="M7 20v-3M12 20v-3M17 20v-3" /></svg>
  ),
  once: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M4 12a8 8 0 1 0 2.3-5.7" /><path d="M4 4v5h5" /><path d="M12 8v4l3 2" /></svg>
  ),
  ruler: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M3 16L16 3l5 5L8 21z" /><path d="M7 12l2 2M10 9l2 2M13 6l2 2" /></svg>
  ),
  truck: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></svg>
  ),
  calendar: (p: { className?: string }) => (
    <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /><path d="M8 14h3v3H8z" /></svg>
  ),
  card: (p: { className?: string }) => (
    <svg {...base} {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h4" /></svg>
  ),
  invoice: (p: { className?: string }) => (
    <svg {...base} {...p}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13h6M10 17h6" /></svg>
  ),
};
