import config from "../../site.config";
import { html, attrs } from "../lib/html";
import { icon } from "../lib/icons";
import { localePath } from "../lib/i18n";
import { eyebrow, title } from "../lib/ui";
import { whatsappUrl, type RenderCtx } from "../lib/layout";

const types: Record<string, string> = { email: "email", phone: "tel" };
/** Cada proveedor reconoce su propio honeypot; el servidor propio usa "website". */
const honeypot: Record<string, string> = { formspree: "_gotcha", web3forms: "botcheck" };
const autocomplete: Record<string, string> = { name: "name", email: "email", phone: "tel", company: "organization" };

/**
 * Contáctame: datos de contacto + formulario progresivo.
 * Sin JS hace POST normal; con JS envía por fetch mostrando estados (enviando / ok / error) sin recargar.
 * Antispam: honeypot + tiempo mínimo de llenado (campo "_ts", solo lo usa el servidor propio).
 */
export function contact({ t, locale }: RenderCtx, id = "contacto") {
  const c = config.contact;
  const info = t.list<{ icon: string; title: string; text: string }>("contact.info");
  const groups = t.list<{ label: string; options: string[] }>("contact.therapyGroups");
  const ph = (f: string) => { const v = t(`contact.placeholders.${f}`); return v.startsWith("contact.") ? undefined : v; };

  const field = (f: string) => {
    const label = t(`contact.fields.${f}`);
    if (f === "message") return html`<label class="field field-full"><span>${label}</span>
      <textarea name="message" rows="4" required minlength="10" maxlength="5000"${attrs({ placeholder: ph(f) })}></textarea></label>`;
    if (f === "therapy") return html`<label class="field"><span>${label}</span>
      <select name="therapy">
        ${groups.map((g) => html`<optgroup label="${g.label}">${g.options.map((o) => html`<option>${o}</option>`)}</optgroup>`)}
        <option>${t("contact.therapyOther")}</option>
      </select></label>`;
    return html`<label class="field"><span>${label}</span>
      <input${attrs({ name: f, type: types[f] ?? "text", required: f === "name" || f === "email",
        autocomplete: autocomplete[f], maxlength: 200, placeholder: ph(f) })}></label>`;
  };

  return html`<section class="section bg-mist lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container contact">
      <div class="contact-info reveal">
        ${eyebrow(t("contact.eyebrow"))}
        ${title(t, "contact", `${id}-title`)}
        <p class="lead">${t("contact.lead")}</p>
        <div class="actions">
          <a class="btn btn-ghost btn-lg" href="${whatsappUrl()}" target="_blank" rel="noopener">${icon("whatsapp", 20, "wa")}${t("contact.whatsapp")}</a>
        </div>
        <ul class="info-list" role="list">
          ${info.map((i) => html`<li><span class="info-ico">${icon(i.icon, 20)}</span><span><strong>${i.title}</strong>${i.text}</span></li>`)}
        </ul>
      </div>
      ${c.provider === "none" ? "" : html`
      <div class="form-card reveal">
        <h3 class="form-title">${t("contact.formTitle")}</h3>
        <p class="txt">${t("contact.formLead")}</p>
        <form class="contact-form" method="post" action="${c.endpoint}" data-contact-form data-provider="${c.provider}" novalidate>
          ${c.provider === "web3forms" ? html`
            <input type="hidden" name="access_key" value="${c.accessKey ?? ""}">
            <input type="hidden" name="subject" value="${t("contact.subject")}">
            <input type="hidden" name="from_name" value="${config.name}">` : ""}
          <input type="hidden" name="_ts" value="">
          <div class="hp" aria-hidden="true"><label>Website<input type="text" name="${honeypot[c.provider] ?? "website"}" tabindex="-1" autocomplete="off"></label></div>
          ${c.fields.map(field)}
          <div class="form-footer field-full">
            <button class="btn btn-primary btn-lg" type="submit">${t("contact.send")}</button>
            <p class="form-status" role="status" aria-live="polite" data-form-status
               data-sending="${t("contact.sending")}" data-ok="${t("contact.ok")}" data-error="${t("contact.error")}"
               data-invalid="${t("contact.invalid")}"></p>
            <p class="form-note">${t("contact.privacyStart")} <a href="${localePath(locale, "privacidad")}">${t("contact.privacyLink")}</a>.</p>
          </div>
        </form>
      </div>`}
    </div>
  </section>`;
}
