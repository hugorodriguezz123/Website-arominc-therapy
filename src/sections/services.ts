import { html } from "../lib/html";
import { img } from "../lib/images";
import { icon } from "../lib/icons";
import { eyebrow, title } from "../lib/ui";
import { whatsappUrl, type RenderCtx } from "../lib/layout";

export interface Service { key: string; title: string; text: string; benefits: string[] }

/** WhatsApp con el mensaje ya escrito para el servicio elegido ({service} se reemplaza por su nombre). */
function bookUrl(template: string, service: string) {
  const base = whatsappUrl();
  if (!base.startsWith("http")) return base;
  const u = new URL(base);
  return `${u.origin}${u.pathname}?text=${encodeURIComponent(template.replace("{service}", service))}`;
}

/**
 * Servicios: carrusel deslizable (táctil, teclado y flechas) con imagen, descripción, beneficios y "Agendar cita".
 * Imagen de cada servicio en public/images/servicios/<key>.webp. Contenido en i18n: services.items
 */
export function services({ t }: RenderCtx, id = "servicios") {
  const items = t.list<Service>("services.items");
  const msg = t("services.bookMessage");
  return html`<section class="section bg-ground lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container" data-carousel>
      <div class="pod-head">
        <div class="sec-head reveal">
          ${eyebrow(t("services.eyebrow"))}
          ${title(t, "services", `${id}-title`)}
          <p class="lead">${t("services.lead")}</p>
        </div>
        <div class="pod-actions">
          <button type="button" class="arrow" data-prev aria-label="${t("a11y.prev")}">${icon("arrow-left", 20)}</button>
          <button type="button" class="arrow arrow-solid" data-next aria-label="${t("a11y.next")}">${icon("arrow", 20)}</button>
        </div>
      </div>
      <ul class="track track-svc" role="list" aria-label="${t("a11y.servicesTrack")}" data-track tabindex="0">
        ${items.map((s) => html`<li class="scard">
          <div class="scard-img">${img({
            // alt vacío: el texto de la imagen (título y beneficios) ya está escrito en la tarjeta
            src: `/images/servicios/${s.key}.webp`, alt: "",
            sizes: "(min-width: 960px) 380px, (min-width: 640px) 46vw, 84vw",
          })}</div>
          <div class="scard-body">
            <h3 class="card-title">${s.title}</h3>
            <p class="txt">${s.text}</p>
            <ul class="check-list" role="list">
              ${s.benefits.map((b) => html`<li>${b}</li>`)}
            </ul>
            <a class="btn btn-primary btn-sm btn-book" href="${bookUrl(msg, s.title)}" target="_blank" rel="noopener">${t("services.cta")}<span class="sr-only"> ${s.title} ${t("a11y.newTab")}</span></a>
          </div>
        </li>`)}
      </ul>
    </div>
  </section>`;
}

/** Cómo es el proceso: versión corta (valoración, sesión, programa). El detalle vive en Preguntas. */
export function processSteps({ t }: RenderCtx, id = "proceso") {
  const steps = t.list<{ title: string; text: string }>("process.steps");
  return html`<section class="section bg-white lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container">
      <div class="sec-head center reveal">
        ${eyebrow(t("process.eyebrow"), "center")}
        ${title(t, "process", `${id}-title`)}
        <p class="lead">${t("process.lead")}</p>
      </div>
      <ol class="proc-steps" role="list">
        ${steps.map((s, i) => html`<li class="reveal" style="--d:${i * 80}ms">
          <span class="num tone-${i % 3}">0${i + 1}</span>
          <h3 class="card-title">${s.title}</h3>
          <p class="txt">${s.text}</p>
        </li>`)}
      </ol>
      <p class="proc-more reveal"><a href="#preguntas">${t("process.more")}${icon("arrow", 18)}</a></p>
    </div>
  </section>`;
}
