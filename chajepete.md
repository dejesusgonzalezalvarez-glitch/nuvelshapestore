# CRITICAL TASK — REPAIR NUVEL END-TO-END: GITHUB → SHOPIFY → LIVE STORE

You are a senior Shopify Online Store 2.0, Liquid, Git and GitHub integration engineer. Your job is to repair the existing NUVEL implementation completely, get all required changes into GitHub, resolve the Shopify theme integration failures, and prove the storefront works.

Repository:
https://github.com/dejesusgonzalezalvarez-glitch/nuvelshapestore

Branch: `main` only.

Live homepage:
https://nuvelshape.store/

Live product page:
https://nuvelshape.store/products/faja-moldeadora-invisible-nuvel

## CONTEXT — CONFIRMED FACTS

The current published Shopify theme is `nuvelshapestore/main`, ID `187577991409`.

The Shopify GitHub integration log for Sunday, October 25, 2026, at 12:05 GMT-4 shows:

`2168 correctos, 0 avisos, 5 fallidos`

The five failed operations have not yet been individually identified. Do not invent their filenames or error messages. Inspect the repository, Git history and any accessible integration logs to establish their actual causes.

The live product page has reported these Liquid errors:

- `sections/main-product`, lines 117, 124 and 131: `Could not find asset snippets/icon.liquid`
- `sections/main-product`, line 142: `Could not find asset snippets/nuvel-buybox.liquid`

The homepage has also reported a missing `snippets/nuvel-buybox.liquid` dependency in `sections/featured-product`.

The old announcement bar and old featured-product layout remain visible in the live storefront.

OpenCode previously reported commit `f55afed` and tag `backup-before-nuvel-redesign`, but verify their actual current state rather than assuming it has not changed.

## NON-NEGOTIABLE RULES

1. Work only on `main`. Never create or delete branches.
2. Never force-push.
3. Preserve all existing history and backup tags.
4. Do not disconnect or reconnect Shopify to GitHub.
5. Do not use “Reset to last commit” as a speculative fix.
6. Do not publish or change production settings without explicit authorization.
7. Do not overwrite working product media, unrelated homepage sections, catalog, FAQ, videos or footer.
8. Do not claim success based only on a successful Git push.
9. Make a local copy of the initial working tree and record the initial commit before making changes.
10. Do not expose credentials, tokens or secrets in logs or the final report.

## PHASE 1 — IDENTIFY THE EXACT FIVE SHOPIFY FAILURES

First inspect the repository, current Git state and remote.

Run and report the results of the relevant commands, including:

- `git status`
- `git fetch origin`
- `git log -n 10 --oneline --decorate`
- `git rev-parse origin/main`
- `git merge-base --is-ancestor f55afed origin/main` if that commit exists
- `git ls-remote --tags origin`

Verify whether `backup-before-nuvel-redesign` exists locally and remotely. Do not move or overwrite it.

Inspect the latest Shopify integration logs if access is available. Identify the exact five failed operations, their filenames, error messages and timestamps.

If Shopify integration logs are not accessible through your tools, explicitly say so. Do not pretend to have read them. In that case, inspect all current files and produce a precise list of likely missing or invalid dependencies, while explaining that the five log failures still need to be matched against Shopify's records.

## PHASE 2 — FIX ALL RELEVANT FILE AND LIQUID ERRORS

Inspect at least:

- `sections/main-product.liquid`
- `sections/featured-product.liquid`
- `templates/product.json`
- `templates/index.json`
- `snippets/nuvel-buybox.liquid`
- `snippets/icon.liquid`
- `assets/nuvel-product.css`
- `assets/nuvel-product.js`
- `config/settings_schema.json`
- `locales/es.json`
- `locales/en.default.json`
- the global announcement-bar section and its settings
- every additional snippet, section, asset or locale referenced by these files.

Fix all missing snippets, invalid Liquid calls, invalid JSON, missing translation keys, invalid asset references and incompatible section settings related to this implementation.

Specifically:

A. Ensure `snippets/icon.liquid` exists if required by the existing calls, supports their actual parameters and icon names, and renders safely.

B. Ensure `snippets/nuvel-buybox.liquid` exists in the exact expected path, is valid Liquid, and receives the correct product and compact parameters.

C. Make both `sections/main-product.liquid` and `sections/featured-product.liquid` render the shared buy box correctly.

D. Ensure all required CSS and JavaScript assets exist and load on both the product page and the homepage. Avoid duplicate initialization, missing selectors and JavaScript errors.

E. Add missing locale keys to the correct locale files, including the reported `nuvel.product_page.position_indicator` key where needed.

F. Validate the section schemas and all JSON templates.

G. Keep the existing design reference and requirements. Do not simplify or remove functionality merely to silence errors.

## PHASE 3 — PRESERVE THE REQUIRED NUVEL DESIGN

Both the product page and the homepage featured-product block must display the same purchase interface, with the homepage using compact mode.

Required content:

1. Eyebrow: `LA COMODIDAD QUE NO SE VE`
2. Title: `Faja Moldeadora Invisible — Nuvel`
3. Real Shopify variant price.
4. Shipping row above sizes: `ENVÍO GRATIS INCLUIDO`.
5. Size buttons in order S, M, L, XL, 2XL. Preserve the 3XL variant in Shopify but do not display it in this selector.
6. Exactly three offers:
   - `Solo una faja` — €39.90.
   - `2ª unidad al 50%` — €59.85 for two, crossed-out €79.80, badge `MÁS POPULAR`, selected by default.
   - `Kit del Vestido Perfecto` — €64.90, consisting of the faja, `womens-shapewear-dress-jumpsuit`, and `seamless-shapewear-panties`.
7. Real Shopify dynamic checkout button, styled as specified, only when actually provided by Shopify.
8. Black full-width add-to-cart button with the selected offer price.
9. Outlined `Comprar ahora` button.
10. No visible quantity stepper.
11. The three required benefits and no legacy benefits.
12. Required product-page accordions and the compact homepage details link.
13. Editorial block directly below the gallery on the product page.
14. Global editable announcement:
`La faja que no se nota ni bailando · Envío gratis · Cambio de talla gratis 30 días`

Do not add reviews, testimonials, trust badges or extra offers.

Do not claim the free-shipping promise is correct until the actual Spain shipping rate has been checked.

## PHASE 4 — TEST PURCHASE BEHAVIOR

Verify, using a safe preview or test environment where possible:

- Selecting a size updates the actual Shopify variant ID, availability and price.
- Solo adds one selected-size faja.
- Duo adds two units of the selected variant.
- Kit adds all three real products with the correct available sizes.
- AJAX requests use valid variant IDs and quantities.
- `_pack` is set to `solo`, `duo` or `kit`.
- `Comprar ahora` adds the chosen offer and proceeds to checkout without losing selection.
- No duplicate items are accidentally added.
- The dynamic checkout button is real, not a simulated button.
- Discounts actually apply to the final cart and checkout totals.

Do not create production orders, activate discounts, change shipping settings or modify payment configuration without authorization.

If a behavior cannot be tested safely or requires Shopify Admin access, state exactly what remains unverified.

## PHASE 5 — VALIDATE BEFORE PUSHING

Run `shopify theme check` if installed and available. If unavailable, say so and run every relevant validation possible locally.

Check:

- JSON syntax.
- All referenced snippet and asset paths.
- Liquid syntax and section schemas.
- Locale keys.
- JavaScript syntax.
- All relevant internal references.
- No accidental changes to unrelated sections or product media.

Review the final diff carefully. Do not commit unrelated modifications.

Fix all errors introduced by this implementation before committing.

## PHASE 6 — COMMIT AND PUSH

Once the code is validated:

1. Commit the changes to `main` with a descriptive message.
2. Push normally using `git push origin main`.
3. Verify the remote `main` points to the resulting commit.
4. List every changed or created file.
5. Report any test that failed instead of hiding it.

If the push fails, diagnose the real error and resolve it safely without force-pushing.

## PHASE 7 — GET SHOPIFY TO RECEIVE THE CORRECT FILES

After the push, inspect the available Shopify integration status and logs.

Confirm whether Shopify processes the new commit. If the integration logs are accessible, identify the exact result for the new event and explain the five previous failures.

If Shopify again reports failed operations:

- Identify the exact files and errors.
- Determine whether the cause is invalid Liquid, missing files, unsupported operations, permissions, or another concrete issue.
- Correct the source code in GitHub where appropriate.
- Commit and push the fix.
- Repeat validation and inspect the next synchronization result.

Do not loop blindly. If Shopify's logs are unavailable, or a failure requires an Admin action you cannot perform, stop and provide the exact evidence and manual steps needed.

Do not assume that GitHub and Shopify are synchronized just because the theme is named `nuvelshapestore/main`.

## PHASE 8 — PROVE THE RESULT

Inspect the actual public HTML of both:

- `https://nuvelshape.store/`
- `https://nuvelshape.store/products/faja-moldeadora-invisible-nuvel`

Verify:

- The new announcement bar appears.
- `ENVÍO GRATIS INCLUIDO` appears.
- Sizes S, M, L, XL and 2XL appear in that order.
- All three offers appear.
- The PayPal/dynamic checkout button is above add-to-cart when available.
- The product page has the editorial block below the gallery.
- The homepage uses the shared compact buy box.
- The known missing-snippet Liquid errors are gone.
- The live theme serves the corrected code.

Report the published theme ID, latest verified GitHub commit, Shopify synchronization status and whether publication is still required.

If the public storefront still does not show the new design, explain the exact confirmed blocker. Do not declare completion merely because the code was pushed.

## FINAL REPORT

Return:

1. Root cause of the five previous Shopify failures, if their records are accessible.
2. Exact errors fixed.
3. Files changed.
4. Tests run and their actual results.
5. New commit hash and remote push confirmation.
6. Shopify integration result for that commit, with evidence if available.
7. Current published theme ID and publication state, if verifiable.
8. Live homepage and product-page verification.
9. Any remaining manual Shopify Admin actions.

Be transparent about tool limitations. The goal is a functioning live storefront, not merely a successful Git commit.