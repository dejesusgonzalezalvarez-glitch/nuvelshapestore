/**
 * Product Bundles — Nuvel
 * Selección de bundles, variantes y add-to-cart nativo.
 * Compatible con carrito drawer de Rise.
 */
(function () {
  'use strict';

  function initProductBundles() {
    var sections = document.querySelectorAll('[data-product-bundles]');
    if (!sections.length) return;

    sections.forEach(function (section) {
      var cards = section.querySelectorAll('[data-select-bundle]');
      var selections = section.querySelectorAll('[data-bundle-selection]');
      var addButton = section.querySelector('[data-add-to-cart]');
      var errorEl = section.querySelector('[data-add-error]');
      var form = document.querySelector('form[data-type="add-to-cart-form"]') || document.querySelector('form[action*="/cart/add"]');

      if (!cards.length || !addButton || !form) return;

      var selectedBundle = null;
      var selectedVariants = {};

      // Inicializar estado desde data-selected
      cards.forEach(function (card) {
        if (card.hasAttribute('data-selected')) {
          selectedBundle = card.getAttribute('data-bundle');
          selectBundle(selectedBundle);
        }
      });

      // Click en tarjetas de bundle
      cards.forEach(function (card) {
        card.addEventListener('click', function (e) {
          if (e.target.closest('[data-select-bundle]')) {
            var bundleId = card.getAttribute('data-bundle');
            selectBundle(bundleId);
          }
        });
      });

      function selectBundle(bundleId) {
        selectedBundle = bundleId;
        selectedVariants[bundleId] = selectedVariants[bundleId] || {};

        // Actualizar tarjetas
        cards.forEach(function (card) {
          var isSelected = card.getAttribute('data-bundle') === bundleId;
          card.toggleAttribute('data-selected', isSelected);
          card.querySelector('[data-select-bundle]').setAttribute('aria-pressed', isSelected);
        });

        // Mostrar/ocultar selecciones de variantes
        selections.forEach(function (sel) {
          var isSelected = sel.getAttribute('data-bundle-selection') === bundleId;
          sel.toggleAttribute('data-selected', isSelected);
        });

        updateAddButton();
      }

      // Cambios en selects de variantes
      section.querySelectorAll('[data-product-bundles-selections] select').forEach(function (select) {
        select.addEventListener('change', function () {
          var bundleId = select.getAttribute('data-bundle');
          var optionIndex = select.getAttribute('data-option');
          var productHandle = select.getAttribute('data-product');
          var variantId = select.value;

          if (!selectedVariants[bundleId]) selectedVariants[bundleId] = {};
          selectedVariants[bundleId][optionIndex] = {
            product: productHandle,
            variantId: variantId
          };

          updateAddButton();
        });
      });

      function updateAddButton() {
        if (!selectedBundle) {
          addButton.disabled = true;
          if (errorEl) errorEl.hidden = false;
          return;
        }

        var bundleSel = selectedVariants[selectedBundle] || {};
        var requiredCount = 0;
        var filledCount = 0;

        // Contar selects requeridos para este bundle
        var selects = section.querySelectorAll('[data-bundle-selection="' + selectedBundle + '"] select');
        requiredCount = selects.length;

        selects.forEach(function (select) {
          var optionIndex = select.getAttribute('data-option');
          if (bundleSel[optionIndex] && bundleSel[optionIndex].variantId) {
            filledCount++;
          }
        });

        var isComplete = requiredCount > 0 && filledCount === requiredCount;
        addButton.disabled = !isComplete;

        if (errorEl) {
          errorEl.hidden = isComplete || requiredCount === 0;
        }
      }

      // Add to cart
      addButton.addEventListener('click', function () {
        if (addButton.disabled) return;

        var bundleSel = selectedVariants[selectedBundle] || {};
        var items = [];

        // Construir items según el bundle seleccionado
        if (selectedBundle === '1') {
          // Bundle 1: 3 productos, cantidad 1 cada uno
          Object.keys(bundleSel).forEach(function (optionIndex) {
            var sel = bundleSel[optionIndex];
            if (sel && sel.variantId) {
              items.push({ variant_id: parseInt(sel.variantId, 10), quantity: 1 });
            }
          });
        } else if (selectedBundle === '2') {
          // Bundle 2: producto 1 cantidad N, producto 2 opcional cantidad M
          // Los selects están en orden: opción 1 y 2 para producto 1, opción 1 para producto 2
          var qty1 = 2; // default
          var qty2 = 1; // default

          // Intentar leer cantidades desde data attributes si existen
          var card = section.querySelector('[data-bundle="2"]');
          if (card) {
            var qtyEl1 = card.querySelector('[data-bundle="2"] .product-bundles__item-qty');
            if (qtyEl1) {
              var match = qtyEl1.textContent.match(/×(\d+)/);
              if (match) qty1 = parseInt(match[1], 10);
            }
          }

          Object.keys(bundleSel).forEach(function (optionIndex) {
            var sel = bundleSel[optionIndex];
            if (sel && sel.variantId) {
              var qty = (optionIndex === '1' || optionIndex === '2') ? qty1 : qty2;
              items.push({ variant_id: parseInt(sel.variantId, 10), quantity: qty });
            }
          });
        }

        if (!items.length) return;

        // Usar fetch nativo para add-to-cart (compatible con carrito drawer de Rise)
        var formData = new FormData();
        formData.append('items', JSON.stringify(items));
        formData.append('sections', 'cart-drawer,cart-icon-bubble');
        formData.append('sections_url', window.location.pathname);

        addButton.disabled = true;
        var originalText = addButton.textContent;
        addButton.textContent = 'Añadiendo...';

        fetch(window.routes.cart_add_url, {
          method: 'POST',
          body: formData
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // Disparar evento para que el carrito drawer se abra (Rise usa este patrón)
          document.dispatchEvent(new CustomEvent('cart:refresh', { detail: data }));
          document.dispatchEvent(new CustomEvent('cart:add', { detail: { items: items } }));

          // Mostrar feedback
          addButton.textContent = 'Añadido ✓';
          addButton.style.background = '#3ed660';
          addButton.style.borderColor = '#3ed660';

          setTimeout(function () {
            addButton.textContent = originalText;
            addButton.style.background = '';
            addButton.style.borderColor = '';
            addButton.disabled = false;
          }, 2000);
        })
        .catch(function (err) {
          console.error('Bundle add-to-cart error:', err);
          addButton.textContent = 'Error';
          setTimeout(function () {
            addButton.textContent = originalText;
            addButton.disabled = false;
          }, 2000);
        });
      });
    });
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductBundles);
  } else {
    initProductBundles();
  }

  // También inicializar en navegación turbo/hot-reload
  document.addEventListener('shopify:section:load', function (e) {
    if (e.target.querySelector('[data-product-bundles]')) {
      initProductBundles();
    }
  });
})();