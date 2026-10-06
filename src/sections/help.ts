import { html } from "../lib/html";
import { icon } from "../lib/icons";
import { title } from "../lib/ui";
import type { RenderCtx } from "../lib/layout";

/** ¿Cómo puedo ayudarte? — título con línea + columnas con ícono (los 5 pilares). */
export function help({ t }: RenderCtx, id = "como-ayudo") {
  const items = t.list<{ icon: string; title: string; text: string }>("help.items");
  return html`<section class="section bg-white lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container">
      <div class="help-head reveal">
        ${title(t, "help", `${id}-title`)}
        <span class="help-line" aria-hidden="true"></span>
      </div>
      <p class="lead help-intro reveal">${t("help.intro")}</p>
      <ul class="help-grid" role="list">
        ${items.map((it, i) => html`<li class="help-item reveal" style="--d:${i * 70}ms">
          <span class="help-ico">${icon(it.icon, 34)}</span>
          <div><h3>${it.title}</h3><p>${it.text}</p></div>
        </li>`)}
      </ul>
    </div>
  </section>`;
}
