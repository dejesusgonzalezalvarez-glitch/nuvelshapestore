# Nuvel — tema de Shopify

Tema de la tienda **Nuvel** (fajas y prendas moldeadoras).
Tienda: `31cyvt-0z.myshopify.com`

## Estructura

| Carpeta | Qué contiene |
|---|---|
| `layout/theme.liquid` | Esqueleto: cabecera global + contenido + pie global |
| `snippets/global-header.liquid` | Cabecera, menú y menú móvil |
| `snippets/global-footer.liquid` | Pie, carrito, buscador, zoom, textos i18n para `cart.js` y arranque del carrito |
| `sections/pag-portada.liquid` | La portada |
| `snippets/pag-*.liquid` | El contenido de cada página interior |
| `templates/` | Plantillas de cada tipo de página |
| `templates/404.liquid` | Red de seguridad genérica si una URL deja de existir (ya no depende de assets/pagina-*.js) |
| `locales/es.default.json`, `locales/en.json` | Textos del tema en español (por defecto) e inglés |
| `assets/` | Estilos, JavaScript e imágenes |

## Idiomas

El tema usa el sistema nativo de idiomas de Shopify: todo el texto pasa por
`{{ 'clave' | t }}` y sale de `locales/es.default.json` / `locales/en.json`.
Para que un visitante vea la tienda en inglés, **inglés debe estar publicado
como segundo idioma** en Shopify (Configuración → Idiomas) — sin eso, Shopify
solo tiene español para ofrecer, sin importar el navegador o el país del
visitante.

Las 11 páginas (`catalogo`, `producto`, `corse`, `short`, `vestido`,
`sobre-nosotros`, `preguntas-frecuentes`, `envios`, `devoluciones`,
`privacidad`, `terminos`) ya existen como páginas reales en Shopify (responden
200, no dependen de ningún puente). `templates/404.liquid` solo entra en juego
si alguna llegara a desaparecer del panel — ahí sí muestra un aviso genérico
traducido, nada más.

## Reglas al tocar el código

1. **La cabecera y el pie viven solo en `global-header` y `global-footer`.**
   Ningún `pag-*.liquid` debe volver a incluirlos.
2. **`cart.js` se carga una sola vez**, mediante `window.__nuvelArrancarCarrito()`.
   Nunca lo añadas con un `<script src>` suelto: se ejecutaría dos veces y los
   clics se duplicarían.
3. **Todo texto visible va con `{{ 'clave' | t }}`**, nunca fijo en el `.liquid`.
   `assets/cart.js` no puede usar el filtro `t` (es un asset estático), así que
   sus textos salen de `window.__NUVEL_I18N__`, definido en `global-footer.liquid`
   con claves ya traducidas — si agregas un texto nuevo ahí, pásalo por ese
   mismo objeto, no lo escribas fijo en el `.js`.
4. Los datos estructurados de una página concreta (breadcrumbs, producto) van en
   su propio archivo, nunca en el pie global.

## Pendiente

- Publicar inglés como segundo idioma en Shopify (Configuración → Idiomas) y
  activar la redirección automática por navegador/país en Configuración → Mercados
- Conectar Google Search Console / SEO ahora que las 11 páginas responden 200
