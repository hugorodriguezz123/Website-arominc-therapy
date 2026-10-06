import config from "../../site.config";
import { html } from "../lib/html";
import { absolute } from "../lib/i18n";
import { definePage } from "../lib/layout";
import { wave } from "../lib/ui";
import { hero, HERO_IMAGE, HERO_SIZES } from "../sections/hero";
import { about } from "../sections/about";
import { help } from "../sections/help";
import { therapies } from "../sections/therapies";
import { testimonials } from "../sections/testimonials";
import { faq } from "../sections/faq";
import { contact } from "../sections/contact";
import { podcast } from "../sections/podcast";
import { social } from "../sections/social";
import { location } from "../sections/location";

/**
 * Home / landing. El orden de las secciones es el orden en la página.
 * Entre secciones va una curva con línea en degradado (wave) que funde un fondo con el siguiente.
 */
export default definePage({
  slug: "",
  lcpImage: { src: HERO_IMAGE, sizes: HERO_SIZES },
  meta: (t) => {
    const org = `${config.url}/#organization`;
    const services = [...t.list<{ title: string; text: string }>("therapies.individual"), ...t.list<{ title: string; text: string }>("therapies.group")];
    return {
      title: t("home.meta.title"),
      description: t("home.meta.description"),
      priority: 1,
      jsonLd: [
        {
          "@type": "Person",
          "@id": `${config.url}/#briggith`,
          name: "Briggith Guzmán Chavarro",
          jobTitle: t("hero.badgeRole"),
          image: absolute("/images/og.jpg"),
          worksFor: { "@id": org },
        },
        ...services.map((s) => ({
          "@type": "Service",
          name: s.title,
          description: s.text,
          serviceType: "Medicina alternativa",
          provider: { "@id": org },
          areaServed: config.seo.organization.address?.country ?? "CO",
        })),
      ],
    };
  },
  render: (ctx) => html`
    ${hero(ctx)}
    ${wave("ground", "mist", 0)}
    ${about(ctx)}
    ${wave("mist", "white", 1)}
    ${help(ctx)}
    ${wave("white", "ground", 0)}
    ${therapies(ctx)}
    ${wave("ground", "mist", 1)}
    ${testimonials(ctx)}
    ${wave("mist", "white", 0)}
    ${faq(ctx)}
    ${wave("white", "mist", 1)}
    ${contact(ctx)}
    ${wave("mist", "night", 0)}
    ${podcast(ctx)}
    ${wave("night", "white", 1)}
    ${social(ctx)}
    ${wave("white", "mist", 0)}
    ${location(ctx)}
    ${wave("mist", "night", 1)}
  `,
});
