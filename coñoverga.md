ROLE
You are a senior Shopify theme developer (Liquid, CSS, vanilla JS) and careful Git operator. You will MODIFY an existing live Shopify store built on the Rise theme, deliver the result as commits on `main`, and then clean up the repository so that `main` is the only branch. Do not rebuild the theme and do not touch files unrelated to the product page.

STORE AND REPO
- Live product page: https://nuvelshape.store/products/faja-moldeadora-invisible-nuvel
- Repo: https://github.com/dejesusgonzalezalvarez-glitch/nuvelshapestore
- Target branch: `main` (https://github.com/dejesusgonzalezalvarez-glitch/nuvelshapestore/tree/main). ALL work is committed and pushed to `main`. Ignore any previous mention of a branch called CHUPALO-MADURO as a work branch.
- Brand: NUVEL, premium discreet shapewear for women in Spain. Store language: Spanish (es), currency EUR.

GIT WORKFLOW (follow in this exact order)
IF YOU HAVE REPO ACCESS:
1. `git fetch --all --prune` and list ALL remote branches with their last commit (`git branch -r -v`). Report the list.
2. Check whether the remote branches contain commits that are NOT in `main` (`git log main..origin/<branch> --oneline`). Report them. If a branch has unique commits that look like real work (not just the product-page work being replaced), ask me before merging; if the branch is clearly the old working copy of this same product page, its content will be superseded by this task.
3. Create a safety tag on `main` BEFORE editing: `backup-main-before-product-redesign`, and push the tag.
4. Work on `main`. Small, descriptive commits. Push with a normal `git push origin main`. NEVER force-push `main` and never rewrite its history.
5. After the product-page work is pushed and the checklist (section I) passes, CLEAN UP BRANCHES:
   a) For EVERY remote branch other than `main`, first create and push an archive tag pointing at its tip: `git tag archive/<branch-name> origin/<branch-name>` then `git push origin archive/<branch-name>`. This keeps every commit recoverable.
   b) Then delete each remote branch other than `main`: `git push origin --delete <branch-name>`. Delete the matching local branches too. Never delete `main`.
   c) Make sure `main` is the repository's default branch (GitHub Settings → Branches → Default branch). If you cannot change it via the API/CLI, tell me exactly where to click.
   d) Run `git remote prune origin` and show the final `git branch -a` proving only `main` remains (plus the archive/* and backup tags).
   If a branch is protected or deletion is refused, do NOT work around it by force; report it and tell me what to change in the repo settings.
IF YOU DO NOT HAVE REPO ACCESS:
Output each changed or new file in FULL (never "...rest unchanged"), preceded by its exact path, plus the complete ordered list of git commands (backup tag, commit, push to main, archive tags, branch deletions, prune) so I can run them myself.

SHOPIFY CONNECTION WARNING (must be handled)
The Shopify store may be linked to the theme through the Shopify GitHub integration on a specific branch (possibly one of the branches about to be deleted). Before deleting any branch, tell me which branch the live/preview theme is connected to (Shopify Admin → Online Store → Themes → the theme's "GitHub" connection). If a theme is connected to a branch that will be deleted, I must first reconnect it to `main`, otherwise the theme will be disconnected. Include these reconnect instructions in your final answer. Also remind me that pushing to `main` may publish changes to the live store if the live theme is connected to `main`, so the changes should first be verified on a preview/duplicate theme if possible.

CURRENT STATE OF THE PAGE (from screenshots of the live site)
- Announcement bar (carousel with arrows): "Envio gratis a todo el mundo · 10% de descuento con el código NUVEL10".
- Header: "Nuvel" wordmark (serif), nav: Inicio, Producto Destacado, Catálogo, Sobre nosotros, Preguntas frecuentes; right: "ES | EUR", language selector "ES", search, account, cart icons.
- Product gallery: vertical thumbnails on the left (1 black bodysuit front, 2 grey back, 3 and 4 woman wearing it, 5 size guide) with the main image and prev/next arrows. Below the gallery there is a large EMPTY area on the left while the right column keeps going.
- Right column: title "Faja Moldeadora Invisible — Nuvel", "€39,90 EUR", variant picker labelled "Size" with the WRONG ORDER (XL selected, 2XL, S, M, L), then a visible LIQUID ERROR: "Liquid error (sections/main-product line 503): Could not find asset snippets/nuvel-packs.liquid", then a "Cantidad" quantity stepper, yellow PayPal button "Pagar con PayPal", an outlined "Agregar al carrito" button, "En existencias", three icon benefits (eye, person, t-shirt), two accordions (Guía de tallas, Envío y devoluciones), then the old description paragraph + 4 bullets (one says "Disponible en tallas S a 3XL").
- Below: section "Así se ve puesta" (product image tagged "FAJA NUVEL" and an "UNBOXING" video) and section "Conoce tu faja" with two infographic images. KEEP these sections and all existing real images/videos untouched.

WHAT MUST BE DONE (all of it)

A) FIX THE BUG FIRST
- Open sections/main-product.liquid around line 503 and find the `{% render 'nuvel-packs' %}` (or include). Create `snippets/nuvel-packs.liquid` so the error disappears. This snippet contains the pack/offer selector described in section F. Verify no other Liquid errors appear anywhere on the page.

B) ANNOUNCEMENT BAR
- Replace the text with: "La faja que no se nota ni bailando · Envío gratis · Cambio de talla gratis 30 días". Black background, white 12px text. Keep it editable through the theme editor (announcement bar block/setting) instead of hardcoding if the theme supports it.

C) LAYOUT: TWO COLUMNS, 53% / 47%
- Desktop: left column ≈ 53%, right column ≈ 47%, max content width ~1200px, gap ~48px. Below 900px: one column, order = gallery, editorial description, purchase info is NOT allowed; use this order instead: gallery, purchase info, editorial description.
- The left column contains: the gallery and, DIRECTLY BELOW the gallery/carousel, the editorial block (section E). This fills the empty space under the gallery on desktop.

D) GALLERY (left column)
- Keep the real product media and the existing thumbnails strip + arrows (do not replace images). Add:
  - A small white label near the bottom of the main image: "AJUSTE ANCLADO™ · DISEÑO SIN COSTURAS" (11px, letter-spacing, black text, 2px radius).
  - Thin position indicators under the main image (active = gold #8A6F4A), only if they do not break the theme's slider. Arrows are white circles.
- Do not alter the photos.

E) EDITORIAL DESCRIPTION — RIGHT UNDER THE GALLERY, INSIDE THE LEFT COLUMN
Headline (Lora serif, ~26px): "No era tu cuerpo. Eran las costuras."
Paragraph (gray): "La faja moldeadora invisible Nuvel está diseñada para desaparecer bajo tu ropa y acompañarte con un ajuste cómodo. Su diseño sin costuras y su tejido flexible están pensados para que te muevas con confianza durante todo el día."
Then three columns, gold bold title + gray subtitle, with fine-line gold icons:
- "Ajuste Anclado™" / "Sin costuras, sin marcas"
- "Suave y transpirable" / "Comodidad todo el día"
- "Moldea sin oprimir" / "Realza tu figura"
Make the texts editable (section blocks/settings). Remove the OLD description paragraph and the OLD 4-bullet list from the right column. Move "Disponible en tallas S a 2XL" into the "Guía de tallas" accordion (the old text said 3XL; the real sizes are S to 2XL).

F) RIGHT COLUMN — STRICT VERTICAL ORDER
1. Eyebrow, small uppercase gold (#8A6F4A), letter-spaced: "LA COMODIDAD QUE NO SE VE"
2. Title (Lora): "Faja Moldeadora Invisible — Nuvel"
3. Price: "€39,90 EUR" (always the real variant price from Liquid `money`).
4. SHIPPING ROW, ABOVE THE SIZE SELECTOR, thin top and bottom dividers: gold delivery-truck SVG icon + bold uppercase "ENVÍO GRATIS INCLUIDO" + small gray text "Envío gratis en tu pedido, sin costes de envío adicionales."
5. SIZE SELECTOR: label "ELIGE TU TALLA" (replace "Size"). One horizontal row of pill buttons in this EXACT order: S | M | L | XL | 2XL. Selected = black background / white text; others = white / thin warm-gray border. S selected by default (or the first available size). Implement the order in Liquid (sort option values by the fixed array ["S","M","L","XL","2XL"], independent of how variants are stored in Admin) and make sure selecting a size still updates the real variant (variant id, price, availability, URL `?variant=`). Sold-out sizes: disabled with a diagonal strike, never hidden.
6. "PACKS Y OFERTAS": label + EXACTLY THREE stacked horizontal radio cards (rendered by snippets/nuvel-packs.liquid):
   - "Solo una faja" — "1 unidad · Faja Moldeadora Invisible" — "39,90 €" — no compare-at price, no badge. Thumbnail: one black bodysuit.
   - "2ª unidad al 50%" — "Ahorra al llevar dos unidades" — "59,85 €" with smaller strikethrough "79,80 €" — gold badge "MÁS POPULAR" on the top-right edge. Thumbnail: two identical black bodysuits. SELECTED BY DEFAULT.
   - "Kit del Vestido Perfecto" — "Body con falda + bragas moldeadoras + faja" — "64,90 €" with strikethrough "84,80 €". Thumbnail: bodysuit + black dress with thin straps and long fitted skirt + seamless panties (three items side by side).
   Card layout: radio | thumbnail (~64×48px) | title + subtitle | price right-aligned. Compact, equal heights. Selected card: warm beige background + 1px gold border. Unselected: white + light-gray border. Do not add any other offer. Use the real product images from the store for thumbnails when available; otherwise a clean placeholder that is easy to swap.
   PRICES MUST BE REAL. The displayed prices must equal what the customer pays at checkout:
   - Add to cart via the AJAX Cart API (`/cart/add.js` with an `items` array): Solo = 1× current variant; 2ª unidad = 2× the same variant; Kit = selected-size bodysuit + "Body Moldeador con Falda — Nuvel" + "Bragas Moldeadoras Sin Costuras — Nuvel" (same selected size when those products have it; otherwise a clearly documented size-mapping object). Look up these products and variant IDs in the repo/data; if you can't find them, expose their handles via product-picker theme settings instead of hardcoding IDs.
   - Discounts cannot be created from theme code. Therefore: (1) add line item properties `_pack` = "solo" | "duo" | "kit" so the cart can identify the pack; (2) in your final answer, give the owner exact step-by-step instructions to create the matching Shopify automatic discounts in Admin (a "Buy X get Y" at 50% off for the second identical bodysuit, and a product-combination/bundle discount that brings the Kit total from 84,80 € to 64,90 €), including product selections and combination rules; (3) add a theme setting "Mostrar precios de packs" to turn the pack prices off if the discounts are not active, with a code comment explaining why.
   - Display prices from Liquid `money` filters, with compare-at math done in code from product prices, not hardcoded strings. They must render exactly as "59,85 €", "79,80 €", "64,90 €", "84,80 €" with the current catalog prices.
7. PURCHASE BUTTONS, mandatory order:
   a) Shopify dynamic checkout button (keep the real `{{ form | payment_button }}` / PayPal) styled as a full-width yellow button reading "Pagar con PayPal" with the PayPal wordmark. Do NOT fake it with a plain link. Style `.shopify-payment-button` with CSS; keep it ABOVE add to cart.
   b) Black full-width "AÑADIR AL CARRITO · {price of the selected pack}" (uppercase, letter-spaced). The price updates when the selected pack or size changes.
   c) White button with a thin black border: "Comprar ahora" — adds the selected pack to the cart via AJAX and redirects to `/checkout`.
   Hide the "Cantidad" stepper (keep a hidden quantity input value=1) because quantity is controlled by the pack. Keep "En existencias" as a small status line under the buttons only if it comes from real inventory.
8. THREE BENEFIT COLUMNS with thin vertical dividers and fine-line black icons (keep existing icons if they already match):
   - eye: "Sin costuras — invisible bajo cualquier prenda"
   - person: "Compresión suave y cómoda todo el día"
   - t-shirt: "Tejido flexible que se adapta a tu figura"
9. THREE ACCORDIONS, full width, thin separators, left icon, right chevron that rotates when open:
   - ruler: "Guía de tallas" (measurements + "Disponible en tallas S a 2XL"; reuse the existing size guide image from thumbnail 5 if there is no table)
   - truck: "Envío y devoluciones" (keep existing content; make sure it states free shipping and 30-day free size exchange)
   - shield: NEW — "¿Qué hace diferente a Nuvel?" (text: "Diseño sin costuras con Ajuste Anclado™ pensado para no verse ni notarse.")

G) VISUAL STYLE
- Pure white background; black/charcoal text; gold accent #8A6F4A (CSS variable); beige #f3ece1; dividers #e6e3de.
- Lora for logo, title, editorial headings; Poppins for nav, prices, labels, sizes, buttons (already loaded by the theme, reuse).
- 2px radius on cards/buttons, pill-shaped size buttons. No gradients, no heavy shadows, no oversized icons. Generous whitespace.
- All new CSS in ONE new asset `assets/nuvel-product.css` (scoped under a `.nuvel-pdp` wrapper) and all new JS in ONE new asset `assets/nuvel-product.js` (vanilla, no libraries, no localStorage). Load them only on the product template.
- Accessibility: real <button> elements, aria-pressed on sizes, radio inputs for packs, visible focus, aria-labels on icons, respect prefers-reduced-motion.

H) DO NOT
- Do not invent reviews, testimonials, ratings, or trust badges.
- Do not add any pack beyond the three listed.
- Do not change the size order, the vertical order of the right column, or move the editorial block away from under the gallery.
- Do not delete or alter "Así se ve puesta", "Conoce tu faja", the unboxing video, or existing product media.
- Do not hardcode text that should be translatable if the theme uses locales; add new strings to locales/es.json (and the default locale file if different).
- Do not force-push `main`. Do not delete `main`. Do not delete any branch before its archive tag has been created and pushed.
- Do not delete branches until the acceptance checklist below passes.

I) ACCEPTANCE CHECKLIST (report pass/fail for each)
1. No Liquid errors anywhere on the page.
2. Announcement bar text matches exactly.
3. Left column 53% / right 47% on desktop, single column on mobile.
4. Editorial block is directly under the gallery in the left column.
5. Shipping row is above the size selector.
6. Sizes appear exactly S, M, L, XL, 2XL; S selected by default; variant switching still works (price, URL, availability).
7. Exactly three packs; "2ª unidad al 50%" selected by default with the "MÁS POPULAR" badge.
8. Order: PayPal (real dynamic button) → "AÑADIR AL CARRITO · price" → "Comprar ahora".
9. Add-to-cart price changes with the selected pack; the cart receives the right items and the `_pack` property.
10. Benefits (3) and accordions (3) present with the exact texts.
11. Old description + bullets removed; "S a 2XL" text corrected.
12. Mobile layout checked at 390px width.
13. All work is on `main`; backup tag exists.
14. Every other remote branch has an archive tag and has been deleted; `git branch -a` shows only `main`; `main` is the default branch.
15. Shopify theme connection verified/reconnected to `main`.

FINAL ANSWER FORMAT
1. List of changed/new files with a one-line reason each.
2. Commit messages used and confirmation that the push to `main` succeeded (or full file contents + git commands if you had no repo access).
3. The branches found, the archive tags created, the branches deleted, and the final `git branch -a`.
4. Step-by-step Shopify Admin instructions: reconnecting the theme to `main` if needed, and creating the automatic discounts (section F.6).
5. The acceptance checklist with pass/fail.
6. Any assumption you made or anything you could not verify (e.g. missing product handles, protected branches).

REFERENCE FOR VISUAL AND BEHAVIOR (static prototype in vanilla HTML/CSS/JS — use only as a guide for layout, sizes, spacing and JS logic; adapt it to Liquid and to the theme's real classes):
[PASTE HERE THE CODE OF nuvel-producto.html]