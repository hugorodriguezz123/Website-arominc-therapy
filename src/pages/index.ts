import config from "../../site.config";
import { html } from "../lib/html";
import { absolute } from "../lib/i18n";
import { definePage } from "../lib/layout";
import { wave } from "../lib/ui";
import { hero, HERO_IMAGE, HERO_SIZES } from "../sections/hero";
import { about } from "../sections/about";
import { help } from "../sections/help";
import { services, processSteps, type Service } from "../sections/services";
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
    const area = config.seo.organization.address?.country ?? "CO";
    const offers = t.list<{ name: string; price: number; currency: string }>("process.offers");
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
        {
          "@type": "Service",
          name: t("process.eyebrow"),
          description: t("process.lead"),
          serviceType: "Medicina alternativa",
          provider: { "@id": org },
          areaServed: area,
          offers: offers.map((o) => ({ "@type": "Offer", name: o.name, price: o.price, priceCurrency: o.currency })),
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: t("services.eyebrow"),
            itemListElement: t.list<Service>("services.items").map((s) => ({
              "@type": "Offer", itemOffered: { "@type": "Service", name: s.title },
            })),
          },
        },
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
    ${services(ctx)}
    ${wave("ground", "white", 1)}
    ${processSteps(ctx)}
    ${wave("white", "mist", 0)}
    ${testimonials(ctx)}
    ${wave("mist", "white", 1)}
    ${faq(ctx)}
    ${wave("white", "mist", 0)}
    ${contact(ctx)}
    ${wave("mist", "night", 1)}
    ${podcast(ctx)}
    ${wave("night", "white", 0)}
    ${social(ctx)}
    ${wave("white", "mist", 1)}
    ${location(ctx)}
    ${wave("mist", "night", 0)}
  `,
});
