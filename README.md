# Nuvel — tema de Shopify

Tema de la tienda **Nuvel** (fajas y prendas moldeadoras).
Tienda: `31cyvt-0z.myshopify.com`

## Estructura

| Carpeta | Qué contiene |
|---|---|
| `layout/theme.liquid` | Esqueleto: cabecera global + contenido + pie global |
| `snippets/global-header.liquid` | Cabecera, menú y menú móvil |
| `snippets/global-footer.liquid` | Pie, carrito, buscador, zoom y arranque del carrito |
| `sections/pag-portada.liquid` | La portada |
| `snippets/pag-*.liquid` | El contenido de cada página interior |
| `assets/pagina-*.js` | Ese mismo contenido, para las páginas que aún no existen en Shopify |
| `templates/` | Plantillas de cada tipo de página |
| `assets/` | Estilos, JavaScript y 170 imágenes |

## Cómo se sirven las páginas

- La portada sale de `templates/index.json` → sección `pag-portada`.
- Si la página existe en Shopify (Tienda online → Páginas) con su plantilla
  `page.<nombre>`, se sirve desde el servidor. Es lo correcto y responde 200.
- Si todavía no existe, `templates/404.liquid` detecta la dirección en el
  navegador y carga el contenido desde `assets/pagina-<nombre>.js`. El visitante
  la ve bien, pero Google recibe un 404, así que esto es un puente, no el destino.

## Reglas al tocar el código

1. **La cabecera y el pie viven solo en `global-header` y `global-footer`.**
   Ningún `pag-*.liquid` debe volver a incluirlos.
2. **`cart.js` se carga una sola vez**, mediante `window.__nuvelArrancarCarrito()`.
   Nunca lo añadas con un `<script src>` suelto: se ejecutaría dos veces y los
   clics se duplicarían.
3. Si cambias un `snippets/pag-*.liquid`, **regenera su `assets/pagina-*.js`**,
   o la página servida por el puente quedará desfasada.
4. Los datos estructurados de una página concreta (breadcrumbs, producto) van en
   su propio archivo, nunca en el pie global.

## Pendiente

- Enganchar los botones de compra al checkout real de Shopify (hoy no cobra)
- Dar de alta los productos que vienen de Zendrop
- Cambiar la moneda de la tienda a EUR
- Correo de contacto real (ahora aparece `hola@nuvel.es`, que no existe)
- Crear las 11 páginas en Shopify para dejar de depender del puente
