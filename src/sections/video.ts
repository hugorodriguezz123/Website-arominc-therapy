import config from "../../site.config";
import { html, attrs, type Safe } from "../lib/html";
import { absolute, type T } from "../lib/i18n";
import { icon, networkName } from "../lib/icons";
import { hasFile } from "../lib/images";
import type { RenderCtx } from "../lib/layout";
import type { VideoItem } from "../lib/types";

export const findVideo = (key: string): VideoItem => {
  const v = config.videos.find((x) => x.key === key);
  if (!v) throw new Error(`Video "${key}" no existe en site.config.ts → videos`);
  return v;
};

/** Portada: la propia (si existe el archivo) → miniatura de YouTube (si el video es real) → ninguna */
export const thumb = (v: VideoItem) =>
  v.poster && (v.poster.startsWith("http") || hasFile(v.poster)) ? v.poster
  : v.source.provider === "youtube" && !v.draft ? `https://i.ytimg.com/vi/${v.source.id}/hqdefault.jpg` : "";

export const embedUrl = (v: VideoItem) =>
  v.source.provider === "youtube" ? `https://www.youtube-nocookie.com/embed/${v.source.id}`
  : v.source.provider === "vimeo" ? `https://player.vimeo.com/video/${v.source.id}`
  : v.source.provider === "instagram" ? `https://www.instagram.com/p/${v.source.id}/embed/`
  : v.source.provider === "facebook" ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(v.source.url)}&show_text=false`
  : undefined;

export const watchUrl = (v: VideoItem) =>
  v.source.provider === "youtube" ? `https://www.youtube.com/watch?v=${v.source.id}`
  : v.source.provider === "vimeo" ? `https://vimeo.com/${v.source.id}`
  : v.source.provider === "instagram" ? `https://www.instagram.com/p/${v.source.id}/`
  : v.source.provider === "facebook" ? v.source.url
  : v.source.provider === "link" ? v.source.url
  : v.source.src;

/** Red de origen para la etiqueta de la tarjeta */
export const platformOf = (v: VideoItem) =>
  v.source.provider === "link" ? v.source.platform : v.source.provider === "file" ? "" : v.source.provider;

/**
 * Enlace que abre un video en el reproductor emergente (<dialog>), sin cargar nada hasta el clic.
 *  - YouTube/Vimeo/Instagram/Facebook (embed)/archivo: con JS abre el modal; sin JS va a la página del video.
 *  - Instagram/Facebook ("link"): abre la publicación original en otra pestaña (no se pueden incrustar sin SDK).
 */
export function videoLink(ctx: RenderCtx, key: string, inner: Safe, cls: string) {
  const v = findVideo(key);
  ctx.videosUsed.add(key);
  const { t } = ctx;
  const title = t(v.title);
  if (v.source.provider === "link") {
    return html`<a class="${cls}" href="${v.source.url}" target="_blank" rel="noopener"
      aria-label="${t("testimonials.watchOn", { platform: networkName[v.source.platform] ?? v.source.platform })}: ${title} ${t("a11y.newTab")}">${inner}</a>`;
  }
  const isFile = v.source.provider === "file";
  return html`<a class="${cls}" href="${watchUrl(v)}"${attrs({
    "data-video-modal": isFile ? (v.source as { src: string }).src : embedUrl(v),
    "data-video-kind": isFile ? "file" : "iframe",
    "data-video-ratio": `${v.width ?? 16} / ${v.height ?? 9}`,
    "data-video-title": title,
    "aria-label": t("video.play", { title }),
  })}>${inner}</a>`;
}

/**
 * Fachada en línea (YouTube/Vimeo): miniatura + botón; el iframe (~1 MB de terceros) solo se carga al hacer clic.
 * `extra` permite añadir etiquetas encima de la portada (número de episodio, duración…).
 */
export function videoFacade(ctx: RenderCtx, key: string, cls = "", extra: Safe | string = "") {
  const v = findVideo(key);
  ctx.videosUsed.add(key);
  const { t } = ctx;
  const title = t(v.title);
  const poster = thumb(v);
  return html`<div class="video-facade ${cls}" style="aspect-ratio:${v.width ?? 16} / ${v.height ?? 9}"
      data-video-embed="${embedUrl(v)}" data-video-title="${title}">
    ${poster ? html`<img src="${poster}" alt="" loading="lazy" decoding="async" width="480" height="360">` : ""}
    ${extra}
    <button type="button" class="video-play" aria-label="${t("video.play", { title })}">${icon("play", 26)}</button>
    <noscript><a href="${watchUrl(v)}" target="_blank" rel="noopener">${title}</a></noscript>
  </div>`;
}

/** JSON-LD VideoObject (rich results de video en Google). Se omite en videos de ejemplo o enlaces externos. */
export function videoSchema(key: string, t: T) {
  const v = config.videos.find((x) => x.key === key);
  if (!v || v.draft || v.source.provider === "link") return null;
  const tn = thumb(v);
  if (!tn) return null;
  return {
    "@type": "VideoObject",
    name: t(v.title),
    description: t(v.description),
    thumbnailUrl: tn.startsWith("http") ? tn : absolute(tn),
    uploadDate: v.uploadDate,
    duration: v.duration,
    embedUrl: embedUrl(v),
    contentUrl: v.source.provider === "file" ? absolute(v.source.src) : watchUrl(v),
  };
}
