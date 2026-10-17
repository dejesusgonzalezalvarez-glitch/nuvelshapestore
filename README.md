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
5. **Todo enlace interno lleva `{{ request.locale.root_url }}` delante**
   (`href="{{ request.locale.root_url }}/pages/catalogo"`): sin eso, al navegar
   en `/en` cada clic devuelve al español. En `cart.js` el prefijo llega como
   `I18N.root` (definido en `global-footer.liquid` junto a `__NUVEL_I18N__`).

## Pendiente

- Pushear el tema con estos arreglos (`shopify theme push`): enlaces internos
  con prefijo de idioma, redirects de `product.liquid`/`collection.liquid`,
  checkout e índice del buscador, y las 7 reseñas de la faja ya traducidas a
  mano en `en.json` (532/532 claves — empujar sobreescribe las auto-traducciones
  del panel con texto de mejor calidad).

## Activar el inglés (prompt para Sidekick)

> Ya ejecutado: el inglés está visible en `/en`. El prompt queda aquí por si
> hay que re-verificar algo en el panel (notificaciones en inglés, avisos de
> traducciones robóticas, etc.).

Pega este prompt en el chat de Sidekick del admin de Shopify y él hace los clics:

```text
Contexto: Mi tienda Nuvel vende fajas y prendas moldeadoras. Mi mercado
principal es España (idioma español, moneda EUR), pero últimamente recibo
mucho tráfico internacional y de EE.UU. Las traducciones al inglés ya están
hechas (Translate & Adapt dice "tu tienda está lista en inglés"), pero el
idioma no es visible para los clientes porque no pertenece a ningún mercado.

Haz lo siguiente, en este orden:

1. En Configuración → Mercados, abre el mercado "Internacional" y añade el
   idioma Inglés, de forma que quede visible para los clientes. Publica el
   cambio.
2. Activa la sugerencia o redirección automática de idioma según el navegador
   del visitante: quien entre con el navegador en inglés debe ver la tienda en
   inglés (/en/) y quien entre en español, en español. España sigue siendo el
   mercado principal y el español el idioma por defecto.
3. Revisa que las notificaciones transaccionales (confirmación de pedido,
   confirmación de envío, etc.) estén traducidas al inglés. Si falta alguna,
   tradúcela manteniendo el tono cercano y honesto de la marca.
4. NO crees todavía un mercado específico para EE.UU. y NO cambies monedas ni
   precios: todo sigue en EUR por ahora.
5. NO modifiques productos, colecciones, páginas ni el código del tema.

Al terminar, confírmame:
a) Que la tienda ya responde en la URL /en/ y se ve en inglés.
b) Que el aviso "Inglés: no es visible para los clientes porque no pertenece
   a ningún mercado" ya no aparece.
c) Si encontraste traducciones automáticas con tono robótico o raro en
   productos o páginas, listámelas para revisarlas a mano.

Si algún paso no lo puedes hacer tú, dime exactamente cuál y en qué pantalla
lo encuentro.
```
