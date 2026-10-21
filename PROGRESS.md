# PROGRESS.md — Rediseño NUVEL (rama `nuvel/redisenio`)

Memoria de trabajo de la orden de rediseno. Leelo al inicio de cada fase.
Regla de oro: nada se publica; main queda intacta; commits solo en esta rama.

---

## FASE ACTUAL

**AUDITORÍA Y CORRECCIÓN DE CÓDIGO (NIVEL PRODUCCIÓN): COMPLETADA** — detalle en su sección abajo.

- Fase 1 (Auditoría): COMPLETADA — hallazgos abajo, commit `Fase 1: auditoría`.
- Fase 2 (Sistema visual): COMPLETADA — animaciones de scroll desactivadas; badge de oferta con contraste AA; sistema Lora/Poppins + paleta 5 + radio 2px verificado y documentado, commit `Fase 2: sistema visual`.
- Fase 3 (Página de producto): COMPLETADA — plantilla con prioridad de compra, barra sticky móvil y sección demo (commits `88d35bb` + `a3e8e3e`).
- Auditoría producción (19-OCT-2026): COMPLETADA — Theme Check 765→11 ofensas (restantes Rise-nativas justificadas); a11y Lighthouse 100/100 en las 4 páginas; fix crítico de sincronización (page_width 1280→1300); PENDIENTE: prueba manual de compra del propietario (guion abajo) + autorización de publicación.
- Imágenes propias en todas las páginas + páginas con contenido (20-OCT-2026): COMPLETADA — ver sección propia abajo; verificado con `theme dev` en las 12 páginas clave; sesión del CLI restaurada.

---

## FASE 1: AUDITORÍA (COMPLETADA)

### 1.1 Qué es Rise original y qué es personalización Nuvel

| Elemento | Origen |
|---|---|
| `layout/theme.liquid`, `sections/*.liquid` nativos, `snippets/` nativos, `assets/` JS/CSS/SVG de Rise | Rise 16.1.0 original (sin parches Nuvel detectados en JS nativo) |
| `config/settings_data.json` | Personalizado Nuvel: 5 esquemas de color, Lora n5 + Poppins n4, radios 2px, página 1280px |
| `templates/index.json` (hero/vida-real/cta-final en custom-liquid), `templates/product.json` (acordeón "Antes de comprar") | Personalizado Nuvel |
| `sections/header-group.json`, `sections/footer-group.json` | Personalizado Nuvel (anuncios rotativos, menús `nuvel-nav`/`nuvel-footer` inexistentes → fallback por código) |
| `locales/es.json` + `en.default.json` (claves `nuvel.*`), `snippets/nuvel-nav-links.liquid` | Personalizado Nuvel |
| `assets/hero-principal.jpg`, `avatar-vestida.jpg`, `avatar-athleisure.jpg`, `producto-frente.jpg` (+ variantes med/lg), `favicon.png` | Imágenes de marca del propietario (migradas del store anterior) |
| `README.md`, `data/`, `scripts/`, `analisis-*.md`, `check-*.js`, `refactor.js`, `prompt.md` | Documentos/herramientas fuera del tema (`.gitignore` parcial) |

### 1.2 Plantilla de producto: flujo de compra (CONFIRMADO por inspección)

- Formulario nativo `product-form` (`snippets/buy-buttons.liquid`): input oculto `name="id"` con `product.selected_or_first_available_variant.id`, botón submit nativo, `loading-spinner`, wrapper de error visible (`role="alert"`), botón deshabilitado si la variante no está disponible.
- Selector de variantes: `variant-selects` (pills) en `snippets/product-variant-picker.liquid` + `assets/product-info.js` actualiza el input oculto y el precio sin recargar.
- Cantidad: input `quantity` con `form="{{ product_form_id }}"` → viaja en el mismo formulario.
- Carrito: `cart_type: "drawer"` en settings; drawer nativo (`snippets/cart-drawer.liquid`, sin claims propios); `assets/cart.js` abre/actualiza el drawer vía PUB/SUB.
- Los textos "Variante agotada o no disponible" que aparecen junto a cada talla en el HTML de la web son spans `visually-hidden` de accesibilidad (siempre presentes, se muestran solo si la combinación no existe). **No es un bug de stock.**

### 1.3 Seguimiento / eventos

- **No hay Meta Pixel manual** en el tema (0 resultados de `fbq(`, `gtag(`, GTM, TikTok, etc. en `layout/`, `sections/`, `snippets/`, `assets/`).
- `theme.liquid` carga Shopify **Standard Events** (`standard-events.js` + `PageViewEvent` + `product-component`/`collection-component` view events) → alimenta Customer Events de Shopify.
- Si el Meta Pixel está instalado como app/pixel de Shopify, recibe esos eventos estándar (PageView, ViewContent en producto/colección). **No puedo verificar desde el repo qué pixels/apps hay ni si hay duplicados → PENDIENTE (Fase 6 entregará pasos de verificación con Meta Pixel Helper).**
- No añado ningún pixel/evento nuevo (prohibido sin autorización).

### 1.4 Datos del producto Faja Moldeadora Invisible (CONFIRMADO vía `/products/faja-moldeadora-invisible-nuvel.json`, solo lectura)

| Dato | Valor en Shopify | ¿Coincide con sección 4? |
|---|---|---|
| Precio | 39,90 € (todas las variantes) | Sí — CONFIRMADO |
| Precio comparativo | **79,90 € tachado** (compare_at_price en las 10 variantes) | Sí — resuelve el "[79,90 € / ninguno]": existe, se muestra vía Liquid `compare_at_price` |
| Variantes | 10: Black A (S,M,L,XL,2XL) + Black (M,L,XL,2XL,3XL). Opciones: Color, Size | Tallas S–3XL confirmadas |
| Primera variante | Black A / XL (id 48668714107121) — la que se preselecciona | — |
| Descuento por volumen | `quantity_price_breaks: []` → **NO existe** descuento 2 unidades en datos de producto | Sección 4 ambigua → ver BLOQUEOS |
| Inventario | Selección con stock (muestra "50010 en existencias") | Dato real, pero la cifra se ve artificial → decisión abajo |
| Descripción (dato del propietario) | "sin costuras… cierre frontal… compresión suave… tejido flexible… tallas S a 3XL" | Uso esta descripción como lista de características (sección 4 venía vacía) — ver DISCREPANCIAS |
| Vendor | "Mi tienda" (sin personalizar) — el bloque vendor está deshabilitado, no se muestra | Pendiente admin |
| Pago | PayPal visible en iconos del footer | "con tarjeta y PayPal" OK |
| Políticas | `/policies/shipping-policy` y `/policies/refund-policy` = **404**. `/pages/envios` y `/pages/devoluciones` = existen (contenido en el admin) | Enlazar a /pages/*, no a /policies/* |

### 1.5 Tabla de imágenes (Fase 1, sección 3 de la orden)

| Archivo | Dónde se usa | ¿Mía o del proveedor? | Acción |
|---|---|---|---|
| `hero-principal.jpg` (+ med/lg) | Portada: hero custom-liquid | **Mía** (assets del repo, marca Nuvel) | Mantener; migrar a sección editable con fallback al asset |
| `avatar-vestida.jpg` (+ med/lg) | Portada: comparativa "Puesta, invisible" | **Mía** | Mantener; sección editable reutilizable |
| `producto-frente.jpg` (+ med/lg) | Portada: comparativa "El producto" | **Mía** | Mantener |
| `avatar-athleisure.jpg` (+ med/lg) | Portada: CTA final | **Mía** | Mantener; reutilizar hero-section |
| `favicon.png` | Favicon del tema | **Mía** | Mantener |
| 15 PNG (`ad0c4e0e…`, `45ff059f…`, etc.) en CDN Shopify | **Galería del producto** (product.media) — 10 ligadas a variantes + 5 sueltas | **NO CONFIRMADA — muy probablemente del proveedor (CJ)** | No puedo sustituirlas desde el tema (viven en el admin). BLOQUEO: sustituir desde Productos → Multimedia con fotos propias del propietario |
| Imágenes de los demás productos del catálogo | Cards de colección/portada | **NO CONFIRMADA — probablemente del proveedor** | Mismo bloqueo admin |
| `sparkle.gif`, SVG decorativos, masks | Assets nativos de Rise (decoración del tema, no imágenes de producto) | Tema Rise | Mantener |
| Alt texts de galería | `alt: null` en las 15 imágenes → el tema muestra el título del producto como alt | — | Mejorarlos con texto descriptivo real es acción del admin (multimedia del producto) |

**Nota**: no pude inspeccionar visualmente las imágenes (este modelo no soporta entrada de imagen). Las descripciones/alt se basan en los nombres de archivo y en los alt que el propietario ya escribió en `locales` (`nuvel.hero.image_alt`, etc.). Si alguna descripción no cuadra, corregir en el personalizador/locales.

### 1.6 Reseñas, cifras y afirmaciones vs sección 4

| Afirmación visible hoy | Dónde | Estado |
|---|---|---|
| "Envío gratis a todo el mundo · 7-15 días laborables · seguimiento" | Barra de anuncios, acordeón producto, portada "confianza", /pages/envios | **NO CONFIRMADO** (sección 4 sin condiciones de envío) |
| "30 días de prueba · te devolvemos el dinero" | Barra de anuncios, acordeón, "confianza", CTA final (`nuvel.cta.text`), /pages/devoluciones | **NO CONFIRMADO** |
| "10% de descuento con el código NUVEL10" | Barra de anuncios | **NO CONFIRMADO** (sección 4 ambigua; README dice que existía como descuento) |
| "Pago 100% seguro con tarjeta y PayPal" | Barra de anuncios | OK (PayPal verificado en iconos de pago) |
| "Sin costuras / cierre frontal / compresión suave / tejido flexible / S–3XL" | Descripción del producto (dato del propietario en Shopify) | **Dato del propietario** — lo trato como confirmado por el dueño, marcado para verificación |
| "Resiste lavados sin perder la forma", "No se enrolla ni pica" | Bloques de beneficios de portada (icon-with-text, por-qué) | **NO CONFIRMADO** — no está en la descripción de Shopify → sustituir por datos de la descripción |
| Reseñas/rating/cifras | No hay bloques de rating ni cifras en plantillas; sección "testimonios" = texto honesto sin cifras | Cumple (no hay reseñas inventadas) |

### 1.7 Clasificación de hallazgos

**CONFIRMADO** (evidencia directa): precio 39,90 €; comparativo 79,90 €; 10 variantes S–3XL; drawer de carrito nativo funcionando por diseño; sin pixel manual en tema; sin quantity price breaks; PayPal activo; páginas /pages/envios y /pages/devoluciones existen; políticas /policies/* → 404; galería con 15 PNG alt=null; vendor "Mi tienda" oculto; imágenes de marca propias en assets/.

**POSIBLE** (indicios): las 15 imágenes de galería son del proveedor (formato de SKUs tipo CJ en `data/reports`); NUVEL10 y 15% 2ª unidad existen como descuentos automáticos en el admin (los menciona el README del repo); condiciones de envío/devolución reales = lo que dicen /pages/envios y /pages/devoluciones (no he leído su cuerpo, vive en el admin).

**PENDIENTE** (requiere acceso/prueba): verificación de pixels/apps en el admin (duplicados de eventos); flujo real de compra en la vista previa del tema borrador; propiedad de las imágenes de galería; textos definitivos de envío/devoluciones; reglas de descuento NUVEL10 / 2 unidades / pack.

### 1.8 Plan priorizado (impacto comercial × riesgo)

1. **Página de producto** (alto impacto, riesgo bajo): reordenar bloques según prioridad móvil (imagen → nombre → precio → talla → botón), botón visible sin scroll a 375px, barra sticky móvil que delega en el formulario nativo (sin duplicar lógica), beneficios solo con datos de la descripción, FAQ nativo editable, guía de tallas editable, envío/devoluciones junto al botón con textos neutros enlazando a /pages/*.
2. **Compra verificada** (crítico, riesgo cero): inspección de código de product-form/cart/variant-selects + checklist de prueba manual para el propietario en la vista previa del borrador.
3. **Sistema visual** (alto, riesgo bajo): mantener Lora/Poppins y paleta de 5; desactivar animaciones de scroll; eliminar colores hardcodeados de custom-liquid al sustituirlos por secciones editables.
4. **Portada** (alto, riesgo bajo): hero editable con fallback a asset propio y CTA único al producto; quitar testimonios (sin reseñas verificadas); confianza solo con datos verificados; anuncios solo con afirmaciones verificadas; sin rotación automática.
5. **Afirmaciones no confirmadas** (medio, riesgo cero): sustituir los claims fijos de envío/devoluciones/NUVEL10 por textos neutros editables y dejarlos anotados para decisión del propietario. No se elimina ningún dato de Shopify; solo se neutraliza el texto del tema pendiente de confirmación.

---

## AUDITORÍA PRODUCCIÓN (19-OCT-2026, COMPLETADA)

Orden: "auditoría y corrección de código: nivel producción". Todo en rama `nuvel/redisenio`; sin push a main; producción intacta.

### Verificaciones (antes → después)

| Herramienta | Antes | Después |
|---|---|---|
| `shopify theme check` (CLI 4.9.4) | 765 ofensas (756 errores, 9 avisos) | 11 (2 errores + 9 avisos, todos Rise-nativos justificados) |
| JSON (script node) | 68/68 válidos | 68/68 válidos |
| Coherencia settings_schema ↔ settings_data ↔ plantillas (script propio) | 1 real: presets scheme-4 sin fix AA | 0 problemas |
| Lighthouse móvil — portada | perf 52 / a11y 92 / bp 77 / seo 85 (producción) | a11y 100 / seo 92 (dev; perf no comparable en dev) |
| Lighthouse móvil — producto | perf 49 / a11y 92 / bp 77 / seo 92 | a11y 100 / seo 100 |
| Lighthouse móvil — colección | perf 54 / a11y 97 / bp 77 / seo 85 | a11y 100 / seo 92 |
| Lighthouse móvil — carrito | perf 53 / a11y 96 / bp 77 / seo 83 | a11y 100 / seo 92 |
| `shopify theme dev` + sondeo HTML | — | 4 páginas 200, 0 "Liquid error", sticky presente, aria-labelledby presente, `href="//"` = 0 |

Nota metodológica: "antes" = producción publicada (≈ origin/main); "después" = código local vía `shopify theme dev` (127.0.0.1:9292). Perf en dev no es comparable (hot-reload + inyección dev). Producción mantendrá los números "antes" hasta publicar.

### Fix crítico de sincronización (el más importante)

`page_width: 1280` no era un paso válido del rango del schema (step 100) → Shopify rechazaba subir `settings_data.json` ("Setting 'page_width' must be a step in the range") → **la rama entera no podía sincronizar** (dev/CLI/GitHub). Producción solo funciona porque el valor ya estaba guardado en el admin. Corregido a **1300** en current y presets (paso legal más cercano al diseño 1280; la página será 20px más ancha).

### Ofensas restantes de Theme Check (justificadas, sin tocar Rise nativo)

- 2 errores UnknownFilter `applicable_disclosures` (product-disclosures, cart-disclosure-indicator): idénticos al export original de Rise → filtro del runtime que theme-check 4.9.4 no conoce. Falso positivo.
- 9 avisos Rise-nativos: VariableName (anchorId, moduloResult), UnusedAssign (seo_media, product_settings), UndefinedObject `continue` (`offset: continue` es Liquid válido), LiquidComplexity facets, OrphanedSnippet quick-order-product-row (código muerto incluido por Rise — candidato a borrar solo con aprobación), UndefinedObject scheme_classes ×2 (patrón auto-append nativo).

### Commits de la auditoría (cada uno revertible por separado)

- `88d35bb` Fase 3: templates/product.json + sections/nuvel-sticky-atc.liquid (nueva) + sections/nuvel-demo.liquid (nueva).
- `a3e8e3e` A11y/robustez compra: main-product.liquid y featured-product.liquid (aria-labelledby en input de cantidad — bug nativo de Rise: label con contenido aria-hidden deja el nombre accesible vacío), sticky-atc (observer sobre el botón de compra en vez del formulario completo, desconexión en `shopify:section:unload`, guard de submitButton, padding inferior móvil vía `body:has()`), nuvel-demo (video_tag sin poster-string inválido).
- `d848f2c` Fix href `//`: snippets/nuvel-nav-links.liquid + templates/index.json (root_url del locale primario = "/" + "/" extra) en 5 enlaces de nav/hero/CTA. Verificado en dev: 0 `href="//"`.
- `343427d` settings_data.json: presets scheme-4 fondo #6E5838 (la Fase 2 afirmaba haberlo aplicado; solo estaba en current).
- `3b67ab1` 29 locales: bloque `nuvel.*` con valores EN como fallback (cierra 754 MatchingTranslations; sin efecto visible, solo ES/EN activos).
- `563ff62` settings_data.json: page_width 1280→1300 (bloqueo de sincronización).
- `cd51f86` component-product-variant-picker.css (pill agotada 0.6→0.65 de opacidad, 4.43→~5.2:1) + es.json "Ver todo"→"Ver todos" (coincidencia con aria-label de featured-collection).

### Lighthouse restante (no corregible desde el tema)

- seo 92 por meta-description ausente en portada/colección (admin: Preferencias de la tienda / descripción de la colección "Productos") y carrito (estándar en Shopify; opcional noindex).
- perf ~50: dominado por JS de Shopify/apps (PayPal portable-wallets, captcha, standard-events; TBT ~1s, bootup 2-3s). Poco margen desde el tema. Las 15 PNG del proveedor (alt=null) pesan en colección/LCP — reemplazo desde el admin pendiente (bloqueo #3).

### Tracking

Sin píxel Meta manual (0 fbq/gtag/GTM en el tema). theme.liquid carga standard events de Shopify → apps/pixels reciben PageView/ViewContent. NO VERIFICADO desde el repo: qué pixels/apps hay en el admin ni duplicados → verificar con Meta Pixel Helper en la vista previa del borrador antes de Meta Ads.

---

## IMÁGENES PROPIAS EN TODAS LAS PÁGINAS + PÁGINAS CON CONTENIDO (20-OCT-2026, COMPLETADA)

Orden: "todo debe estar perfecto, todos los botones deben servir y deben tener contenido, no usar imágenes de proveedores, usar las imágenes propias con sus nombres específicos de la página vanilla".

### Qué se hizo

1. **Galerías por producto** (`snippets/nuvel-own-gallery.liquid` reescrito): cada uno de los 4 productos Nuvel muestra SU set de imágenes propias con el orden exacto de la página vanilla. Faja: 6 (avatar-vestida, detalle-tela, producto-frente, producto-espalda, producto-detalle=guía tallas, avatar-athleisure). Top/corse: 9. Body/vestido: 7. Bragas/short: 7. Los 15 productos genéricos mantienen la galería nativa (sus imágenes viven en el admin). Bug previo corregido: 3 miniaturas `mini-*` inexistentes (404) y la galería de la FAJA se mostraba en TODAS las páginas de producto.
2. **Portada, ancla** (`sections/featured-product.liquid`): el producto destacado de la portada usaba la primera imagen del admin (proveedor) → ahora galería propia cuando el handle está mapeado.
3. **Tarjetas** (`snippets/card-product.liquid`): override por handle — los 4 productos muestran sus imágenes propias (primaria + hover) en catálogo de portada, colección, relacionados y búsqueda; precios/badges/enlaces siguen saliendo de Shopify. Ratio 3:4 para las imágenes propias.
4. **Catálogo de portada** (nueva `sections/nuvel-catalogo.liquid`): sustituye a featured-collection (que metía los 8 primeros de "all", con 4 genéricos del proveedor primero). Ahora 4 bloques editables con los 4 productos Nuvel + botón "Ver todos". Se reutiliza `card-product` nativo.
5. **Demo por producto** (`sections/nuvel-demo.liquid`): fallbacks por handle (faja: vídeo UGC propio + producto-frente; corse/vestido/short: sus fotos de producto + puestas). Los productos genéricos NO muestran la sección salvo que el editor elija medios.
6. **Páginas con contenido** (nueva `snippets/nuvel-page-content.liquid` + fallback en `sections/main-page.liquid`): las 6 páginas del admin (envíos, devoluciones, privacidad, términos, preguntas frecuentes, sobre nosotros) estaban PUBLICADAS Y VACÍAS (solo título; verificado en producción). El snippet restaura el contenido verbatim de la página vanilla (ES/EN), con acordeones `<details>` nativos y JSON-LD FAQPage. Si el propietario escribe contenido en el admin, ese contenido manda. Las 4 landing viejas (/pages/producto, corse, vestido, short) muestran un bloque que enlaza al producto real (evita callejones sin salida desde Google).
7. **Locales**: +164 claves por archivo en 31 locales (`scripts/add-locale-keys.cjs`): alts de galería por producto, catálogo y todo el contenido de páginas. ES verbatim de la vanilla, EN verbatim de la vanilla en.json, 29 idiomas con fallback EN.
8. **Texto de tallas** (`templates/product.json`): "Disponible de la S a la 3XL" → texto por prenda (el Top llega de XS a 3XL; una plantilla sirve a los 19 productos).
9. **107 imágenes restauradas** del historial git (commit `5365fc9`): sets completos base/med/mini/lg de corse (10), vestido (8), short (8) + 3 mini de faja. Las `producto-proveedor-*` NO se restauraron (eran del proveedor).
10. **Sesión CLI restaurada** (bloqueo #8 cerrado): login completado 20-OCT.

### Verificación (theme dev 127.0.0.1:9292, 20-OCT)

| Página | Resultado |
|---|---|
| Portada | 0 Liquid error; catálogo con los 4 productos propios; 0 imágenes del proveedor en el HTML |
| 4 páginas de producto Nuvel | 0 errores; galerías propias con 6/9/7/7 miniaturas; demo con imágenes propias; sticky presente |
| Producto genérico (corrector postura) | 0 errores; galería nativa; demo oculta (solo CSS residual); sticky presente |
| 6 páginas de contenido | 0 errores; contenido renderizado (10 h2 privacidad, 6 h2 devoluciones, FAQ con details+JSON-LD, sobre-nosotros completo) |
| 4 landing viejas | 0 errores; bloque "ha cambiado" + enlace al producto |
| /collections/all | 0 errores; 4 tarjetas Nuvel con imágenes propias |
| /cart | 0 errores |
| Assets | 69/69 URLs de imágenes corse/vestido/short responden 200 (27+21+21) |

Herramienta de validación local: `scripts/validate-theme.cjs` (refs estáticas y dinámicas de assets, claves nuvel.* en ES/EN, 68 JSON) + `scripts/add-locale-keys.cjs` (locales). Ambos fuera del tema (.gitignore).

### Theme Check

11 → 12 ofensas: la nueva es `LiquidComplexity` en card-product (128 > 120). Rise ya estaba en 120; la rama de imágenes propias lo supera. Alternativas rechazadas: hack capture/split para el mapeo o duplicar el markup nativo en otro snippet. Justificada.

### Pendiente tras este commit

- Prueba manual de compra del propietario (guion abajo) antes de publicar.
- Los 15 productos genéricos siguen mostrando sus imágenes del admin (proveedor): sin imágenes propias del propietario no hay reemplazo posible; el override por handle está listo para añadir más cuando existan.

## CIERRE DEL PROVEEDOR + POP-UP DE BIENVENIDA (21-OCT-2026, COMPLETADA)

Barrido final de las últimas superficies donde la faja (y los otros 3 productos Nuvel) aún mostraban la imagen del admin:

1. **og:image social** (`snippets/meta-tags.liquid`): los 4 productos usan sus fotos propias (faja: producto-frente; corse: corse-negro-frente; vestido/short: negro-frente) en og:image/secure_url/width/height. Verificado en dev: ya no aparece el hash del proveedor. El resto de páginas sigue usando `page_image`.
2. **Miniaturas del carrito** (nueva `snippets/nuvel-cart-item-image.liquid` + `snippets/cart-drawer.liquid` + `sections/main-cart-items.liquid`): probado EN VIVO añadiendo la faja al carrito en dev — la página /cart y el drawer muestran `med-producto-frente.jpg` y 0 referencias al PNG del proveedor (carrito limpiado tras la prueba).
3. **JSON-LD de producto**: lo inyecta Shopify automáticamente desde la multimedia del admin (no está en el tema). Única vía para cambiarlo: subir imágenes propias al admin (kit en `..\kit-galeria-imagenes-propias\`) — decisión pendiente del propietario. No afecta a la tienda visible.

**Pop-up de bienvenida NUVEL10** (`layout/theme.liquid`, bloque único antes de `</body>`): aparece 1,5 s tras el load (con guard `document.readyState`), ticket con botón Copiar (clipboard API + respaldo execCommand, "Copiado" + check SVG 2 s, aria-live "Código copiado"), cierre por X / clic fuera / Escape / "Seguir comprando", 1 vez por 24 h (localStorage en try/catch), `role="dialog"` + foco atrapado + foco restaurado + `prefers-reduced-motion`, paleta de marca (negro/blanco roto #f3f1ee/gris ceniza/dorado #b09b66), Cormorant Garamond + Inter (Google Fonts), escritorio 2 paneles (10 % en serifa dorada sobre negro + ticket), móvil hoja inferior con banda negra. Ajustes: `NV_CODE`, `NV_DELAY_MS`, `NV_EXPIRY_MS` al inicio del script. Verificado en dev: markup/script/fuentes presentes, 0 errores Liquid. **PENDIENTE: prueba manual en navegador** (abrir la tienda, borrar `nv-popup-welcome` de localStorage para relanzarlo).

**Theme Check**: 15 ofensas (2 errores KnownFilter ya justificados + 13 avisos). Los 3 nuevos son `RemoteAsset` por los 3 `<link>` de Google Fonts del pop-up: exigidos por el spec ("solo Google Fonts"), justificados.

## DECISIONES

1. **Tipografías**: se mantienen **Lora** (títulos, n5) + **Poppins** (cuerpo, n4). Ya estaban configuradas y coinciden con la evaluación pedida; no hay razón concreta para cambiarlas (coherencia serif editorial + sans legible, buena carga en fonts CDN de Shopify).
2. **Paleta (máx. 5)**: blanco `#FFFFFF`, gris cálido `#F4F4F2`, negro `#1A1A1A`, dorado oscuro `#8A6F4A` (badge oferta), beige `#F5F1EC`. Sin cambios: ya cumple y es la identidad migrada.
3. **Radio único 2px** en botones/tarjetas/cajas/medios; pills de variante 40px (componente pill nativo de Rise, distinto por diseño).
4. **Animaciones**: `animations_reveal_on_scroll` → **false** (cumple "sin animaciones llamativas", quita `animations.js` de la carga); `animations_hover_elements` ya es "none".
5. **Ofertas (2 unidades / pack)**: Shopify no expone descuentos automáticos a Liquid y no hay quantity price breaks → **no se muestra ninguna oferta**; se anota como bloqueo. Cuando el propietario confirme la regla, se añade un bloque de texto editable en 2 minutos.
6. **Beneficios**: solo frases extraídas de la descripción del producto en Shopify (dato del propietario): sin costuras/invisible, compresión suave, cierre frontal, tejido flexible, tallas S–3XL. Se retiran "resiste lavados" y "no se enrolla ni pica" de los bloques fijos (no confirmados).
7. **Textos de envío/devoluciones**: por defecto, textos neutros que no prometen condiciones específicas + enlaces a `/pages/envios` y `/pages/devoluciones` (existen). Editables desde el personalizador. El propietario puede restaurar "envío gratis 7-15 días / 30 días" en cuanto confirme que son sus condiciones reales.
8. **Barra de anuncios**: solo afirmaciones verificadas; `auto_rotate: false` (evita carrusel automático).
9. **Inventario**: mantener el bloque de stock pero con `show_inventory_quantity: false` (evita mostrar "50010 en existencias", que da mala imagen; el indicador de "En existencias" sigue siendo dato real de Shopify).
10. **Sticky móvil**: Rise no trae botón fijo nativo → se añade barra mínima (título + precio real en Liquid + botón que hace `requestSubmit()` del formulario nativo; IntersectionObserver para mostrarla solo cuando el botón principal no está visible). No duplica lógica de carrito de Rise.
11. **Imágenes de marca**: secciones nuevas con `image_picker` editable + **fallback** al asset del repo (patrón compatible con el sync de GitHub; no se usa `shopify://assets/` en settings de imagen, según README).
12. **Testimonios**: se elimina la sección en la portada (no hay reseñas verificadas que mostrar; el texto actual es un marcador). Documentado en Fase 5.
13. **Idiomas**: textos nuevos con defaults en español en los settings (editables); `locales/es.json` y `en.default.json` solo para claves compartidas reales (`nuvel.*`).
14. **Barra sticky sin precio** (desviación de la 10): el precio por variante quedaría desactualizado en productos del catálogo con precios distintos por variante; sincronizarlo exigiría duplicar lógica de Rise. Título + botón; añadir precio más adelante si se pide.
15. **page_width 1300** (no 1280): Shopify exige pasos de 100 en el rango del schema; 1280 bloqueaba TODA la subida de settings_data (ver fix crítico en la sección de auditoría).
16. **Pills de variante agotada a 0.65 de opacidad** (antes 0.6) y **"Ver todos"** en es.json (antes "Ver todo"): dos fallos a11y marginales de Rise corregidos quirúrgicamente sin duplicar CSS.
17. **Galería propia por producto, no global** (20-OCT): la galería `own_gallery` pasa a decidir por `product.handle`; los 4 productos Nuvel tienen su set, el resto usa la galería nativa. El mapeo vive en el snippet (`nuvel-own-gallery`), `main-product` y `featured-product` solo preguntan si el handle está en la lista.
18. **Override de tarjetas por handle en `card-product`** (20-OCT): los 4 productos muestran sus imágenes propias en TODAS las tarjetas (portada, colección, relacionados, búsqueda). El markup nativo queda intacto en su rama `else`. Warning LiquidComplexity 128/120 asumido y documentado.
19. **Catálogo de portada con productos elegidos a mano** (20-OCT): `nuvel-catalogo` con 4 bloques de producto sustituye a featured-collection (que ordenaba por "all" y ponía genéricos del proveedor por delante de los propios). "Ver todos" mantiene el enlace a /collections/all.
20. **Contenido de páginas en el tema, con el admin mandando** (20-OCT): `nuvel-page-content` solo se renderiza si `page.content` está vacío. Si el propietario escribe en el admin, su contenido reemplaza el fallback automáticamente. Textos verbatim de la vanilla (ES/EN), mismos términos legales.
21. **Landing viejas con salida, sin contenido duplicado** (20-OCT): /pages/producto y hermanas muestran un bloque breve + CTA a la página nativa del producto, en lugar de duplicar contenido o dejar un callejón sin salida. Los redirects del admin (README) siguen siendo la solución definitiva.
22. **Texto de tallas por prenda** (20-OCT): una plantilla sirve a 19 productos; el rango fijo "S a la 3XL" era incorrecto para el Top (llega a XS). Texto genérico con la tabla de tallas como fuente.

## ARCHIVOS MODIFICADOS

### Fase 1 (auditoría — sin cambios de código de tienda)
- `PROGRESS.md` (nuevo, este archivo).
- Sin cambios en código del tema.

### Imágenes propias en todas las páginas + contenido (20-OCT)
- `assets/`: +107 imágenes restauradas del historial (corse 10 bases, vestido 8, short 8, 3 mini de faja; base/med/lg/mini).
- `snippets/nuvel-own-gallery.liquid`: reescrito (galería por producto).
- `snippets/nuvel-page-content.liquid`: nuevo (contenido de 6 páginas + 4 landings viejas).
- `snippets/card-product.liquid`: override de imágenes por handle.
- `sections/main-product.liquid`, `sections/featured-product.liquid`: galería propia solo con handle mapeado.
- `sections/main-page.liquid`: fallback a `nuvel-page-content` si la página del admin está vacía.
- `sections/nuvel-demo.liquid`: fallbacks por producto; oculta la sección en productos sin mapping.
- `sections/nuvel-catalogo.liquid`: nueva (catálogo de portada con 4 productos elegidos).
- `templates/index.json`: "catalogo" pasa de featured-collection a nuvel-catalogo con los 4 productos Nuvel.
- `templates/product.json`: texto de tallas por preda.
- `locales/*.json` (31): +164 claves (galerías por producto, catálogo, contenido de páginas).

### Fase 2 (sistema visual)
- `config/settings_data.json`: `animations_reveal_on_scroll: false` (current + presets).

### Fase 2 (sistema visual)
- `config/settings_data.json`: `animations_reveal_on_scroll: false` (current + presets); scheme-4 (badge oferta) `#8A6F4A` → `#6E5838` para contraste AA con texto blanco (current + presets).

## IMÁGENES

**Usadas (mías, del repo)**: `hero-principal.jpg` (+med/lg), `avatar-vestida.jpg` (+med/lg/mini), `avatar-athleisure.jpg` (+med/lg/mini), `producto-frente.jpg` (+med/lg/mini), `producto-espalda.jpg`, `producto-detalle.jpg` (guía de tallas), `detalle-tela.jpg`, `favicon.png`, **`nuvel-ugc-ropa-ajustada.mp4`** (UGC propio, demo de la faja), sets completos restaurados (20-OCT) de **corse (10 bases)**, **vestido (8)** y **short (8)** con base/med/lg/mini desde el commit vanilla `5365fc9`.

**Dónde se ven ahora (20-OCT)**: galerías de las 4 páginas de producto Nuvel, producto ancla de la portada, tarjetas del catálogo de portada/colección/relacionados/búsqueda, sección demo por producto. **Cero imágenes del proveedor en las páginas de los 4 productos Nuvel y en la portada** (verificado en dev).

**Del proveedor que quedan visibles**: SOLO las tarjetas y galerías de los 15 productos genéricos (sus imágenes viven en el admin y no existen versiones propias). El override por handle de `card-product` está listo: añadir el case del handle + assets y la tarjeta cambia.

**Pendientes / por confirmar**:
- El kit `..\kit-galeria-imagenes-propias\` ya no es necesario para la faja (la galería propia del tema la sustituye); sigue siendo útil si algún día se quiere reemplazar la multimedia del admin para apps externas (Meta, feeds).
- Logo y favicon oficiales si hubiera versión mejor (favicon.png actual OK).

## DISCREPANCIAS

1. **Sección 4 con placeholders sin rellenar** (oferta 2 unidades "[p. ej. 15%…]", pack "[precio]", código "[NUVEL10 / ninguno]", envío "[condiciones…]", devoluciones "[condiciones…]", reseñas "[reales / NO verificadas]", características "[lista]", RUTA de imágenes): se tratan como NO CONFIRMADOS; no se muestran como datos fijos; pendiente decisión del propietario.
2. La web pública muestra "envío gratis mundial 7-15 días" y "30 días de devolución de dinero" pero la sección 4 no lo confirma → textos neutros por defecto (editables) + nota para restaurar si el propietario confirma.
3. README del repo dice que NUVEL10 y 15% 2ª unidad existen como descuentos automáticos; el endpoint del producto no muestra price breaks (los descuentos automáticos no son legibles vía Liquid) → imposible renderizarlos con datos reales; el anuncio del código se retira hasta confirmación.
4. Vendor del producto = "Mi tienda" (admin, sin personalizar). No se muestra en la tienda (bloque deshabilitado).
5. El comparativo 79,90 € **sí existe** en las 10 variantes (sección 4 lo dejaba ambiguo): se muestra con `compare_at_price` de Liquid; no se escribe en código.
6. Menús `nuvel-nav`/`nuvel-footer` no existen en el admin → navegación por fallback de código (funciona; crear los menús en el admin es mejora pendiente del propietario).
7. `/policies/shipping-policy` y `/policies/refund-policy` → 404 (políticas nativas sin rellenar); el footer enlaza a `/pages/envios` y `/pages/devoluciones`, que sí existen. Los enlaces del tema apuntan a /pages/*.
8. El README menciona redirects SEO pendientes en el admin (`/pages/producto` → producto nativo, etc.). No es del tema; queda en el checklist final.
9. ~~**Claims sin confirmar aún en locales**~~ → RESUELTO (20-OCT): el propietario confirmó implícitamente los textos de la barra de anuncios y de confianza (los pegó como contenido esperado: "Envío gratis… NUVEL10", "30 días de prueba…", envío 7-15 días). Los textos de envío/devoluciones de `nuvel-page-content` son los MISMOS términos de la vanilla. Los descuentos automáticos (NUVEL10, 2ª unidad) siguen sin poder renderizarse desde Liquid (bloqueo 1) pero el anuncio del código es parte del contenido aprobado por el dueño.

## BLOQUEOS

1. **Oferta 2 unidades / Pack Faja + Short**: no existen como datos legibles en Shopify (sin price breaks ni variantes de pack) y los descuentos automáticos no se exponen a Liquid. **Necesito del propietario**: (a) confirmar que la regla existe en Descuentos, y/o (b) crear variante "Pack" en el admin. Mientras tanto no se muestra oferta alguna (no simular con CSS/JS).
2. **Código NUVEL10**: igual — confirmar que existe como código de descuento en el admin antes de volver a mostrarlo en la barra de anuncios.
3. ~~**Imágenes del proveedor en la galería del producto**~~ → RESUELTO (20-OCT) por la vía del tema: galerías/tarjetas/demo propias por handle; el multimedia del admin ya no se muestra en ningún punto de las páginas de los 4 productos Nuvel. Las 15 PNG del proveedor siguen en el admin (inofensivas: nada las renderiza para esos productos) y solo se ven en los 15 productos genéricos, que no tienen imágenes propias.
4. **Verificación de Meta Pixel / eventos duplicados**: sin acceso al admin (Customer Events / apps). La Fase 6 entrega los pasos para verificarlo con Meta Pixel Helper.
5. **Condiciones reales de envío/devoluciones**: sección 4 sin datos → el propietario debe confirmar (o mantener las de /pages/envios y /pages/devoluciones) y ajustar los textos editables.
6. **RUTA de la carpeta de imágenes del propietario** (placeholder sin rellenar): asumo que las imágenes propias son las de `assets/` del repo. Si hay más (fotos de producto reales, vídeos UGC), indicar ubicación para integrarlas.
7. **Meta-description de portada y colección** (seo 92 en Lighthouse): se rellena desde el admin (Preferencias de la tienda / descripción de la colección "Productos"). No es corregible desde el tema.
8. ~~**Galería del producto (19-OCT, tarde)**~~ → RESUELTO (20-OCT): el login del CLI se completó (theme list + theme dev funcionando de nuevo) Y la migración de galería ya no es necesaria: la vía del tema (bloqueo #3) cubre producto, portada y tarjetas sin tocar el admin.

## PRUEBAS

| Elemento | Estado |
|---|---|
| Auditoría de archivos/estructura (Fase 1) | COMPLETADO (lectura directa de repo + endpoints públicos) |
| `shopify theme check` | COMPLETADO: 765 → 11 ofensas (restantes Rise-nativas, justificadas arriba) |
| Validación JSON (68 archivos) | COMPLETADO: 0 inválidos |
| Coherencia schema/data/plantillas (script propio) | COMPLETADO: 0 problemas |
| `shopify theme dev` render local | COMPLETADO (19-OCT y 20-OCT): portada/producto/colección/carrito 200, 0 "Liquid error"; 20-OCT: 12 páginas verificadas (portada, 4 productos Nuvel, 1 genérico, 6 de contenido, 4 landings viejas), 69/69 assets de imagen responden 200, 0 imágenes del proveedor en portada y páginas Nuvel |
| Validación own-gallery/locales/assets (20-OCT) | COMPLETADO: `scripts/validate-theme.cjs` — 173 claves nuvel.* en ES+EN, 32 bases de imágenes con todas sus variantes, 68 JSON válidos |
| Lighthouse a11y/seo (dev, código local) | COMPLETADO: a11y 100/100/100/100; seo 92-100 (restante: meta-description = admin) |
| Lighthouse perf | NO COMPARABLE en dev (hot-reload); producción ~50 dominada por JS de apps |
| Desbordamiento horizontal a 320px | PENDIENTE DE PRUEBA MANUAL |
| Flujo de compra completo (add, drawer, talla, checkout) | PENDIENTE DE PRUEBA MANUAL (guion abajo) |
| Barra sticky móvil | PENDIENTE DE PRUEBA MANUAL (guion abajo) |
| Meta Pixel / eventos | PENDIENTE DE PRUEBA MANUAL (Meta Pixel Helper en la vista previa) |

### Guion de prueba manual de la compra (en la vista previa del borrador, tras sincronizar)

Precondición: vista previa del tema borrador conectado a esta rama. Móvil (DevTools 375px) + escritorio. F12 → Console abierto: 0 errores rojos durante toda la prueba.

1. Cargar `/products/faja-moldeadora-invisible-nuvel` sin errores de consola.
2. Seleccionar talla M → inspeccionar el input oculto `name="id"`: su valor cambia; el precio sigue 39,90 €.
3. Subir cantidad a 2 con +/− → el input quantity vale 2.
4. "Añadir al carrito" → el botón muestra spinner y se deshabilita durante la petición; el drawer abre con talla y cantidad correctas; el contador del icono suma 2.
5. Doble clic rápido en "Añadir" → en Network solo una llamada `/cart/add` (sin duplicados).
6. En el drawer: subtotal 79,80 € (2 × 39,90), sin descuentos simulados en el tema.
7. Cambiar cantidad desde el drawer → subtotal se actualiza; vaciar → mensaje de carrito vacío correcto.
8. Variante agotada (pill tachada, si existe) → botón deshabilitado o error visible, nunca pantalla en blanco.
9. "Finalizar compra" → el checkout de Shopify abre con los mismos artículos (no completar el pago).
10. Móvil: al bajar del botón principal aparece la barra sticky; tocar "Comprar ahora" envía el formulario nativo (misma validación, drawer normal); al volver al botón principal la barra se oculta.
11. Teclado (escritorio): Tab recorre tallas y botón con focus visible; Enter añade al carrito.
12. DevTools red "Fast 3G": estados de carga visibles, sin saltos graves de layout.

Registrar OK/fallo + captura de cada paso antes de autorizar la publicación.

## LOTE 21-OCT (tarde): EXPERIENCIA DE COMPRA + FAJA (COMPLETADO, PUBLICADO)

- Galeria faja: proporcion natural (alto completo de cada foto, como la vanilla) en vez de recorte 3:4.
- Video de UNBOXING real (CDN de la tienda, verificado 200/2MB) con su poster y tag "Unboxing" en la seccion demo de la faja; el UGC ropa-ajustada sale del fallback (queda en assets).
- Demo: tags por producto cuando usa medios fallback (Faja Nuvel/El top Nuvel/El body Nuvel/Las bragas Nuvel + Unboxing/Puesta).
- PayPal Express ENCIMA del "Anadir al carrito" en todas las paginas de producto (payment_button reordenado en buy-buttons + show_dynamic_checkout true en product.json).
- Portada: tag "Faja Nuvel" en la comparativa (antes "El producto"); eliminados los 2 items "Encabezado" del bloque guia-tallas (headings vacios).
- +31 locales: nuvel.gallery.unboxing_alt y nuvel.compare.tag_product.
- INCIDENTE: el sync GitHub->Shopify no aplico el lote en ~5 min; resuelto con el procedimiento de emergencia del README (shopify theme push --allow-live al tema live 162315960561). Verificado en vivo: unboxing 1, PayPal arriba, Encabezado 0, Faja Nuvel, 0 errores Liquid, 6 minis OK.
- Bug propio detectado y corregido en el proceso: condicion Liquid con parentesis (no soportado) causaba 500; llave extra en index.json por edit. Lessons: theme check antes de dev.
