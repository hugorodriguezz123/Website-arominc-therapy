import config from "../../site.config";
import { html } from "../lib/html";
import { icon } from "../lib/icons";
import { eyebrow, title } from "../lib/ui";
import type { RenderCtx } from "../lib/layout";

/**
 * Ubicación compacta: mapa + dirección, horario y botones "Cómo llegar" / "Abrir en Waze".
 * El mapa ilustrado no carga nada; si defines location.mapEmbed, el iframe de Google Maps
 * se carga solo al acercarse (data-src → lazyMisc en el cliente).
 */
export function location({ t }: RenderCtx, id = "ubicacion") {
  const loc = config.location;
  const addr = config.seo.organization.address;
  return html`<section class="section bg-mist lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container">
      <div class="sec-head center reveal">
        ${eyebrow(t("location.eyebrow"), "center")}
        ${title(t, "location", `${id}-title`)}
      </div>
      <div class="loc reveal">
        <div class="map">
          <div class="map-art" aria-hidden="true">
            <span class="map-water"></span><span class="map-block b1"></span><span class="map-block b2"></span>
            <span class="map-block b3"></span><span class="map-block b4"></span><span class="map-park"></span>
            <span class="map-road ra"></span><span class="map-road rb"></span><span class="map-road rc"></span><span class="map-road rd"></span>
            <span class="map-pulse"></span>
            <span class="map-pin"><span class="map-pin-head"><img src="/images/brand/gauss-simbolo.webp" width="264" height="185" alt="" loading="lazy" decoding="async"></span><span class="map-pin-tip"></span></span>
          </div>
          ${loc.mapEmbed ? html`<iframe class="map-frame" data-src="${loc.mapEmbed}" title="${t("location.mapTitle")}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : ""}
        </div>
        <div class="loc-info">
          <h3 class="h3">${t("location.name")}</h3>
          ${addr ? html`<p class="loc-lines">${addr.street ? html`<span>${addr.street}</span>` : ""}<span>${[addr.city, addr.region].filter(Boolean).join(", ")}</span></p>` : ""}
          <div class="loc-hours"><strong>${t("location.hoursTitle")}</strong>${t.list<string>("location.hours").map((h) => html`<span>${h}</span>`)}</div>
          <div class="actions">
            <a class="btn btn-primary btn-sm" href="${loc.directionsUrl}" target="_blank" rel="noopener">${icon("navigate", 18)}${t("location.directions")}</a>
            ${loc.wazeUrl ? html`<a class="btn btn-ghost btn-sm" href="${loc.wazeUrl}" target="_blank" rel="noopener">${t("location.waze")}</a>` : ""}
          </div>
          <p class="txt">${t("location.online")}</p>
        </div>
      </div>
    </div>
  </section>`;
}
