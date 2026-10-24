Haz una serie de cambios en la tienda Nuvel (tema Shopify "Rise" personalizado). Al terminar, haz commit y push a GitHub. Sigue los pasos en orden, no des nada por hecho y verifica cada cosa.

## 0. Destino y reglas del proyecto (obligatorio)
- Repositorio: https://github.com/dejesusgonzalezalvarez-glitch/nuvelshapestore (rama main). Antes de empezar ejecuta `git remote -v` y `git status`, y confirma que origin es ese repo. Si no lo es, para y avísame. Haz `git pull` antes de editar.
- El tema publicado de Shopify ("nuvelshapestore/main", ID 162315960561) lee la rama main. La integración GitHub→Shopify ya falló alguna vez: tras tu push, comprueba la tienda en vivo (paso 11).
- Lee el README.md del repo antes de tocar nada. Reglas clave: las imágenes de marca van en assets/ y se cargan con {{ 'archivo.jpg' | asset_url }} (NUNCA shopify://assets/ en settings de imagen); config/settings_data.json debe llevar siempre "current" y "presets"; los textos del tema van por {{ 'clave' | t }} desde locales/ con claves propias bajo nuvel.* en es.json y en.default.json (y labels de schema en es.schema.json / en.default.schema.json).
- No subas contraseñas, tokens, claves de API ni archivos .env.
- No toques precios de los productos, el código NUVEL10, el pop-up, el checkout, ni textos de marca que no te pida cambiar. No deshagas arreglos ya hechos: miniaturas cuadradas, sin salto de scroll al pulsar "siguiente", sin selector "Black A", selectores de país/idioma en una línea.

## 1. Imágenes que tienes que usar
Están en mi PC, en la carpeta: C:\Users\Gilmer De Jesús\Desktop\Pics para nuvel
- Diseñado_para_adaptarse_a_ti.png (infografía técnica 1: "Diseñada para adaptarse a ti")
- Silueta_uniforme__estilo_impecable.png (infografía técnica 2: "Tu look. Una silueta más uniforme.")
- Adaptive_Comfort_Shapewear_Bodysuit.png (infografía técnica 3: "Comodidad que se adapta a tu ritmo")
- Retrato_de_estudio_en_traje_negro.png (modelo sobre fondo blanco con la faja puesta; es la imagen para el efecto hover)
Si no encuentras esos archivos, busca por esos nombres en la carpeta y dime qué encontraste. Si no aparecen, para y dime dónde buscaste. No uses otras imágenes en su lugar.

Cópialas a assets/ con nombres sin tildes ni espacios y optimízalas (JPG calidad 85, máximo 1200px de ancho, objetivo menos de 350 KB cada una; sin cambiar la proporción):
- tecnica-1-disenada-para-adaptarse.jpg
- tecnica-2-silueta-uniforme.jpg
- tecnica-3-comodidad-ritmo.jpg
- modelo-estudio-hover.jpg

Localiza también la imagen de la GUÍA DE TALLAS que ya existe en el tema (la que tiene un bloque beige con "Nuvel" y una tabla en cm; en la página aparece con alt "Guía de tallas de la Faja Moldeadora Invisible Nuvel"). Dime su nombre de archivo. Si hay una versión grande y otra miniatura, usa la grande.

## 2. Carrusel de la Faja Moldeadora Invisible (página de producto y producto destacado de la home)
El carrusel debe tener EXACTAMENTE estas 5 imágenes, en este orden:
1. Silueta gris de la faja, frente.
2. Silueta gris de la faja, espalda.
3. Foto de la chica con vestido beige (selfie en el espejo), con la faja puesta.
4. Foto de la chica con top y short negros (selfie), con la faja puesta.
5. La imagen de la guía de tallas.
- La primera imagen que se ve al cargar la página tiene que ser la silueta de la faja (la 1).
- Las 3 infografías técnicas NO deben aparecer en el carrusel, ni en las miniaturas ni en la galería principal.
- No borres archivos de assets/, solo cámbialos de sitio. No añadas ninguna otra foto al carrusel.
- Aplica el mismo cambio en todos los sitios donde se use esa galería (producto y home). Mantén las miniaturas cuadradas y sin saltos de scroll.

## 3. Sección técnica debajo del carrusel
Crea una sección nueva justo debajo de la galería (misma columna que la galería en escritorio; a todo el ancho en móvil). Sustituye por ella la sección "Cómo funciona" anterior (las tecnica-1..4.jpg que daban imagen rota). Si encuentras otra sección técnica distinta, dímelo.
Estructura: un título de sección y después 4 bloques apilados en una columna. Cada bloque lleva ARRIBA de la imagen un título y una línea de texto, y debajo la imagen:
- Título de sección: "Conoce tu faja" / EN: "Get to know your shapewear"
- Bloque 1 (tecnica-1-disenada-para-adaptarse.jpg): "Diseñada para adaptarse a ti" / "Copas con forma definida, tirantes ajustables y diseño de una sola pieza, con un acabado negro elegante." EN: "Designed to fit you" / "Shaped cups, adjustable straps and a one-piece design with an elegant black finish."
- Bloque 2 (tecnica-2-silueta-uniforme.jpg): "Una silueta más uniforme" / "Pensada para llevar bajo tu ropa, con compresión suave y tejido flexible." EN: "A smoother silhouette" / "Made to wear under your clothes, with gentle compression and flexible fabric."
- Bloque 3 (tecnica-3-comodidad-ritmo.jpg): "Comodidad que se adapta a tu ritmo" / "Tirantes regulables para un ajuste personalizado, tejido que te acompaña en cada movimiento y compresión suave, sin exceso de presión." EN: "Comfort that moves with you" / "Adjustable straps for a personalised fit, fabric that moves with you and gentle compression without excess pressure."
- Bloque 4 (guía de tallas): "Encuentra tu talla" / "Consulta la guía antes de pedir." EN: "Find your size" / "Check the size guide before you order."
Reglas: usa SOLO estos textos, no inventes datos, porcentajes ni claims. Título en Lora y texto en Poppins (tipografías del tema), colores y espaciados de la marca (negro #1A1A1A, blanco roto, mucho aire). Imágenes con width y height reales, loading="lazy", alt descriptivo, sin recortarlas (se debe leer el texto de las infografías). Textos por locales (nuvel.tecnica.*) en es.json y en.default.json.

## 4. Quitar la talla 3XL
- Que el botón/opción "3XL" no aparezca ni se vea (ni tachado, ni deshabilitado) en el selector de tallas de la página de producto, del producto destacado de la home ni en ningún quick-add. Hazlo en Liquid filtrando ese valor de opción (no solo con CSS). Comprueba que la variante preseleccionada nunca sea 3XL y que talla, precio y botón de compra siguen funcionando.
- Dime qué debo hacer yo en el admin de Shopify: la forma limpia es eliminar la variante 3XL (Productos → Faja Moldeadora Invisible → variantes), porque ocultarla solo en el tema deja la variante accesible por URL.

## 5. Efecto hover con la foto de la modelo en las tarjetas de producto
En TODAS las tarjetas de producto donde aparezca la Faja Moldeadora Invisible (handle faja-moldeadora-invisible-nuvel): catálogo de la home, /collections/all, búsqueda, recomendaciones, etc.:
- Imagen por defecto: la foto de la faja sola sobre fondo blanco (la que sale ahora en escritorio). Hoy en móvil la tarjeta a veces muestra la selfie de la chica: averigua por qué (¿imagen secundaria al tocar?) y que por defecto nunca salga esa selfie.
- Al pasar el ratón (solo en dispositivos con hover, @media (hover: hover)): se carga con transición suave (opacidad, 0.3s) assets/modelo-estudio-hover.jpg. Precárgala o carga la imagen con lazy para que no parpadee. La imagen es vertical: ajusta object-fit/object-position (por ejemplo cover con object-position center 15%) para que no se corte la cara.
- Impleméntalo en el tema desde el repo (por ejemplo con una condición por product.handle sobre la imagen de assets, si no se puede ordenar desde los medios del producto). Dime si además recomiendas subir la imagen a los medios del producto en el admin.
- El resto de productos no cambian.

## 6. Bloque final de la portada y footer
- En la portada, el bloque final con el eslogan "Sin aros. Sin costuras. Sin que se note nada." tiene como fondo la foto de la chica (selfie con el móvil). QUITA esa imagen de fondo y su capa oscura (no borres el archivo de assets). Mantén el texto y el botón "Ver el catálogo", con fondo sólido beige #F5F1EC, texto #1A1A1A y botón negro con texto blanco.
- Al FINAL del footer (debajo de todo, incluida la fila de copyright/legal) añade el nombre de la marca "NUVEL" en grande: Lora, mayúsculas, centrado, color blanco roto #F4F4F2 sobre el fondo negro del footer, tamaño aproximado clamp(64px, 18vw, 280px), letter-spacing amplio y line-height ajustado. Debe verse entero en una sola línea a 1440px y a 390px, sin scroll horizontal. Añádelo editable desde el footer-group.json o como sección propia al final del grupo, sin traducir (es marca).

## 7. Botón "Más opciones de pago"
- Quita el enlace/botón "Más opciones de pago" del bloque de compra (página de producto, producto destacado de la home y páginas de los packs del paso 8). Debe quedar SOLO el botón "Pagar con PayPal" y "Agregar al carrito".
- Hazlo ocultando el elemento de más opciones (por ejemplo .shopify-payment-button__more-options con display:none) y no desactivando el botón de PayPal. Si al quitarlo desaparece también PayPal, dímelo antes de cambiar nada más.

## 8. Packs (bundles) con precio rebajado
Voy a crear dos packs en el admin de Shopify con la app Shopify Bundles. Tu trabajo es SOLO la parte del tema: mostrarlos. No intentes crear productos ni tocar precios desde el código.

Los packs serán productos de Shopify con estos handles (si todavía no existen, el tema no debe romperse ni mostrar títulos vacíos):
- pack-completo-nuvel: "Pack Completo — Nuvel" = Faja Moldeadora Invisible + Body Moldeador con Falda + Bragas Moldeadoras Sin Costuras. Precio del pack 99,90 €, precio de referencia (compare_at_price) 124,70 €, ahorro 24,80 €.
- pack-duo-fajas-nuvel: "Pack Dúo de Fajas — Nuvel" = 2 Fajas Moldeadoras Invisibles. Precio del pack 64,90 €, precio de referencia 79,80 €, ahorro 14,90 €.
Esas cifras son solo para que compruebes el resultado. NO las escribas en el código: lee siempre price y compare_at_price del producto en Liquid.

Haz esto:
1. Crea un snippet reutilizable (por ejemplo snippets/nuvel-packs.liquid) que, para cada handle anterior, si el producto existe y está publicado, muestre una tarjeta con: imagen destacada del pack, nombre, una línea con lo que incluye, el precio del pack, el precio de referencia tachado y un texto "Ahorras X €" calculado como compare_at_price - price (solo si compare_at_price > price), y un botón "Ver pack" que lleva a la página del pack. Si ningún pack existe, no pintes nada.
2. Muestra ese snippet en dos sitios: (a) en la página de producto de la Faja Moldeadora Invisible y en el producto destacado de la home, justo debajo de los botones de compra y encima del acordeón, con el título "Ahorra con un pack" / EN: "Save with a bundle"; (b) en la home, como sección propia debajo de "Nuestro catálogo", con el mismo título y las dos tarjetas.
3. Textos por locales (nuvel.packs.*) en es.json y en.default.json: "Ahorra con un pack", "Ver pack", "Ahorras {{ amount }}", "Incluye: faja + body con falda + bragas moldeadoras", "Incluye: 2 fajas moldeadoras invisibles" y sus traducciones al inglés.
4. Diseño de la marca: negro #1A1A1A, blanco roto, Lora en títulos y Poppins en texto; ahorro en el dorado oscuro #8A6F4A del tema; tarjetas con radio de 2px, 2 columnas en escritorio y 1 en móvil. Imagen con width y height reales y loading lazy.
5. La página del pack usa la plantilla de producto nativa: aplica también ahí el ocultar "Más opciones de pago". Comprueba que en esa página no aparece la talla 3XL.
6. No cambies los descuentos automáticos ni NUVEL10. Dime, si puedes verlo, si el código de descuento o el descuento "15% en la 2ª unidad" se pueden acumular con los packs (para decidir yo si los excluyo en el admin).
7. Comprueba tu snippet con un producto de prueba temporal o con datos simulados si los packs aún no existen, y elimina lo temporal después. Si no puedes probarlo con datos reales, dímelo claramente.

## 9. Qué no debe romperse (comprobación de regresión)
Miniaturas cuadradas (72px escritorio, 56px móvil) sin deformarse; al pulsar "siguiente" el window.scrollY no cambia; sin selector de color "Black A"; sin "Agotado" falso; los selectores de país e idioma siguen en una línea; sin scroll horizontal en móvil; sin imágenes rotas en /, /products/faja-moldeadora-invisible-nuvel y /collections/all.

## 10. Verificación obligatoria (no digas "listo" sin esto)
1. Abre la página en un navegador headless (Playwright o Puppeteer) a 1440px y a 390px. Guarda capturas de: carrusel (las 5 imágenes), sección técnica, tarjeta de catálogo normal y en hover, bloque final + footer con NUVEL, bloque de compra, y el bloque de packs (si los packs existen).
2. Mide con getBoundingClientRect(): miniaturas cuadradas, window.scrollY antes/después de pulsar "siguiente" 5 veces, y que el texto "NUVEL" no desborda. Enséñame la tabla.
3. Comprueba que en el HTML renderizado no aparece "3XL", "Más opciones de pago" ni las 3 infografías dentro de la galería.
4. Si no puedes abrir un navegador, dímelo claramente en lugar de darlo por hecho.

## 11. Commit, push y publicación
- Commits pequeños con mensajes claros en español (por ejemplo "Galería: nuevo orden y tabla de tallas", "Sección técnica con infografías", "Hover con modelo en tarjetas", "Footer: NUVEL grande y sin foto en bloque final", "Quitar 3XL y más opciones de pago", "Packs: bloque y sección en home").
- Haz push a main, y muéstrame `git log origin/main -5`.
- Espera 2 minutos y repite las comprobaciones en la tienda en vivo (https://nuvelshape.store/ y /products/faja-moldeadora-invisible-nuvel).
- Si la tienda no cambia tras el push, dime qué mirar en Shopify (Temas > menú ⋯ > Ver registros) con los clics exactos. NO fuerces con shopify theme push --allow-live sin avisarme antes y sin comparar el tema publicado con el repo, para no pisar cambios hechos desde el admin.

## 12. Entrega
Explícamelo en palabras simples, sin jerga: qué cambiaste, qué archivos tocaste, cómo se revierte, qué debo hacer yo en el admin de Shopify (eliminar la variante 3XL, crear los dos packs) y qué no pudiste verificar.