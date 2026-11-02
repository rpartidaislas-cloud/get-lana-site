import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estático: el resultado (web/out) se copia a la raíz del repo
  // con `npm run publish:root` y GitHub Pages lo sirve en get-lana.com.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
};

export default nextConfig;
