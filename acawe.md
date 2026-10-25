# TASK: Apply the NUVEL product design to the LIVE store nuvelshape.store (product page + HOME featured product)

You are a senior Shopify theme developer (Liquid, CSS, vanilla JS) working on an existing Rise-based theme.
The attached file `nuvel-producto.html` is the EXACT visual and behavioral reference. Reproduce it in the real theme (adapt to Liquid and the theme's real classes). Do not simply copy it: use the store's real product data, images, variants and cart.

## Repo and rules
- Repo: https://github.com/dejesusgonzalezalvarez-glitch/nuvelshapestore — work ONLY on branch `main` (the only branch). Do not create or delete branches.
- First create and push a safety tag `backup-before-nuvel-redesign`. Small commits, normal `git push origin main`. NEVER force-push.
- Shopify is connected to `main` through the GitHub integration. A new theme created from `main` may be UNPUBLISHED: check it and tell me.

## Current problem (what I see live)
1. https://nuvelshape.store/products/faja-moldeadora-invisible-nuvel returns a **404** in my browser (theme served by CDN path /t/26/ shows the OLD design).
2. The **featured product block on the HOME page** still shows the old design: eyebrow "FAJA MOLDEADORA INVISIBLE", size picker "Size" in the wrong order (XL, 2XL, S, M, L), "Cantidad" stepper, yellow PayPal button, outlined "Agregar al carrito", old benefits ("Resiste lavados sin perder la forma", "Tabla de tallas incluida"), link "Ver todos los detalles".
3. The old product page also had a Liquid error: `sections/main-product line 503: Could not find asset snippets/nuvel-packs.liquid`.

## STEP 1 — Fix the 404 and Liquid errors FIRST
- Verify templates/product.json (or .liquid) exists, is valid JSON and references existing sections.
- Verify sections/main-product.liquid and every snippet/asset it renders exist (create `snippets/nuvel-packs.liquid`). Run `shopify theme check` if available and fix all errors.
- Report the exact cause of the 404. If it is an Admin setting (product status not Active, product not available in the "Tienda online" sales channel, theme not published), tell me exactly what to click.

## STEP 2 — One shared buy box used in BOTH places
Create `snippets/nuvel-buybox.liquid` and render it from (a) the product page section and (b) the HOME featured-product section (find it in templates/index.json and its section file). Parameters: `product`, `compact` (true on home). Both must match the reference HTML, in this exact order:
1. Eyebrow gold uppercase: "LA COMODIDAD QUE NO SE VE"
2. Title "Faja Moldeadora Invisible — Nuvel"
3. Price "€39,90 EUR" (real variant price)
4. Shipping row ABOVE the sizes: gold truck icon + "ENVÍO GRATIS INCLUIDO" + "Envío gratis en tu pedido, sin costes de envío adicionales."
5. Label "ELIGE TU TALLA" + pills in this EXACT order: S | M | L | XL | 2XL (sort in Liquid with a fixed array, independent of Admin order). S selected by default. Selecting a size must still update variant id, price, availability and `?variant=`. Do NOT show 3XL (a 3XL variant exists; do not delete it).
6. "PACKS Y OFERTAS": EXACTLY three cards (radio, thumbnail, title+subtitle, price right):
   - "Solo una faja" — "1 unidad · Faja Moldeadora Invisible" — 39,90 €
   - "2ª unidad al 50%" — "Ahorra al llevar dos unidades" — 59,85 € (strike 79,80 €), gold badge "MÁS POPULAR", SELECTED BY DEFAULT
   - "Kit del Vestido Perfecto" — "Body con falda + bragas moldeadoras + faja" — 64,90 €. Strike price = sum of the real product prices computed in Liquid (39,90 + 59,90 + 24,90 = 124,70 €), with a theme setting to override it.
   Real products for the kit: this product + "Body Moldeador con Falda — Nuvel" (handle `womens-shapewear-dress-jumpsuit`) + "Bragas Moldeadoras Sin Costuras — Nuvel" (handle `seamless-shapewear-panties`). Use their real images for the thumbnails.
   Cart: AJAX `/cart/add.js` with `items`; solo = 1× variant; duo = 2× same variant; kit = selected-size faja + dress + panties (same size when available, documented mapping otherwise). Add line item property `_pack` = solo|duo|kit.
   Discounts cannot come from theme code: at the end give me step-by-step Shopify Admin instructions to create the automatic discounts (second unit 50% off; kit price 64,90 €). Add a theme setting "Mostrar precios de packs" to hide pack prices if discounts are not active.
7. Real Shopify dynamic checkout button styled as full-width yellow "Pagar con PayPal" ABOVE add to cart.
8. Black full-width "AÑADIR AL CARRITO · {selected pack price}" (price updates with pack).
9. White outlined "Comprar ahora" (adds the pack, goes to /checkout).
10. Hide "Cantidad" (hidden input = 1). Small "En existencias" line only from real inventory.
11. Three benefit columns (eye / person / t-shirt): "Sin costuras — invisible bajo cualquier prenda" · "Compresión suave y cómoda todo el día" · "Tejido flexible que se adapta a tu figura". REMOVE the old "Resiste lavados…" and "Tabla de tallas incluida".
12. Accordions (product page only; on the home compact version show a "Ver todos los detalles →" link instead): "Guía de tallas" (include "Disponible en tallas S a 2XL"), "Envío y devoluciones" (free shipping + free size exchange 30 days), "¿Qué hace diferente a Nuvel?" ("Diseño sin costuras con Ajuste Anclado™ pensado para no verse ni notarse.").

## STEP 3 — Product page layout
- Desktop 53% / 47% columns. Gallery on the left keeps the REAL images and thumbnails; add the white label "AJUSTE ANCLADO™ · DISEÑO SIN COSTURAS" over the main image and gold position indicators if they do not break the slider.
- DIRECTLY BELOW the gallery, inside the left column: "No era tu cuerpo. Eran las costuras." + paragraph + three gold feature columns ("Ajuste Anclado™ / Sin costuras, sin marcas", "Suave y transpirable / Comodidad todo el día", "Moldea sin oprimir / Realza tu figura") exactly as in the reference. Remove the OLD description paragraph and the OLD 4-bullet list.
- Mobile (<900px): gallery, buy box, editorial block.

## STEP 4 — Global
- Announcement bar (shows on all pages), editable in the theme editor: "La faja que no se nota ni bailando · Envío gratis · Cambio de talla gratis 30 días". Black bg, white 12px text.
- Visual style: white background, gold #8A6F4A, beige #f3ece1, dividers #e6e3de, Lora for titles, Poppins for UI, 2px radius, pill size buttons, no gradients or heavy shadows.
- New CSS only in `assets/nuvel-product.css` and JS only in `assets/nuvel-product.js`, scoped under `.nuvel-pdp`, loaded on the product template AND the home page. Add new strings to locales/es.json.
- Do NOT touch: "Así se ve puesta", "Conoce tu faja", the unboxing video, catalog, FAQ, footer. No reviews, testimonials or trust badges. No extra packs.

## STEP 5 — PROOF THAT IT IS VISIBLE (mandatory, do not skip)
After pushing to `main`:
1. State which theme id Shopify is serving (number after `/cdn/shop/t/` in the page source), whether it is published and whether it is connected to `main`.
2. Fetch https://nuvelshape.store/ and https://nuvelshape.store/products/faja-moldeadora-invisible-nuvel and show that BOTH contain: "ENVÍO GRATIS INCLUIDO", sizes S, M, L, XL, 2XL in order, the three pack names, "Pagar con PayPal" above the add-to-cart button, the new announcement text. Paste the matching lines.
3. If the live store does not show them, explain exactly why (theme not published, not connected to `main`, sync delay, cache, 404 cause) and tell me what to click in Shopify Admin. Do not claim success without this proof.

## Final answer format
1. Files changed/created (one line each). 2. Commits + push confirmation. 3. The 404 cause and fix. 4. Step-by-step Admin instructions for the automatic discounts and for publishing the theme if needed. 5. The proof from Step 5. 6. Assumptions or things you could not verify.