import config from "../../site.config";
import { html, raw, type Safe } from "./html";
import { localePath, type T } from "./i18n";
import { seoHead, baseSchemas, jsonLd, type PageMeta } from "./seo";
import { icon, networkName } from "./icons";
import { preloadImage } from "./images";
import { waveDefs } from "./ui";
import { videoSchema } from "../sections/video";

export interface RenderCtx {
  locale: string;
  t: T;
  meta: PageMeta;
  videosUsed: Set<string>;
}

export interface Page {
  slug: string;
  meta: (t: T) => Omit<PageMeta, "slug">;
  render: (ctx: RenderCtx) => Safe;
  /** Imagen LCP (hero) para <link rel=preload>. sizes DEBE coincidir con el del <img> o se descarga dos veces. */
  lcpImage?: { src: string; sizes?: string };
}
export const definePage = (p: Page) => p;

interface LayoutArgs {
  ctx: RenderCtx;
  body: Safe;
  css: { inline?: string; href?: string };
  js: string;
  lcpImage?: { src: string; sizes?: string };
}

/**
 * Script bloqueante MÍNIMO en <head>: aplica el tema antes del primer pintado (evita el flash).
 * Respeta: preferencia guardada (si hay switcher) → default del sitio → prefers-color-scheme.
 * También activa la entrada con el logo (una vez por sesión, nunca con reduced-motion).
 */
const themeBoot = (def: string, sw: boolean) =>
  raw(`<script>(function(){var d=document.documentElement,t="${def}";try{${sw ? 't=localStorage.getItem("theme")||t;' : ""}}catch(e){}if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t;d.classList.add("js");try{if(!sessionStorage.getItem("intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("intro-on")}catch(e){}})()</script>`);

const href = (locale: string, h: string) =>
  h.startsWith("#") ? localePath(locale) + h : h.startsWith("page:") ? localePath(locale, h.slice(5)) : h;

const BRAND = {
  lotus: { src: "/images/brand/gauss-simbolo.webp", w: 264, h: 185 },
  word: { src: "/images/brand/gauss-wordmark.webp", w: 280, h: 78 },
  wordWhite: { src: "/images/brand/gauss-wordmark-blanco.webp", w: 280, h: 78 },
};

/** Logo horizontal: loto + "Gauss" + lema. En tema oscuro (o en el pie) usa el wordmark blanco. */
export function brandLockup(t: T, onDark = false) {
  return html`<img class="brand-lotus" src="${BRAND.lotus.src}" width="${BRAND.lotus.w}" height="${BRAND.lotus.h}" alt="" decoding="async">
    <span class="brand-txt">
      ${onDark
        ? html`<img class="brand-word" src="${BRAND.wordWhite.src}" width="${BRAND.word.w}" height="${BRAND.word.h}" alt="Gauss" decoding="async">`
        : html`<img class="brand-word brand-word-light" src="${BRAND.word.src}" width="${BRAND.word.w}" height="${BRAND.word.h}" alt="Gauss" decoding="async"><img class="brand-word brand-word-dark" src="${BRAND.wordWhite.src}" width="${BRAND.word.w}" height="${BRAND.word.h}" alt="Gauss" decoding="async">`}
      <span class="brand-rule" aria-hidden="true"></span>
      <span class="brand-tag">${t("brand.tagline")}</span>
    </span>`;
}

export const whatsappUrl = () => config.social.find((s) => s.network === "whatsapp")?.url ?? "#contacto";

export function layout({ ctx, body, css, js, lcpImage }: LayoutArgs) {
  const { locale, t, meta } = ctx;
  const nav = t.list<{ label: string; href: string }>("nav.items");
  const showLang = config.i18nSwitcher && config.locales.length > 1;
  const showTheme = config.theme.switcher;
  const videoLd = [...ctx.videosUsed].map((k) => videoSchema(k, t)).filter(Boolean) as object[];
  const org = config.seo.organization;
  const home = localePath(locale);

  return html`<!doctype html>
<html lang="${locale}" data-theme-default="${config.theme.default}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${themeBoot(config.theme.default, showTheme)}
<meta name="color-scheme" content="${config.theme.default === "system" || showTheme ? "light dark" : config.theme.default}">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="${config.themeColor.light}">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${config.themeColor.dark}">
${seoHead(meta, locale)}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/fonts/GeneralSans-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/ClashDisplay-Variable.woff2" as="font" type="font/woff2" crossorigin>
${lcpImage ? preloadImage(lcpImage.src, lcpImage.sizes) : ""}
${css.inline ? raw(`<style>${css.inline}</style>`) : html`<link rel="stylesheet" href="${css.href}">`}
<script type="module" src="${js}"></script>
${baseSchemas(meta, locale, t)}
${videoLd.length ? jsonLd({ "@context": "https://schema.org", "@graph": videoLd }) : ""}
</head>
<body>
<a class="skip-link" href="#main">${t("a11y.skip")}</a>
<div class="intro" aria-hidden="true">
  <div class="intro-box">
    <img class="intro-lotus" src="${BRAND.lotus.src}" width="${BRAND.lotus.w}" height="${BRAND.lotus.h}" alt="">
    <img class="intro-word" src="${BRAND.word.src}" width="${BRAND.word.w}" height="${BRAND.word.h}" alt="">
    <span class="intro-bar"><span></span></span>
  </div>
</div>
${waveDefs}
<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="brand" href="${home}" aria-label="${t("brand.home")}">${brandLockup(t)}</a>

    <nav class="site-nav" id="site-nav" aria-label="${t("a11y.mainNav")}">
      <ul>${nav.map((i) => html`<li><a href="${href(locale, i.href)}">${i.label}</a></li>`)}</ul>
    </nav>

    <div class="header-actions">
      ${showLang ? html`
      <details class="lang-switch">
        <summary aria-label="${t("a11y.language")}">${icon("globe", 18)}<span>${locale.toUpperCase()}</span></summary>
        <ul role="list">
          ${config.locales.map((l) => html`<li><a href="${localePath(l, meta.slug)}" hreflang="${l}" lang="${l}" data-lang="${l}"
            ${l === locale ? raw('aria-current="true"') : ""}>${t(`languages.${l}`)}</a></li>`)}
        </ul>
      </details>` : ""}
      <a class="btn btn-primary btn-sm header-cta" href="${href(locale, "#contacto")}">${t("nav.cta")}</a>
      ${showTheme ? html`
      <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="${t("a11y.toggleTheme")}">
        <span class="i-sun">${icon("sun", 20)}</span><span class="i-moon">${icon("moon", 20)}</span>
      </button>` : ""}
      <button class="icon-btn menu-toggle" type="button" data-menu-toggle aria-controls="site-nav" aria-expanded="false" aria-label="${t("a11y.menu")}">${icon("menu", 22)}</button>
    </div>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="brand" href="${home}" aria-label="${t("brand.home")}">${brandLockup(t, true)}</a>
        <p>${t("footer.about")}</p>
        ${config.social.length ? html`
        <ul class="social" role="list">
          ${config.social.map((s) => html`<li><a href="${s.url}" target="_blank" rel="noopener me"
              aria-label="${s.label ?? networkName[s.network]}">${icon(s.network)}</a></li>`)}
        </ul>` : ""}
      </div>
      <nav class="footer-col" aria-label="${t("a11y.footerNav")}">
        <p class="footer-h">${t("footer.explore")}</p>
        <ul role="list">
          ${nav.map((i) => html`<li><a href="${href(locale, i.href)}">${i.label}</a></li>`)}
          <li><a href="${localePath(locale, "privacidad")}">${t("footer.privacy")}</a></li>
        </ul>
      </nav>
      <div class="footer-col">
        <p class="footer-h">${t("footer.hoursTitle")}</p>
        ${t.list<string>("location.hours").map((h) => html`<p>${h}</p>`)}
        ${org.address ? html`<p>${[org.address.street, org.address.city].filter(Boolean).join(" · ")}</p>` : ""}
      </div>
      <div class="footer-col">
        <p class="footer-h">${t("footer.contactTitle")}</p>
        <ul role="list">
          <li><a href="${whatsappUrl()}" target="_blank" rel="noopener">WhatsApp ${org.telephone ?? ""}</a></li>
          ${org.email ? html`<li><a href="mailto:${org.email}">${org.email}</a></li>` : ""}
        </ul>
        <a class="btn btn-primary btn-sm" href="${href(locale, "#contacto")}">${t("nav.cta")}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} ${config.name} · Briggith Guzmán Chavarro. ${t("footer.rights")}</p>
      <p>${t("footer.disclaimer")}</p>
    </div>
  </div>
</footer>

<div class="mbar">
  <a class="btn btn-primary" href="${href(locale, "#contacto")}">${t("mbar.cta")}</a>
  <a class="mbar-wa" href="${whatsappUrl()}" target="_blank" rel="noopener" aria-label="${t("mbar.wa")}">${icon("whatsapp", 24)}</a>
</div>

<dialog class="vdialog" data-video-dialog aria-label="${t("a11y.videoDialog")}">
  <button class="icon-btn vdialog-close" type="button" data-video-close aria-label="${t("a11y.close")}">${icon("close", 22)}</button>
  <div class="vdialog-frame" data-video-frame></div>
</dialog>
<noscript><style>.site-nav{display:block!important}.theme-toggle,.menu-toggle{display:none}.reveal{opacity:1!important;transform:none!important}[data-tabpanel][hidden]{display:grid!important}.tabs,.car-nav{display:none!important}.intro{display:none!important}</style></noscript>
</body>
</html>`;
}
