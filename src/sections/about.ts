import { html } from "../lib/html";
import { img } from "../lib/images";
import { icon } from "../lib/icons";
import { eyebrow, title } from "../lib/ui";
import type { RenderCtx } from "../lib/layout";
import { HERO_IMAGE } from "./hero";
import { findVideo, platformOf, thumb, videoLink } from "./video";

/** Sobre mí: retrato en arco + video corto de presentación (miniatura bajo el degradado de marca) + historia y cifras. */
export function about(ctx: RenderCtx, id = "sobre-mi") {
  const { t } = ctx;
  const reel = findVideo("presentacion");
  const platform = platformOf(reel);
  const poster = thumb(reel);
  return html`<section class="section bg-mist lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container about">
      <div class="about-media reveal">
        <div class="arch">${img({ src: HERO_IMAGE, alt: t("about.imageAlt"), sizes: "(min-width: 960px) 525px, 375px" })}</div>
        ${videoLink(ctx, "presentacion", html`
          ${poster ? html`<span class="reel-mini-thumb" aria-hidden="true">${img({ src: poster, alt: "", sizes: "154px" })}</span>` : ""}
          ${platform ? html`<span class="src">${icon(platform, 14)}Reel</span>` : ""}
          <span class="reel-mini-play">${icon("play", 16)}</span>
          <span class="reel-mini-label">${t("about.reelLabel")}</span>
          <span class="reel-mini-src">${t("about.reelSource")}</span>`, "reel-mini")}
      </div>
      <div class="about-copy reveal">
        ${eyebrow(t("about.eyebrow"))}
        ${title(t, "about", `${id}-title`)}
        <p class="about-sub">${t("about.sub")}</p>
        ${t.list<string>("about.paragraphs").map((p) => html`<p class="txt">${p}</p>`)}
        <dl class="stats">
          ${t.list<{ value: string; label: string }>("about.stats").map((s) => html`<div class="stat"><dt>${s.label}</dt><dd>${s.value}</dd></div>`)}
        </dl>
      </div>
    </div>
  </section>`;
}
