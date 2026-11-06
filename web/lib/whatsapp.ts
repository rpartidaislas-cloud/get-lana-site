/** Enlace a WhatsApp de LANA con mensaje prellenado. */
export const WHATSAPP_NUMBER = "523318462252";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** CTA genérico: crear cuenta gratis sin plan elegido todavía. */
export const WA_CREAR_CUENTA = waLink("Hola, quiero crear mi cuenta gratis de LANA. ¿Me ayudan a empezar?");

/** CTA desde un plan concreto. */
export function waPlan(plan: string, periodo: "mensual" | "anual"): string {
  return waLink(
    `Hola, quiero crear mi cuenta gratis de LANA y empezar la prueba de 14 días con el plan ${plan} (facturación ${periodo}). ¿Me ayudan a empezar?`,
  );
}
