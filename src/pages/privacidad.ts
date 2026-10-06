import { html } from "../lib/html";
import { definePage } from "../lib/layout";

/** Página secundaria de ejemplo (/privacidad/, /en/privacidad/). Necesaria si hay formulario de contacto. */
export default definePage({
  slug: "privacidad",
  meta: (t) => ({ title: t("privacy.meta.title"), description: t("privacy.meta.description"),
                  breadcrumb: t("privacy.meta.title"), priority: 0.3, changefreq: "yearly" }),
  render: ({ t }) => html`
    <section class="section">
      <div class="container narrow prose">
        <h1>${t("privacy.title")}</h1>
        ${t.list<string>("privacy.paragraphs").map((p) => html`<p>${p}</p>`)}
      </div>
    </section>`,
});
