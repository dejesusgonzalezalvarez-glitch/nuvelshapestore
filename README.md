# Nuvel — tema de Shopify (base: Rise)

Tema de la tienda **Nuvel** (fajas y prendas moldeadoras), construido sobre
**Rise**, el tema oficial de Shopify, con la identidad de diseño Nuvel migrada
desde el tema custom anterior. Tienda: `31cyvt-0z.myshopify.com`

Este repo está conectado a la tienda por la **integración GitHub de Shopify**:
cada push a `main` sincroniza el tema conectado automáticamente.

## Qué es este tema

Rise funciona con **Online Store 2.0**: cada página es una plantilla JSON
(`templates/*.json`) que apila secciones, y las secciones se configuran desde
el editor del admin — sin tocar código para cambiar textos, fotos u orden.

| Carpeta | Qué contiene |
|---|---|
| `layout/theme.liquid` | Esqueleto global + favicon Nuvel (fallback a `assets/favicon.png`) |
| `sections/header-group.json` | Barra de anuncios rotativa + cabecera |
| `sections/footer-group.json` | Pie con marca, enlaces, contacto, newsletter |
| `templates/index.json` | La portada (secciones ordenadas) |
| `sections/`, `snippets/` | Secciones nativas de Rise + personalizaciones Nuvel |
| `snippets/nuvel-nav-links.liquid` | **Botones de navegación de respaldo** (header y footer) |
| `locales/es.json`, `locales/en.default.json` | Textos del tema + claves `nuvel.*` (nav, hero, comparativa, CTA) |
| `config/settings_data.json` | Identidad Nuvel: colores, fuentes, radios (`current` + `presets`) |
| `config/product-margin-map.json` | Herramienta interna de márgenes (no es del tema) |

## Identidad Nuvel (settings_data.json)

- **Colores**: 5 esquemas — blanco `#FFFFFF` (principal), gris cálido
  `#F4F4F2` (alterno), negro `#1A1A1A` (oscuro), dorado oscuro `#8A6F4A`
  (badge de oferta), beige `#F5F1EC`.
- **Tipografía**: **Lora** (títulos) + **Poppins** (cuerpo).
- **Botones/tarjetas**: radio 2 px; ancho de página 1280 px.
- **Carrito**: drawer nativo de Rise con nota de compra.
- **Instagram**: `https://www.instagram.com/nuvelshape/` (pie + settings).

## Portada (templates/index.json)

1. **Hero** — sección custom-liquid con el diseño original Nuvel: degradado
   sobre `hero-principal.jpg`, eyebrow, titular grande y CTA al producto
   ancla. Los textos salen de `locales/nuvel.hero.*` (ES/EN).
2. **Vida real** — custom-liquid con las dos tarjetas solapadas de siempre:
   "El producto" y "Puesta, invisible" (`nuvel.compare.*`).
3. **Producto ancla** — featured-product nativo de la faja real: selector de
   talla, compra directa e iconos de beneficios (ojo/silueta/lavado/regla).
4. **Nuestro catálogo** — 8 productos de la colección `all` + "ver todo".
5. **Por qué Nuvel** — 4 tarjetas con fondo suave.
6. **Testimonios** — los dos párrafos honestos de siempre.
7. **Confianza** — envío gratis, 30 días, pago seguro.
8. **CTA final** — custom-liquid con `avatar-athleisure.jpg` y el eslogan.

## Navegación con respaldo (importante)

El header usa el menú `nuvel-nav` y el footer `nuvel-footer`, que **no
existen en el admin**. Cuando el menú no existe, el tema renderiza por
código los botones de siempre:

- **Header**: Inicio · Producto Destacado · Catálogo · Sobre nosotros ·
  Preguntas frecuentes (`snippets/nuvel-nav-links.liquid`).
- **Footer**: Envíos · Devoluciones · Privacidad · Términos.

Para gestionarlos desde el admin en el futuro: crea los menús con esos
mismos handles (`nuvel-nav`, `nuvel-footer`) en Tienda online → Navegación,
y tomarán el control automáticamente.

## Imágenes y sincronización GitHub

- Las imágenes de marca (hero, comparativa, CTA, favicon) viven en
  `assets/` y se renderizan con `{{ 'archivo.jpg' | asset_url }}` desde
  custom-liquid — **no uses `shopify://assets/` en settings de imagen**:
  el sync de GitHub lo rechaza y la plantilla no se aplica.
- El `config/settings_data.json` debe llevar SIEMPRE `current` **y**
  `presets` (Shopify lo exige); sin `presets` el archivo no sincroniza.

## Pendiente en el admin de Shopify

1. **Redirects** (Marketing → URL redirects) para no perder SEO:

   | Antigua | Nueva |
   |---|---|
   | `/pages/producto` | `/products/faja-moldeadora-invisible-nuvel` |
   | `/pages/corse` | `/products/retro-shapewear-top-with-zipper` |
   | `/pages/short` | `/products/seamless-shapewear-panties` |
   | `/pages/vestido` | `/products/womens-shapewear-dress-jumpsuit` |
   | `/pages/catalogo` | `/collections/all` |

2. **Traducir los textos de sección al inglés** (Translate & Adapt):
   anuncios (4), "Nuestro catálogo", "Por qué Nuvel" (4 tarjetas),
   "Compra con tranquilidad" (3), testimonios (3) y los ajustes del
   producto ancla ("Faja Moldeadora Invisible", beneficios). Los textos
   del hero/comparativa/CTA/navegación ya son bilingües vía `locales`.
3. **Previsualizar** antes de dar por bueno el diseño: si algo no cuadra,
   el sync tarda ~1 minuto en aplicar cada push.

## Qué cambió respecto al tema anterior

- Las **landing pages custom** (`/pages/corse`, etc.) desaparecen: cada
  producto tiene su **página nativa** de Rise (galería, variantes, reseñas
  de apps, checkout dinámico). Los descuentos automáticos ("15% en la 2ª
  unidad", NUVEL10) los sigue aplicando Shopify igual que antes.
- El **marquee** superior pasó a 4 anuncios rotativos nativos.
- El **carrito custom** pasó al drawer nativo de Rise (barra de envío
  gratis y actualización en vivo incluidas).
- El tema custom completo queda en el historial de git (commit `3cc4987`).

## Reglas al tocar el código

1. Los textos del **tema** van por `{{ 'clave' | t }}` desde `locales/`;
   las claves propias de Nuvel viven bajo `nuvel.*` en `es.json` y
   `en.default.json`.
2. **Cabecera y pie se editan en `header-group.json` / `footer-group.json`**
   (o desde el editor del admin).
3. Imágenes de marca: `assets/` + `asset_url` (nunca `shopify://assets/`
   en settings de imagen; el sync de GitHub lo rechaza).
4. `config/settings_data.json` siempre con `current` y `presets`.
5. Para estilos, prefiere **Ajustes del tema** antes que tocar CSS de Rise:
   así el tema sigue actualizable.
6. `scripts/` y `data/` siguen fuera del tema (`.gitignore`), igual que
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
