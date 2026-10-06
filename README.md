# Gauss · Briggith Guzmán Chavarro

Landing page de **Gauss — Sanación del cuerpo y alma**, el consultorio de medicina alternativa de Briggith Guzmán Chavarro en Bucaramanga. Presenta sus terapias (biomagnetismo, liberación emocional, terapia del alma y encuentros en grupo), testimonios en video, podcast, redes sociales, ubicación y un formulario de contacto.

Es un sitio estático construido con [Bun](https://bun.sh): cada página se genera como HTML pre-renderizado con SEO técnico (JSON-LD, sitemap, Open Graph), imágenes optimizadas a AVIF/WebP, carga diferida de videos y mapa, tema claro/oscuro y diseño 100 % responsive. Toda la configuración está en `site.config.ts` y los textos en `src/i18n/es.json`.

## Instalación

**Requisitos**
- [Bun](https://bun.sh) 1.1 o superior: los scripts se ejecutan con Bun.
  - Windows (PowerShell): `powershell -c "irm bun.sh/install.ps1 | iex"`
  - macOS / Linux: `curl -fsSL https://bun.sh/install | bash`
- [pnpm](https://pnpm.io) como gestor de paquetes.

**Pasos**

```bash
pnpm install   # instala dependencias (sharp optimiza las imágenes)
pnpm dev       # servidor de desarrollo en http://localhost:3000 con recarga en vivo
```

Otros comandos:

```bash
pnpm build     # genera el sitio en dist/
pnpm check     # build + auditoría de SEO y enlaces
pnpm preview   # build + servidor de producción local
```

## Despliegue

**Antes de publicar**, completa en `site.config.ts` el dominio real (`url`), el correo de contacto y la clave de Web3Forms (`contact.accessKey`, se obtiene gratis en <https://web3forms.com>). Después, ejecuta `pnpm check` y verifica que termina sin avisos.

### Opción 1: hosting estático (recomendado)

Cloudflare Pages, Netlify o Vercel:

| Ajuste | Valor |
|---|---|
| Comando de build | `pnpm build` |
| Carpeta de salida | `dist` |

El hosting debe tener Bun disponible en el build. En Vercel y Netlify se puede usar `bun install && bun run build` como comando si pnpm no encuentra Bun. El build genera `_redirects`, `_headers` y `vercel.json` con las cabeceras de seguridad, la caché de assets y los atajos `/ig`, `/fb`, `/yt` y `/wa`.

### Opción 2: servidor propio (VPS, Railway, Fly, Render)

```bash
pnpm install
pnpm build
pnpm start     # sirve dist/ en el puerto 3000 (variable PORT)
```

O con Docker:

```dockerfile
FROM oven/bun:1 AS build
WORKDIR /app
COPY . .
RUN bun install && bun run build

FROM oven/bun:1-slim
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["bun", "run", "src/server/serve.ts"]
```

### Después de publicar

- Envía `https://<tu-dominio>/sitemap.xml` en Google Search Console.
- Configura Google Business Profile con el mismo nombre, dirección y teléfono que la web.
