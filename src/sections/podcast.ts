import config from "../../site.config";
import { html } from "../lib/html";
import { icon } from "../lib/icons";
import { eyebrow, title, clock } from "../lib/ui";
import type { RenderCtx } from "../lib/layout";
import { videoFacade } from "./video";

/**
 * Podcast: carrusel de episodios de YouTube. Cada tarjeta es una fachada: el iframe se carga solo al dar play.
 * Episodios = videos con group: "podcast" en site.config.ts (en ese orden).
 */
export function podcast(ctx: RenderCtx, id = "podcast") {
  const { t } = ctx;
  const eps = config.videos.filter((v) => v.group === "podcast");
  if (!eps.length) return html``;
  const yt = config.social.find((s) => s.network === "youtube");
  return html`<section class="section bg-night lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container" data-carousel>
      <div class="pod-head">
        <div class="sec-head reveal">
          ${eyebrow(t("podcast.eyebrow"))}
          ${title(t, "podcast", `${id}-title`)}
          <p class="lead">${t("podcast.lead")}</p>
        </div>
        <div class="pod-actions">
          <button type="button" class="arrow arrow-dark" data-prev aria-label="${t("a11y.prev")}">${icon("arrow-left", 20)}</button>
          <button type="button" class="arrow arrow-dark arrow-solid" data-next aria-label="${t("a11y.next")}">${icon("arrow", 20)}</button>
          ${yt ? html`<a class="btn btn-light btn-sm" href="${yt.url}" target="_blank" rel="noopener">${icon("youtube", 18, "yt")}${t("podcast.channel")}</a>` : ""}
        </div>
      </div>
      <ul class="track track-pod" role="list" aria-label="${t("a11y.podcastTrack")}" data-track tabindex="0">
        ${eps.map((v, i) => html`<li class="ep reveal" style="--d:${i * 70}ms">
          ${videoFacade(ctx, v.key, `ep-media pn-${(i % 3) + 1}`, html`
            <span class="ep-num">${t("podcast.episode", { n: String(i + 1).padStart(2, "0") })}</span>
            ${v.duration ? html`<span class="dur">${clock(v.duration)}</span>` : ""}`)}
          <h3 class="ep-title">${t(v.title)}</h3>
          <p class="ep-meta">${icon("youtube", 16)}YouTube</p>
        </li>`)}
      </ul>
      <p class="pod-note">${t("podcast.note")}</p>
    </div>
  </section>`;
}
