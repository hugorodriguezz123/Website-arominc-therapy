import config from "../../site.config";
import { html } from "../lib/html";
import { icon, networkName } from "../lib/icons";
import { eyebrow, title, clock } from "../lib/ui";
import type { RenderCtx } from "../lib/layout";
import { findVideo, platformOf, thumb, videoLink } from "./video";

/**
 * Testimonios en video verticales (9:16) en carrusel con flechas, al estilo "conoce a nuestros terapeutas".
 * Cada tarjeta abre el video en un modal (YouTube/Instagram/Facebook/archivo) o la publicación original ("link": TikTok…).
 */
export function testimonials(ctx: RenderCtx, id = "testimonios") {
  const { t } = ctx;
  const items = t.list<{ video: string; name: string; therapy: string }>("testimonials.items");
  const ig = config.social.find((s) => s.network === "instagram");
  return html`<section class="section bg-mist lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container" data-carousel>
      <div class="sec-head center reveal">
        ${eyebrow(t("testimonials.eyebrow"), "center")}
        ${title(t, "testimonials", `${id}-title`)}
        <p class="lead">${t("testimonials.lead")}</p>
      </div>
      <ul class="track track-vt" role="list" aria-label="${t("a11y.testimonialsTrack")}" data-track tabindex="0">
        ${items.map((it, i) => {
          const v = findVideo(it.video);
          const poster = thumb(v);
          const p = platformOf(v);
          const media = html`<span class="vcard-media ph ph-${(i % 3) + 4}">
              ${poster ? html`<img src="${poster}" alt="" loading="lazy" decoding="async" width="360" height="640">` : ""}
              ${p ? html`<span class="src">${icon(p, 14)}${networkName[p] ?? p}</span>` : ""}
              <span class="vcard-play">${icon("play", 20)}</span>
              ${v.duration ? html`<span class="dur">${clock(v.duration)}</span>` : ""}
            </span>
            <span class="vcard-name">${it.name}</span>
            <span class="vcard-role">${it.therapy}</span>`;
          return html`<li class="vcard-item">${videoLink(ctx, it.video, media, "vcard")}</li>`;
        })}
      </ul>
      <div class="car-nav">
        <button type="button" class="arrow" data-prev aria-label="${t("a11y.prev")}">${icon("arrow-left", 20)}</button>
        <button type="button" class="arrow arrow-solid" data-next aria-label="${t("a11y.next")}">${icon("arrow", 20)}</button>
      </div>
      ${ig ? html`<p class="more-link"><a href="${ig.url}" target="_blank" rel="noopener">${t("testimonials.more")}${icon("arrow", 18)}<span class="sr-only"> ${t("a11y.newTab")}</span></a></p>` : ""}
    </div>
  </section>`;
}
