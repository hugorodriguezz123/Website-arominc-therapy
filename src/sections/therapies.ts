import { html } from "../lib/html";
import { photo } from "../lib/images";
import { icon } from "../lib/icons";
import { eyebrow, title } from "../lib/ui";
import type { RenderCtx } from "../lib/layout";

interface Therapy {
  key: string; badge: string; title: string; text: string; mode: string; modeIcon: string;
  duration: string; cta: string; imageAlt: string; placeholder: string;
}

const TONES = ["sky", "vio", "orc"] as const;

/** Tarjeta de terapia. Foto en public/images/terapias/<key>.jpg (si no existe: fondo de marca). */
function card(it: Therapy, i: number, group: boolean) {
  const tone = TONES[i % 3];
  return html`<li class="tcard reveal" style="--d:${i * 80}ms">
    <div class="tcard-img">${photo({
      src: `/images/terapias/${it.key}.jpg`, alt: it.imageAlt, placeholder: it.placeholder,
      sizes: "(min-width: 960px) 360px, (min-width: 640px) 280px, 100vw", tone: (i % 3) + 1,
    })}</div>
    <div class="tcard-body">
      <div class="tcard-top"><span class="num tone-${i}">0${i + 1}</span><span class="pill pill-${tone}">${it.badge}</span></div>
      <h4 class="h3">${it.title}</h4>
      <p class="txt">${it.text}</p>
      <p class="tmeta"><span>${icon(it.modeIcon, 15)}${it.mode}</span><span>${icon(group ? "users" : "clock", 15)}${it.duration}</span></p>
      <a class="tcard-foot" href="#contacto">${it.cta}${icon("arrow", 18)}</a>
    </div>
  </li>`;
}

/**
 * Terapias con pestañas Individuales / En grupo.
 * Sin JS se ven las dos listas (cada una con su subtítulo); con JS, pestañas accesibles (role=tab).
 */
export function therapies({ t }: RenderCtx, id = "terapias") {
  const ind = t.list<Therapy>("therapies.individual");
  const grp = t.list<Therapy>("therapies.group");
  return html`<section class="section bg-ground lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container">
      <div class="ther-head">
        <div class="sec-head reveal">
          ${eyebrow(t("therapies.eyebrow"))}
          ${title(t, "therapies", `${id}-title`)}
          <p class="lead">${t("therapies.lead")}</p>
        </div>
        <div class="tabs" role="tablist" aria-label="${t("therapies.tabsLabel")}" data-tabs>
          <button type="button" class="tab" role="tab" id="tab-ind" aria-controls="panel-ind" aria-selected="true">${t("therapies.tabIndividual")}</button>
          <button type="button" class="tab" role="tab" id="tab-grp" aria-controls="panel-grp" aria-selected="false" tabindex="-1">${t("therapies.tabGroup")}</button>
        </div>
      </div>
      <div class="tpanel" id="panel-ind" role="tabpanel" aria-labelledby="tab-ind" data-tabpanel>
        <h3 class="tpanel-title">${t("therapies.individualTitle")}</h3>
        <ul class="cards-3" role="list">${ind.map((it, i) => card(it, i, false))}</ul>
      </div>
      <div class="tpanel" id="panel-grp" role="tabpanel" aria-labelledby="tab-grp" data-tabpanel hidden>
        <h3 class="tpanel-title">${t("therapies.groupTitle")}</h3>
        <ul class="cards-3" role="list">${grp.map((it, i) => card(it, i, true))}</ul>
        <p class="group-note">${t("therapies.groupNote")} <a href="#contacto">${t("therapies.groupNoteLink")}</a></p>
      </div>
    </div>
  </section>`;
}
