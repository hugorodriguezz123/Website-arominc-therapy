import { html, raw } from "./html";
import type { T } from "./i18n";

/**
 * Título con palabra destacada (General Sans + Clash Display), leído de i18n:
 *   <base>.titleStart  <base>.titleEm  <base>.titleEnd
 */
export function title(t: T, base: string, id: string, tag: "h1" | "h2" = "h2", cls = "h2") {
  const end = t(`${base}.titleEnd`);
  const tail = end === `${base}.titleEnd` ? "" : end;
  const sep = /^[.,;:!?)]/.test(tail) ? "" : " ";
  const inner = html`${t(`${base}.titleStart`)} <em>${t(`${base}.titleEm`)}</em>${tail ? html`${sep}${tail}` : ""}`;
  return tag === "h1"
    ? html`<h1 id="${id}" class="${cls}">${inner}</h1>`
    : html`<h2 id="${id}" class="${cls}">${inner}</h2>`;
}

export function eyebrow(text: string, mod = "") {
  return html`<p class="eyebrow${mod ? ` ${mod}` : ""}">${text}</p>`;
}

/**
 * Separador entre secciones: curva suave con línea en el degradado de la marca.
 * from/to = fondos de la sección anterior y siguiente (ground | mist | white | night).
 */
type Bg = "ground" | "mist" | "white" | "night";
const CURVES = [
  "M0,70 C220,18 470,12 720,46 C970,80 1220,96 1440,38",
  "M0,40 C240,96 480,100 720,62 C960,24 1200,16 1440,64",
];
export function wave(from: Bg, to: Bg, variant: 0 | 1 = 0) {
  const d = CURVES[variant]!;
  const mix = from === "night" || to === "night" ? ";--mix:10%" : "";
  return raw(`<div class="wave" style="--from:var(--${from});--to:var(--${to})${mix}" aria-hidden="true"><svg viewBox="0 0 1440 120" preserveAspectRatio="none" focusable="false"><path class="wave-fill" d="${d} L1440,120 L0,120 Z"/><path class="wave-glow" d="${d}"/><path class="wave-line" d="${d}"/></svg></div>`);
}

/** Degradado de la línea (una vez por página, referenciado por url(#gaussLine)) */
export const waveDefs = raw(
  `<svg class="sr-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs><linearGradient id="gaussLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0AA6F0"/><stop offset=".5" stop-color="#9A8CF6"/><stop offset="1" stop-color="#EC6AF5"/></linearGradient></defs></svg>`,
);

/** "PT1M10S" → "1:10" para mostrar la duración en las tarjetas de video */
export function clock(iso?: string) {
  if (!iso) return "";
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const [h, mi, s] = [Number(m[1] ?? 0), Number(m[2] ?? 0), Number(m[3] ?? 0)];
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${String(mi).padStart(2, "0")}:${ss}` : `${mi}:${ss}`;
}
