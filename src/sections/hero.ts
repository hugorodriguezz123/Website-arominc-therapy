import { html } from "../lib/html";
import { img } from "../lib/images";
import { icon } from "../lib/icons";
import { eyebrow, title } from "../lib/ui";
import type { RenderCtx } from "../lib/layout";

export const HERO_IMAGE = "/images/briggith-guzman.png";
/** Reutiliza este valor en page.lcpImage.sizes para que el preload coincida con la imagen real */
export const HERO_SIZES = "(min-width: 960px) 450px, (min-width: 640px) 300px, 84vw";

const LOTUS = "/images/brand/gauss-simbolo.webp";

/**
 * Hero: contiene el ÚNICO <h1> de la página y la imagen LCP (priority: true, nunca lazy).
 * Sin .reveal aquí: lo que está sobre el pliegue debe pintarse de inmediato.
 */
export function hero(ctx: RenderCtx) {
  const { t } = ctx;
  return html`<section class="hero" id="inicio" aria-labelledby="hero-title">
    <div class="container hero-grid">
      <div class="hero-head">
        ${eyebrow(t("hero.eyebrow"))}
        ${title(t, "hero", "hero-title", "h1", "h1")}
      </div>
      <div class="hero-body">
        <p class="lead">${t("hero.leadStart")} <strong>${t("hero.leadName")}</strong>${t("hero.leadEnd")}</p>
        <div class="actions">
          <a class="btn btn-primary btn-lg" href="#contacto">${t("hero.ctaPrimary")}${icon("arrow", 18)}</a>
          <a class="btn btn-ghost btn-lg" href="#terapias">${t("hero.ctaSecondary")}</a>
        </div>
        <ul class="checks" role="list">
          ${t.list<string>("hero.checks").map((c, i) => html`<li>${icon("check", 18, `tone-${i}`)}${c}</li>`)}
        </ul>
      </div>
      <div class="hero-media">
        <span class="ring ring-1" aria-hidden="true"></span>
        <span class="ring ring-2" aria-hidden="true"></span>
        <span class="ring ring-3" aria-hidden="true"></span>
        <span class="ring aura" aria-hidden="true"></span>
        ${img({ src: HERO_IMAGE, alt: t("hero.imageAlt"), priority: true, sizes: HERO_SIZES, class: "hero-photo" })}
        <div class="badge-card">
          <img src="${LOTUS}" width="264" height="185" alt="" decoding="async">
          <span><strong>${t("hero.badgeName")}</strong><span>${t("hero.badgeRole")}</span></span>
        </div>
      </div>
    </div>
  </section>`;
}
