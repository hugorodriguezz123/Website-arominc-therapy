import { defineConfig } from "./src/lib/types";

/**
 * ÚNICO punto de configuración del sitio.
 * Los valores entre "TU_…" o con 0000 son de ejemplo: cámbialos antes de publicar (ver README).
 */
export default defineConfig({
  url: "https://www.tu-dominio.com",          // TODO: dominio real, sin barra final
  name: "Gauss",

  // Sitio solo en español. Para añadir inglés: ["es", "en"] + src/i18n/en.json (ver README).
  locales: ["es"],
  i18nSwitcher: false,

  // Arranca en claro (como el diseño) y el visitante puede cambiar a oscuro; la elección se recuerda.
  theme: { default: "light", switcher: true },
  themeColor: { light: "#FBF9FE", dark: "#130D20" },

  seo: {
    titleTemplate: "%s | Gauss",
    ogImage: "/images/og.jpg",
    organization: {
      type: "LocalBusiness",                  // atiende en un consultorio físico → panel local de Google
      logo: "/images/logo.png",
      email: "hola@tu-dominio.com",           // TODO
      telephone: "+57 301 600 7200",
      address: {
        street: "Cl. 153A #21-50",
        city: "Bucaramanga",
        region: "Santander",
        postalCode: "680001",
        country: "CO",
      },
      openingHours: ["Mo-Fr 09:00-19:00", "Sa 09:00-14:00"],
    },
  },

  // Cada red sale en el pie, en la sección "Redes" y en el JSON-LD (sameAs). /ig, /fb… sirven para QR o bio.
  social: [
    { network: "instagram", url: "https://www.instagram.com/briggith.gauss", redirect: "/ig", handle: "@briggith.gauss" },
    { network: "facebook", url: "https://www.facebook.com/Gauss.Healt", redirect: "/fb", handle: "/Gauss.Healt" },
    { network: "youtube", url: "https://www.youtube.com/@BriggithGauss", redirect: "/yt", handle: "@BriggithGauss" },
    { network: "whatsapp", url: "https://wa.me/573016007200?text=Hola%20Briggith%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20terapias", redirect: "/wa" },
  ],

  /**
   * Videos. group = sección donde aparecen. draft:true = de ejemplo (no publica JSON-LD).
   * YouTube/Vimeo/Instagram/Facebook se cargan solo al hacer clic. "link" (TikTok…) abre la publicación original.
   * Portadas: pon la imagen en public/images/videos/<key>.jpg (si no existe se muestra un fondo de marca).
   */
  videos: [
    { key: "presentacion", group: "presentacion", source: { provider: "facebook", url: "https://www.facebook.com/reel/946948058143322" },
      poster: "/images/videos/presentacion.jpg", width: 9, height: 16,
      title: "video.presentacion.title", description: "video.presentacion.description",
      uploadDate: "2026-10-01", duration: "PT1M" },

    { key: "testimonio-1", group: "testimonio", source: { provider: "facebook", url: "https://www.facebook.com/reel/1599290398556661" },
      poster: "/images/videos/testimonio-1.jpg", width: 9, height: 16,
      title: "video.testimonio-1.title", description: "video.testimonio-1.description", uploadDate: "2026-10-01" },
    { key: "testimonio-2", group: "testimonio", source: { provider: "facebook", url: "https://www.facebook.com/reel/1086883073726535" },
      poster: "/images/videos/testimonio-2.jpg", width: 9, height: 16,
      title: "video.testimonio-2.title", description: "video.testimonio-2.description", uploadDate: "2026-10-01" },
    { key: "testimonio-3", group: "testimonio", source: { provider: "youtube", id: "GubknxZgeo8" },
      poster: "/images/videos/testimonio-3.jpg", width: 9, height: 16,
      title: "video.testimonio-3.title", description: "video.testimonio-3.description", uploadDate: "2025-07-05", duration: "PT58S" },
    { key: "testimonio-4", group: "testimonio", source: { provider: "facebook", url: "https://www.facebook.com/reel/1538608567621587" },
      poster: "/images/videos/testimonio-4.jpg", width: 9, height: 16,
      title: "video.testimonio-4.title", description: "video.testimonio-4.description", uploadDate: "2026-10-01" },
    { key: "testimonio-5", group: "testimonio", source: { provider: "instagram", id: "DaGqspkjeZX" },
      poster: "/images/videos/testimonio-5.jpg", width: 9, height: 16,
      title: "video.testimonio-5.title", description: "video.testimonio-5.description", uploadDate: "2026-10-01" },
    { key: "testimonio-6", group: "testimonio", source: { provider: "facebook", url: "https://www.facebook.com/reel/2111799206346298" },
      poster: "/images/videos/testimonio-6.jpg", width: 9, height: 16,
      title: "video.testimonio-6.title", description: "video.testimonio-6.description", uploadDate: "2026-10-01" },
    { key: "testimonio-7", group: "testimonio", source: { provider: "facebook", url: "https://www.facebook.com/reel/1684776865985422" },
      poster: "/images/videos/testimonio-7.jpg", width: 9, height: 16,
      title: "video.testimonio-7.title", description: "video.testimonio-7.description", uploadDate: "2026-10-01" },
    { key: "testimonio-8", group: "testimonio", source: { provider: "facebook", url: "https://www.facebook.com/reel/1504697904598436" },
      poster: "/images/videos/testimonio-8.jpg", width: 9, height: 16,
      title: "video.testimonio-8.title", description: "video.testimonio-8.description", uploadDate: "2026-10-01" },

    { key: "podcast-1", group: "podcast", source: { provider: "youtube", id: "bZHei-Spmsk" },
      title: "video.podcast-1.title", description: "video.podcast-1.description", uploadDate: "2025-07-28", duration: "PT14M59S" },
    { key: "podcast-2", group: "podcast", source: { provider: "youtube", id: "RqX_glOi6m0" },
      title: "video.podcast-2.title", description: "video.podcast-2.description", uploadDate: "2025-07-29", duration: "PT14M1S" },
    { key: "podcast-3", group: "podcast", source: { provider: "youtube", id: "FwK19GlcbLc" },
      title: "video.podcast-3.title", description: "video.podcast-3.description", uploadDate: "2025-07-29", duration: "PT13M45S" },
    { key: "podcast-4", group: "podcast", source: { provider: "youtube", id: "uQmfD6_hjaQ" },
      title: "video.podcast-4.title", description: "video.podcast-4.description", uploadDate: "2024-09-17", duration: "PT1H20M59S" },
  ],

  // Hosting estático → Web3Forms. Crea tu clave gratis en https://web3forms.com con el correo que recibirá los mensajes.
  contact: {
    provider: "web3forms",
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "c08901d0-e8e2-4275-b6a6-b8528b2eb797",
    fields: ["name", "email", "phone", "therapy", "message"],
  },

  location: {
    mapEmbed: "https://maps.google.com/maps?q=Cl.%20153A%20%2321-50%2C%20Bucaramanga%2C%20Santander%2C%20Colombia&z=16&output=embed",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Cl.%20153A%20%2321-50%2C%20Bucaramanga%2C%20Santander%2C%20Colombia",
    wazeUrl: "https://waze.com/ul?q=Cl.%20153A%20%2321-50%2C%20Bucaramanga%2C%20Santander%2C%20Colombia&navigate=yes",
  },

  build: {
    inlineCss: false,                         // el CSS de la marca supera ~30 KB: archivo aparte con caché inmutable
    imageWidths: [320, 480, 960, 1440],
  },
});
