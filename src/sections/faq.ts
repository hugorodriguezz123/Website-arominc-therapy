import { html } from "../lib/html";
import { icon } from "../lib/icons";
import { faqSchema } from "../lib/seo";
import { eyebrow, title } from "../lib/ui";
import { whatsappUrl, type RenderCtx } from "../lib/layout";

/**
 * "Cosas que la gente pregunta antes de contactarme": acordeón con <details> (sin JS).
 * Agrega su schema FAQPage al JSON-LD de la página. Contenido en i18n: faq.items = [{ q, a }]
 */
export function faq(ctx: RenderCtx, id = "preguntas") {
  const { t } = ctx;
  const items = t.list<{ q: string; a: string }>("faq.items");
  if (!items.length) return html``;
  (ctx.meta.jsonLd ??= []).push(faqSchema(items));
  return html`<section class="section bg-white lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container narrow">
      <div class="sec-head center reveal">
        ${eyebrow(t("faq.eyebrow"), "center")}
        ${title(t, "faq", `${id}-title`)}
      </div>
      <div class="faq">
        ${items.map((i, n) => html`<details class="faq-item reveal"${n === 0 ? html` open` : ""}>
          <summary><span>${i.q}</span><span class="faq-icon">${icon("plus", 16)}</span></summary>
          <p>${i.a}</p>
        </details>`)}
      </div>
      <p class="faq-more reveal">${t("faq.more")} <a href="${whatsappUrl()}" target="_blank" rel="noopener">${t("faq.moreLink")}${icon("arrow", 18)}</a></p>
    </div>
  </section>`;
}
