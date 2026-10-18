# Nuvel — tema de Shopify (base: Rise)

Tema de la tienda **Nuvel** (fajas y prendas moldeadoras), construido sobre
**Rise**, el tema oficial de Shopify, con la identidad de diseño Nuvel migrada
desde el tema custom anterior. Tienda: `31cyvt-0z.myshopify.com`

## Qué es este tema

Rise funciona con **Online Store 2.0**: cada página es una plantilla JSON
(`templates/*.json`) que apila secciones, y las secciones se configuran desde
el editor del admin — sin tocar código para cambiar textos, fotos u orden.

| Carpeta | Qué contiene |
|---|---|
| `layout/theme.liquid` | Esqueleto global: `<head>`, grupos de cabecera y pie |
| `sections/header-group.json` | Barra de anuncios (rotativa) + cabecera |
| `sections/footer-group.json` | Pie con marca, menú, contacto, newsletter |
| `templates/index.json` | La portada (secciones ordenadas) |
| `templates/*.json` | Resto de páginas (producto, colección, carrito, etc.) |
| `sections/*.liquid` | Las secciones nativas de Rise |
| `snippets/`, `assets/`, `locales/` | Piezas de Rise + imágenes Nuvel |
| `config/settings_data.json` | Toda la identidad Nuvel: colores, fuentes, radios |
| `config/product-margin-map.json` | Herramienta interna de márgenes (no es del tema) |

## Identidad Nuvel aplicada (settings_data.json)

- **Colores**: 5 esquemas — blanco `#FFFFFF` (principal), gris cálido
  `#F4F4F2` (fondo alterno), negro `#1A1A1A` (oscuro, pie y anuncios),
  dorado oscuro `#8A6F4A` (badge de oferta), beige `#F5F1EC`.
- **Tipografía**: **Lora** (títulos) + **Poppins** (cuerpo), como el diseño
  original.
- **Botones/tarjetas**: radio 2 px, bordes finos — la misma estética sobria.
- **Ancho de página**: 1280 px.
- **Favicon**: `assets/favicon.png` (referenciado con `shopify://assets/`).
- **Carrito**: drawer nativo de Rise con nota de compra.
- **Instagram**: `https://www.instagram.com/nuvelshape/` (pie + settings).

## Portada (templates/index.json)

1. **Hero** — `hero-principal.jpg`, titular "Fajas moldeadoras que no se
   notan ni en el espejo.", CTA al producto ancla.
2. **Vida real** — dos columnas: "El producto" (`producto-frente.jpg`) y
   "Puesta, invisible" (`avatar-vestida.jpg`).
3. **Producto ancla** — featured-product de la faja real, con selector de
   talla, botón de compra e iconos de beneficios (ojo/silueta/lavado/regla).
4. **Nuestro catálogo** — 8 productos de la colección `all` + botón "ver todo".
5. **Por qué Nuvel** — 4 tarjetas (costuras, enrollado, lavados, tallas).
6. **Testimonios** — los dos párrafos honestos de siempre.
7. **Confianza** — envío gratis, 30 días, pago seguro.
8. **CTA final** — `avatar-athleisure.jpg` con el eslogan "Sin aros. Sin
   costuras. Sin que se note nada."

## Pendiente en el admin de Shopify

1. **Publicar el tema**: `shopify theme push --unpublished` (o subir el zip)
   y previsualizar antes de publicar en vivo.
2. **Menús** (Tienda online → Navegación): el tema referencia `main-menu` y
   `footer`. Sugerencia para `main-menu`: Inicio (`/`), Faja (`/products/faja-moldeadora-invisible-nuvel`),
   Corsé (`/products/retro-shapewear-top-with-zipper`), Short (`/products/seamless-shapewear-panties`),
   Vestido (`/products/womens-shapewear-dress-jumpsuit`), Sobre nosotros y FAQ (páginas).
   Para `footer`: Envíos, Devoluciones, Privacidad, Términos.
3. **Redirects** (Marketing → URL redirects) para no perder SEO de las URLs
   antiguas:

   | Antigua | Nueva |
   |---|---|
   | `/pages/producto` | `/products/faja-moldeadora-invisible-nuvel` |
   | `/pages/corse` | `/products/retro-shapewear-top-with-zipper` |
   | `/pages/short` | `/products/seamless-shapewear-panties` |
   | `/pages/vestido` | `/products/womens-shapewear-dress-jumpsuit` |
   | `/pages/catalogo` | `/collections/all` |

4. **Traducir la portada al inglés** (Translate & Adapt): los textos de las
   secciones ya no viven en `locales/`, sino en los ajustes de las
   plantillas JSON. Textos EN listos para pegar:

   | Dónde | Inglés |
   |---|---|
   | Hero titular | Shapewear you can't see — not even in the mirror. |
   | Hero subtítulo | Because the perfect shaper is the one nobody knows you're wearing: it slips under any dress, never rolls up, and its edge never shows. |
   | Hero botón | Discover the Invisible Shaping Girdle |
   | Vida real título | The product in real life |
   | Columna 1 | The product / The garment on its own. |
   | Columna 2 | Worn, invisible / How it looks worn under everyday clothes, without showing. |
   | Ancla eyebrow | Invisible Shaping Girdle |
   | Beneficios | Seamless: invisible under any garment / Soft, all-day comfortable compression / Holds its shape wash after wash / Size chart included |
   | Catálogo título | Our catalog |
   | Por qué título | Why Nuvel |
   | Por qué (4) | Seamless, invisible / It doesn't show under clothes, and no one can tell you're wearing it. — Won't roll up or itch / Soft compression that lasts all day without bothering you. — Wash after wash / It won't lose its shape or compression after the first wash. — Clear size chart / A simple guide to pick your size without fear of getting it wrong. |
   | Testimonios | Real customers, real messages / Every week we post screenshots from our customers' WhatsApp messages: sizing questions, what size they ordered, and the photo of the garment worn. No posing, exactly as they arrive. — We're asking our customers for permission to publish their messages here as they are. As soon as we have it, you'll see them unedited. |
   | Confianza | Shop with peace of mind / Free shipping worldwide — Delivery in 7-15 business days, with email tracking. / 30-day trial — If you're not convinced, write to us within the first 30 days and return it hassle-free. / 100% secure payment — Your data protected on every purchase. |
   | CTA final | No underwire. No seams. Nothing shows. / 30-day trial: not convinced? We refund you. / View the catalog |
   | Anuncios | Free shipping worldwide · 10% off with code NUVEL10 — 30-day trial · Not convinced? We refund you — No underwire. No seams. Nothing shows. — 100% secure payment with card and PayPal |
   | Pie | Information / Contact: Write to us at hola@nuvelshape.store — Instagram: @nuvelshape / Nuvel news and offers, no spam |

   Los textos del **tema** (botones "Añadir al carrito", carrito, etc.)
   ya vienen traducidos en `locales/en.default.json` y `locales/es.json`.
5. **Favicon**: ya queda referenciado. Si en el editor no se viera,
   súbelo desde Ajustes del tema → Favicon (Content → Files).

## Qué cambió respecto al tema anterior

- Las **landing pages custom** (`/pages/corse`, etc.) desaparecen: cada
  producto tiene su **página nativa** de Rise (galería, variantes, reseñas
  de apps, checkout dinámico). Los descuentos automáticos ("15% en la 2ª
  unidad", NUVEL10) los sigue aplicando Shopify igual que antes.
- El **marquee** superior pasó a 4 anuncios rotativos nativos.
- El **carrito custom** (drawer + buscador custom) pasó al drawer nativo
  de Rise, que ya integra barra de envío gratis y actualización en vivo.
- El tema custom completo queda en el historial de git (commit
  anterior a la migración) por si hay que rescatar algo.

## Reglas al tocar el código

1. **Los textos de portada viven en los JSON de plantillas/secciones**,
   no en `locales/`. Los strings del tema sí van por `{{ 'clave' | t }}`
   desde `locales/es.json` / `en.default.json` — nunca escribas texto fijo
   en un `.liquid` de Rise.
2. **Cabecera y pie se editan en `header-group.json` / `footer-group.json`**
   (o mejor: desde el editor del admin).
3. **Imágenes de secciones**: se referencian con `shopify://assets/<archivo>`
   (viven en `assets/`) o con el selector del editor (Content → Files,
   formato `shopify://shop_images/<archivo>`).
4. Para cambios de estilo, prefiere **Ajustes del tema** (colores, fuentes,
   radios) antes que tocar los CSS de Rise: así el tema sigue
   actualizable desde el admin.
5. `scripts/` y `data/` siguen fuera del tema (`.gitignore`), igual que
   `config/product-margin-map.json` que Shopify ignora.

## Activar el inglés (prompt para Sidekick)

> Ya ejecutado: el inglés está visible en `/en`. El prompt queda aquí por si
> hay que re-verificar algo en el panel.

```text
Contexto: Mi tienda Nuvel vende fajas y prendas moldeadoras. Mi mercado
principal es España (idioma español, moneda EUR), pero últimamente recibo
mucho tráfico internacional y de EE.UU. Las traducciones al inglés ya están
hechas, pero el idioma no es visible para los clientes porque no pertenece
a ningún mercado.

Haz lo siguiente, en este orden:

1. En Configuración → Mercados, abre el mercado "Internacional" y añade el
   idioma Inglés, de forma que quede visible para los clientes. Publica el
   cambio.
2. Activa la sugerencia o redirección automática de idioma según el navegador
   del visitante. España sigue siendo el mercado principal y el español el
   idioma por defecto.
3. Revisa que las notificaciones transaccionales estén traducidas al inglés.
4. NO crees todavía un mercado específico para EE.UU. y NO cambies monedas
   ni precios: todo sigue en EUR por ahora.
5. NO modifiques productos, colecciones, páginas ni el código del tema.
```
