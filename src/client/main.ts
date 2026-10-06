/**
 * JS del cliente (~5 KB minificado). Todo es mejora progresiva — el sitio funciona sin JS.
 * Cada módulo se activa solo si su elemento existe en la página.
 */
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
};
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

/* ---------- Entrada con el logo: se retira al cargar (mín. 0,9 s, máx. 2,4 s) y no se repite en la sesión ---------- */
function intro() {
  if (!root.classList.contains("intro-on")) return;
  const start = performance.now();
  let done = false;
  const hide = () => {
    if (done) return;
    done = true;
    root.classList.add("intro-out");
    try { sessionStorage.setItem("intro", "1"); } catch {}
    setTimeout(() => root.classList.remove("intro-on", "intro-out"), 700);
  };
  const onLoad = () => setTimeout(hide, Math.max(0, 900 - (performance.now() - start)));
  if (document.readyState === "complete") onLoad(); else addEventListener("load", onLoad, { once: true });
  setTimeout(hide, 2400);
}

/* ---------- Tema claro / oscuro ---------- */
function theme() {
  const btn = $("[data-theme-toggle]");
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const apply = (t: string) => { root.dataset.theme = t; };
  mq.addEventListener("change", (e) => {
    if (!store.get("theme") && root.dataset.themeDefault === "system") apply(e.matches ? "dark" : "light");
  });
  btn?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    apply(next);
    store.set("theme", next);
  });
}

/* ---------- Idioma: recordar la elección (sin redirecciones automáticas: perjudican al SEO) ---------- */
function language() {
  $$<HTMLAnchorElement>("[data-lang]").forEach((a) => a.addEventListener("click", () => store.set("lang", a.dataset.lang!)));
  const d = $<HTMLDetailsElement>(".lang-switch");
  if (d) document.addEventListener("click", (e) => { if (!d.contains(e.target as Node)) d.open = false; });
}

/* ---------- Menú móvil + header con borde al hacer scroll ---------- */
function header() {
  const btn = $("[data-menu-toggle]");
  const nav = $("#site-nav");
  const setOpen = (open: boolean) => {
    btn?.setAttribute("aria-expanded", String(open));
    nav?.toggleAttribute("data-open", open);
  };
  btn?.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));
  nav?.addEventListener("click", (e) => { if ((e.target as Element).closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

  const h = $("[data-header]");
  if (h) {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px";
    document.body.prepend(sentinel);
    new IntersectionObserver(([e]) => h.toggleAttribute("data-scrolled", !e!.isIntersecting)).observe(sentinel);
  }
}

/* ---------- Animaciones al entrar en pantalla ---------- */
function reveal() {
  const els = $$(".reveal");
  if (!els.length) return;
  if (reducedMotion || !("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("is-visible"));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  els.forEach((el) => io.observe(el));
}

/* ---------- Carga diferida genérica: [data-src] en iframes (mapa), [data-bg] en fondos ---------- */
function lazyMisc() {
  const els = $$("[data-bg], iframe[data-src]");
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target as HTMLElement;
    if (el.dataset.bg) el.style.backgroundImage = `url("${el.dataset.bg}")`;
    if (el instanceof HTMLIFrameElement && el.dataset.src) el.src = el.dataset.src;
    io.unobserve(el);
  }), { rootMargin: "300px 0px" });
  els.forEach((el) => io.observe(el));
}

const iframe = (src: string, title: string) => {
  const f = document.createElement("iframe");
  f.src = `${src}${src.includes("?") ? "&" : "?"}autoplay=1&rel=0&dnt=1&playsinline=1`;
  f.title = title;
  f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  f.allowFullscreen = true;
  return f;
};
const preconnect = (url: string) => {
  const host = new URL(url, location.href).origin;
  if (host !== location.origin && !document.querySelector(`link[href="${host}"]`))
    document.head.append(Object.assign(document.createElement("link"), { rel: "preconnect", href: host }));
};

/* ---------- Videos en línea (podcast): fachada → iframe solo al hacer clic ---------- */
function videos() {
  $$("[data-video-embed]").forEach((box) => {
    const load = () => { box.replaceChildren(iframe(box.dataset.videoEmbed!, box.dataset.videoTitle ?? "Video")); };
    $("button", box)?.addEventListener("click", load, { once: true });
    box.addEventListener("pointerenter", () => preconnect(box.dataset.videoEmbed!), { once: true });
  });
}

/* ---------- Reproductor emergente (testimonios y presentación) con <dialog> nativo ---------- */
function videoModal() {
  const dlg = $<HTMLDialogElement>("[data-video-dialog]");
  const frame = $("[data-video-frame]");
  if (!dlg || !frame || typeof dlg.showModal !== "function") return;
  $$<HTMLAnchorElement>("[data-video-modal]").forEach((a) => {
    a.addEventListener("pointerenter", () => preconnect(a.dataset.videoModal!), { once: true });
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const [w, h] = (a.dataset.videoRatio ?? "16 / 9").split("/").map((n) => n.trim());
      frame.style.setProperty("--rw", w!);
      frame.style.setProperty("--rh", h!);
      if (a.dataset.videoKind === "file") {
        const v = Object.assign(document.createElement("video"), { src: a.dataset.videoModal!, controls: true, autoplay: true, playsInline: true });
        frame.replaceChildren(v);
      } else frame.replaceChildren(iframe(a.dataset.videoModal!, a.dataset.videoTitle ?? "Video"));
      dlg.showModal();
    });
  });
  $("[data-video-close]", dlg)?.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => frame.replaceChildren());
}

/* ---------- Pestañas accesibles (terapias individuales / en grupo) ---------- */
function tabs() {
  $$("[data-tabs]").forEach((list) => {
    const tabs = $$<HTMLButtonElement>("[role=tab]", list);
    const select = (tab: HTMLButtonElement, focus = false) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")!)?.toggleAttribute("hidden", !on);
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length]!, true); }
      });
    });
  });
}

/* ---------- Carruseles: flechas sobre el desplazamiento nativo (táctil y teclado funcionan solos) ---------- */
function carousels() {
  $$("[data-carousel]").forEach((c) => {
    const track = $("[data-track]", c);
    if (!track) return;
    const go = (dir: number) => track.scrollBy({ left: dir * Math.max(240, track.clientWidth * 0.8), behavior: reducedMotion ? "auto" : "smooth" });
    $("[data-prev]", c)?.addEventListener("click", () => go(-1));
    $("[data-next]", c)?.addEventListener("click", () => go(1));
  });
}

/* ---------- Formulario de contacto ---------- */
function contactForm() {
  const form = $<HTMLFormElement>("[data-contact-form]");
  if (!form) return;
  const status = $("[data-form-status]", form)!;
  const btn = $<HTMLButtonElement>("button[type=submit]", form)!;
  const ts = form.elements.namedItem("_ts") as HTMLInputElement;
  const clientSide = ["web3forms", "formspree"].includes(form.dataset.provider ?? "");
  ts.value = String(Date.now());

  const say = (key: "sending" | "ok" | "error" | "invalid") => {
    status.textContent = status.dataset[key] ?? "";
    status.dataset.state = key;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fields = $$<HTMLInputElement | HTMLTextAreaElement>(".field input, .field textarea", form);
    let firstBad: HTMLElement | null = null;
    fields.forEach((f) => {
      const ok = f.checkValidity();
      f.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstBad) firstBad = f;
    });
    if (firstBad) { say("invalid"); (firstBad as HTMLElement).focus(); return; }

    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    data.page = location.pathname;
    if (clientSide) delete data._ts;            // solo lo usa el servidor propio
    else data.lang = root.lang;

    btn.disabled = true; say("sending");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset(); ts.value = String(Date.now()); say("ok");
    } catch {
      say("error");
    } finally {
      btn.disabled = false;
    }
  });
}

intro();
theme();
language();
header();
reveal();
lazyMisc();
videos();
videoModal();
tabs();
carousels();
contactForm();
