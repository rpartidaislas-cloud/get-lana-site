/**
 * Quita el fondo de color sólido de una imagen, en el navegador.
 * Toma el color de las orillas y borra por relleno desde los bordes los
 * píxeles parecidos (así no se borran blancos dentro del logo). Suaviza el
 * borde con alfa parcial. Devuelve un data URL PNG.
 */
export async function quitarFondo(src: string, tolerancia: number, maxLado = 900): Promise<string> {
  const img = await cargarImagen(src);
  const escala = Math.min(1, maxLado / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
  const w = Math.max(1, Math.round((img.naturalWidth || maxLado) * escala));
  const h = Math.max(1, Math.round((img.naturalHeight || maxLado) * escala));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("sin canvas");
  ctx.drawImage(img, 0, 0, w, h);
  const datos = ctx.getImageData(0, 0, w, h);
  const d = datos.data;

  // Color de fondo = promedio de las orillas opacas.
  let r = 0, g = 0, b = 0, n = 0;
  const muestra = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    if (d[i + 3] < 16) return;
    r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
  };
  for (let x = 0; x < w; x++) { muestra(x, 0); muestra(x, h - 1); }
  for (let y = 0; y < h; y++) { muestra(0, y); muestra(w - 1, y); }
  if (!n) return canvas.toDataURL("image/png");
  r /= n; g /= n; b /= n;

  const dist = (i: number) => Math.max(Math.abs(d[i] - r), Math.abs(d[i + 1] - g), Math.abs(d[i + 2] - b));
  const visto = new Uint8Array(w * h);
  const pila: number[] = [];
  const empujar = (x: number, y: number) => {
    const p = y * w + x;
    if (!visto[p]) { visto[p] = 1; pila.push(p); }
  };
  for (let x = 0; x < w; x++) { empujar(x, 0); empujar(x, h - 1); }
  for (let y = 0; y < h; y++) { empujar(0, y); empujar(w - 1, y); }

  const suave = tolerancia * 0.5;
  while (pila.length) {
    const p = pila.pop()!;
    const i = p * 4;
    const dd = d[i + 3] < 16 ? 0 : dist(i);
    if (dd > tolerancia + suave) continue;
    d[i + 3] = dd <= tolerancia ? 0 : Math.round(d[i + 3] * ((dd - tolerancia) / suave));
    if (dd > tolerancia) continue; // borde suavizado: no se expande más allá
    const x = p % w, y = (p - x) / w;
    if (x > 0) empujar(x - 1, y);
    if (x < w - 1) empujar(x + 1, y);
    if (y > 0) empujar(x, y - 1);
    if (y < h - 1) empujar(x, y + 1);
  }
  ctx.putImageData(datos, 0, 0);
  return canvas.toDataURL("image/png");
}

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((ok, mal) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = mal;
    img.src = src;
  });
}
