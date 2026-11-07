import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | LANA",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">No encontramos esta página</h1>
      <p className="text-gray-600">La dirección que buscas no existe o cambió de lugar.</p>
      <a href="/" className="font-semibold text-brand underline">
        Volver al inicio
      </a>
    </main>
  );
}
