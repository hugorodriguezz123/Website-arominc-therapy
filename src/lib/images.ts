import { mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, parse } from "node:path";
import config from "../../site.config";
import { html, attrs } from "./html";

interface ImgMeta { width: number; height: number; variants: { avif: string[]; webp: string[] } }
const manifest = new Map<string, ImgMeta>();
const SRC_DIR = "public/images";
const CACHE = ".cache/images";
/** Se sirven tal cual (sin variantes): iconos, OG, logo y la carpeta brand/ (ya optimizada) */
const SKIP = /^(og|icon|logo|apple-touch)|^brand\//;

/**
 * Genera variantes AVIF/WebP en varios anchos con sharp (si está instalado).
 * Recorre public/images y sus subcarpetas (terapias/, videos/, redes/…).
 * Se cachean en .cache/images y se copian a dist/images/_opt.
 */
export async function prepareImages(outDir: string) {
  let sharp: any;
  try { sharp = (await import("sharp")).default; } catch {
    console.warn("⚠  sharp no instalado: imágenes sin optimizar (bun add sharp)");
    return;
  }
  await mkdir(CACHE, { recursive: true });
  await mkdir(join(outDir, "images/_opt"), { recursive: true });
  const files: string[] = [];
  for await (const f of new Bun.Glob("**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}").scan(SRC_DIR)) {
    const rel = f.replaceAll("\\", "/");
    if (!SKIP.test(rel)) files.push(rel);
  }

  await Promise.all(files.map(async (rel) => {
    const src = join(SRC_DIR, rel);
    const { dir, name } = parse(rel);
    const flat = (dir ? dir.replaceAll("/", "-") + "-" : "") + name;
    const meta = await sharp(src).metadata();
    const srcMtime = (await stat(src)).mtimeMs;
    const widths = config.build.imageWidths.filter((w) => w < meta.width!).concat(meta.width!);
    const variants: ImgMeta["variants"] = { avif: [], webp: [] };

    for (const w of [...new Set(widths)]) {
      for (const fmt of ["avif", "webp"] as const) {
        const out = `${flat}-${w}.${fmt}`;
        const cached = join(CACHE, out);
        const fresh = await stat(cached).then((s) => s.mtimeMs > srcMtime).catch(() => false);
        if (!fresh) {
          await sharp(src).resize({ width: w })[fmt]({ quality: fmt === "avif" ? 55 : 72 }).toFile(cached);
        }
        await Bun.write(join(outDir, "images/_opt", out), Bun.file(cached));
        variants[fmt].push(`/images/_opt/${out} ${w}w`);
      }
    }
    manifest.set(`/images/${rel}`, { width: meta.width!, height: meta.height!, variants });
  }));
}

/** ¿Existe el archivo en /public? Permite dejar listas las rutas de fotos que el cliente subirá después. */
export const hasFile = (src?: string) => !!src && existsSync(join("public", src));

interface ImgProps {
  src: string;                 // "/images/hero.jpg"
  alt: string;                 // obligatorio: "" solo para imágenes decorativas
  sizes?: string;              // por defecto "100vw"
  /** true SOLO para la imagen LCP (hero): carga inmediata + fetchpriority=high */
  priority?: boolean;
  width?: number;
  height?: number;
  class?: string;
}

/** <picture> responsivo con AVIF/WebP, dimensiones explícitas (sin CLS) y lazy loading nativo. */
export function img(p: ImgProps) {
  const m = manifest.get(p.src);
  const width = p.width ?? m?.width;
  const height = p.height ?? m?.height;
  const sizes = p.sizes ?? "100vw";
  const imgTag = html`<img${attrs({
    src: p.src, alt: p.alt, width, height, class: p.class,
    loading: p.priority ? "eager" : "lazy",
    decoding: p.priority ? "sync" : "async",
    fetchpriority: p.priority ? "high" : undefined,
  })}>`;
  if (!m) return imgTag;
  return html`<picture>
    <source type="image/avif" srcset="${m.variants.avif.join(", ")}" sizes="${sizes}">
    <source type="image/webp" srcset="${m.variants.webp.join(", ")}" sizes="${sizes}">
    ${imgTag}
  </picture>`;
}

/**
 * Foto opcional: si el archivo existe en /public se muestra optimizada; si no, un fondo de marca
 * (degradado + etiqueta) que reserva el espacio. Así el cliente solo tiene que subir la foto con ese nombre.
 */
export function photo(p: ImgProps & { placeholder: string; tone?: number }) {
  if (hasFile(p.src)) return img(p);
  return html`<span class="ph ph-${p.tone ?? 1}" role="img" aria-label="${p.alt}">${
    SHOW_TAGS ? html`<span class="ph-tag">${p.placeholder}</span>` : ""}</span>`;
}

/** En desarrollo (bun run dev) los fondos de marca muestran qué foto falta; en producción no. */
const SHOW_TAGS = process.argv.includes("--dev");

/** Para <link rel="preload"> de la imagen LCP en el <head>. */
export function preloadImage(src: string, sizes = "100vw") {
  const m = manifest.get(src);
  if (!m) return html`<link rel="preload" as="image" href="${src}" fetchpriority="high">`;
  return html`<link rel="preload" as="image" type="image/avif" imagesrcset="${m.variants.avif.join(", ")}" imagesizes="${sizes}" fetchpriority="high">`;
}
