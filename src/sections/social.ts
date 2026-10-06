import config from "../../site.config";
import { html } from "../lib/html";
import { hasFile, img } from "../lib/images";
import { icon, networkName } from "../lib/icons";
import { eyebrow, title } from "../lib/ui";
import type { RenderCtx } from "../lib/layout";

interface Post { kind: "reel" | "post" | "photo" | "logo"; network: string; badge: string; caption: string; image: string; alt: string; url?: string }

/**
 * Redes sociales: mosaico de publicaciones (reels altos + posts cuadrados) y botones a cada perfil.
 * Imágenes en public/images/redes/post-N.jpg (si no existen: fondo de marca). Cada post enlaza al perfil
 * (o a "url" si la defines en i18n).
 */
export function social({ t }: RenderCtx, id = "redes") {
  const posts = t.list<Post>("social.posts");
  const profiles = config.social.filter((s) => s.network !== "whatsapp" && s.network !== "email");
  const urlOf = (n: string) => config.social.find((s) => s.network === n)?.url ?? "#";
  return html`<section class="section bg-white lazy-section" id="${id}" aria-labelledby="${id}-title">
    <div class="container">
      <div class="sec-head center reveal">
        ${eyebrow(t("social.eyebrow"), "center")}
        ${title(t, "social", `${id}-title`)}
        <p class="lead">${t("social.lead")}</p>
      </div>
      <ul class="bento reveal" role="list">
        ${posts.map((p, i) => {
          const tall = p.kind === "reel";
          const has = hasFile(p.image);
          return html`<li class="post${tall ? " post-tall" : ""} ${has ? "" : `ph ph-${(i % 6) + 1}`}${p.kind === "logo" ? " post-logo" : ""}">
            <a href="${p.url ?? urlOf(p.network)}" target="_blank" rel="noopener" aria-label="${p.alt} ${t("a11y.newTab")}">
              ${has ? img({ src: p.image, alt: "", sizes: "(min-width: 960px) 280px, 50vw", class: p.kind === "photo" ? "post-photo" : "post-img" })
                : p.kind === "logo" ? html`<img class="post-lotus" src="/images/brand/gauss-simbolo.webp" width="264" height="185" alt="" loading="lazy" decoding="async">` : ""}
              <span class="src">${icon(p.network, 14)}${p.badge}</span>
              ${tall ? html`<span class="post-play">${icon("play", 20)}</span>` : ""}
              ${p.caption ? html`<span class="post-cap">${p.caption}</span>` : ""}
            </a>
          </li>`;
        })}
      </ul>
      <ul class="socials" role="list">
        ${profiles.map((s) => html`<li><a class="social-btn" href="${s.url}" target="_blank" rel="noopener me">
          <span class="social-ico social-${s.network}">${icon(s.network, 20)}</span>
          <span>${networkName[s.network]}<small>${s.handle ?? ""}</small></span>
        </a></li>`)}
      </ul>
    </div>
  </section>`;
}
