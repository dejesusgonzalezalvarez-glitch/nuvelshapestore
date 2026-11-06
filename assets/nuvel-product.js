(function() {
  'use strict';

  const SELECTORS = {
    container: '[data-nuvel-buybox], [data-nuvel-packs]',
    sizeButton: '.nuvel-buybox__size-button',
    sizeButtons: '.nuvel-buybox__size-buttons',
    variantIdInput: '.nuvel-buybox__variant-id',
    packCards: '.nuvel-buybox__pack-card, .nuvel-packs__card',
    packRadios: '.nuvel-buybox__pack-radio, .nuvel-packs__radio',
    addToCartButton: '.nuvel-buybox__add-to-cart',
    addToCartPrice: '.nuvel-buybox__add-to-cart-price',
    buyNowButton: '.nuvel-buybox__buy-now',
    form: '.nuvel-buybox__form',
    packData: '[data-nuvel-pack-data]',
  };

  const PACK_CONFIG = {
    solo: { multiplier: 1 },
    duo: { multiplier: 1.5 },
    kit: { fixedPrice: 6490 },
  };

  class NuvelProductPage {
    constructor(container) {
      this.container = container;
      this.sectionId = container.dataset.sectionId || '';
      this.currentPack = 'duo';
      this.currentSize = null;
      this.currentVariantId = null;
      this.basePriceCents = 0;
      this.packData = null;

      this.init();
    }

    init() {
      this.cacheElements();
      this.parsePackData();
      this.bindEvents();
      this.updateFromUrl();
      this.updateUI();
    }

    cacheElements() {
      this.sizeButtons = this.container.querySelectorAll(SELECTORS.sizeButton);
      this.variantIdInput = this.container.querySelector(SELECTORS.variantIdInput);
      this.packCards = this.container.querySelectorAll(SELECTORS.packCards);
      this.packRadios = this.container.querySelectorAll(SELECTORS.packRadios);
      this.addToCartButton = this.container.querySelector(SELECTORS.addToCartButton);
      this.addToCartPrice = this.container.querySelector(SELECTORS.addToCartPrice);
      this.buyNowButton = this.container.querySelector(SELECTORS.buyNowButton);
      this.form = this.container.querySelector(SELECTORS.form);
    }

    parsePackData() {
      const dataElement = this.container.querySelector(SELECTORS.packData);
      if (dataElement) {
        try {
          this.packData = JSON.parse(dataElement.textContent);
        } catch (e) {
          console.warn('Nuvel: Could not parse pack data', e);
        }
      }

      const basePriceAttr = this.container.dataset.basePrice;
      if (basePriceAttr) {
        this.basePriceCents = parseInt(basePriceAttr, 10);
      }
    }

    bindEvents() {
      this.sizeButtons.forEach(button => {
        button.addEventListener('click', this.handleSizeClick.bind(this));
      });

      this.packRadios.forEach(radio => {
        radio.addEventListener('change', this.handlePackChange.bind(this));
      });

      if (this.addToCartButton) {
        this.addToCartButton.addEventListener('click', this.handleAddToCart.bind(this));
      }

      if (this.buyNowButton) {
        this.buyNowButton.addEventListener('click', this.handleBuyNow.bind(this));
      }

      document.addEventListener('nuvel:variant:changed', this.handleVariantChange.bind(this));
    }

    handleSizeClick(event) {
      const button = event.currentTarget;
      if (button.disabled) return;

      const size = button.dataset.size;
      const variantId = button.dataset.variantId;

      this.selectSize(size, variantId);
      this.updateVariantId(variantId);
      this.updateURL(variantId);
    }

    handlePackChange(event) {
      const radio = event.target;
      const pack = radio.value;

      this.selectPack(pack);
      this.updateUI();
    }

    selectSize(size, variantId) {
      this.currentSize = size;
      this.currentVariantId = variantId;

      this.sizeButtons.forEach(btn => {
        const isSelected = btn.dataset.size === size;
        btn.classList.toggle('is-selected', isSelected);
        btn.setAttribute('aria-pressed', isSelected);
      });

      this.updatePackDataForVariant(variantId);
    }

    selectPack(pack) {
      this.currentPack = pack;

      this.packCards.forEach(card => {
        const isSelected = card.dataset.pack === pack;
        card.classList.toggle('is-selected', isSelected);
        const radio = card.querySelector(SELECTORS.packRadios);
        if (radio) radio.checked = isSelected;
      });
    }

    updateVariantId(variantId) {
      if (this.variantIdInput) {
        this.variantIdInput.value = variantId;
      }

      const formVariantId = this.form?.querySelector('.product-variant-id');
      if (formVariantId) {
        formVariantId.value = variantId;
      }
    }

    updateURL(variantId) {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variantId);
      window.history.replaceState({}, '', url);
    }

    updateFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const variantParam = urlParams.get('variant');

      if (variantParam) {
        const variantId = parseInt(variantParam, 10);
        const button = this.container.querySelector(`[data-variant-id="${variantId}"]`);
        if (button && !button.disabled) {
          this.selectSize(button.dataset.size, variantId);
        }
      } else {
        const firstAvailable = Array.from(this.sizeButtons).find(btn => !btn.disabled);
        if (firstAvailable) {
          this.selectSize(firstAvailable.dataset.size, firstAvailable.dataset.variantId);
        }
      }
    }

    updatePackDataForVariant(variantId) {
      if (!this.packData) return;

      const packData = JSON.parse(JSON.stringify(this.packData));

      Object.keys(packData).forEach(packKey => {
        packData[packKey].items = packData[packKey].items.map(item => {
          if (item.variant_id === this.currentVariantId || item.variant_id === this.packData?.[packKey]?.items?.[0]?.variant_id) {
            return { ...item, variant_id: variantId };
          }
          return item;
        });
      });

      this.packData = packData;

      const dataElement = this.container.querySelector(SELECTORS.packData);
      if (dataElement) {
        dataElement.textContent = JSON.stringify(this.packData);
      }
    }

    handleVariantChange(event) {
      if (event.detail.sectionId !== this.sectionId) return;

      const variant = event.detail.variant;
      if (!variant) return;

      const button = this.container.querySelector(`[data-variant-id="${variant.id}"]`);
      if (button && !button.disabled) {
        this.selectSize(button.dataset.size, variant.id);
      }

      this.basePriceCents = variant.price;
      this.updateUI();
    }

    calculatePackPrice() {
      const packConfig = PACK_CONFIG[this.currentPack];
      if (!packConfig) return this.basePriceCents;

      if (packConfig.fixedPrice) {
        return packConfig.fixedPrice;
      }

      return Math.round(this.basePriceCents * packConfig.multiplier);
    }

    formatPrice(cents) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      }).format(cents / 100);
    }

    updateUI() {
      const packPriceCents = this.calculatePackPrice();

      if (this.addToCartPrice) {
        this.addToCartPrice.textContent = this.formatPrice(packPriceCents);
      }

      if (this.addToCartButton) {
        const span = this.addToCartButton.querySelector('span');
        if (span) {
          const nodes = span.childNodes;
          nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              node.textContent = 'AÑADIR AL CARRITO · ' + this.formatPrice(packPriceCents) + ' ';
            }
          });
        }
      }

      this.updatePackCardPrices();
    }

    updatePackCardPrices() {
      if (!this.packData) return;

      this.packCards.forEach(card => {
        const pack = card.dataset.pack;
        const priceEl = card.querySelector('.nuvel-buybox__pack-price, .nuvel-packs__price');
        const compareEl = card.querySelector('.nuvel-buybox__pack-compare, .nuvel-packs__compare');

        if (!priceEl) return;

        const packConfig = PACK_CONFIG[pack];
        if (!packConfig) return;

        let priceCents, compareAtCents;

        if (packConfig.fixedPrice) {
          priceCents = packConfig.fixedPrice;
          compareAtCents = 8480;
        } else {
          priceCents = Math.round(this.basePriceCents * packConfig.multiplier);
          compareAtCents = this.basePriceCents * (pack === 'duo' ? 2 : 1);
        }

        priceEl.textContent = this.formatPrice(priceCents);

        if (compareEl && compareAtCents > priceCents) {
          compareEl.textContent = this.formatPrice(compareAtCents);
        }
      });
    }

    async handleAddToCart(event) {
      event.preventDefault();

      if (this.addToCartButton.disabled) return;

      const originalHTML = this.addToCartButton.innerHTML;
      this.addToCartButton.disabled = true;
      this.addToCartButton.innerHTML = '<span class="loading-spinner"></span>';

      try {
        await this.addPackToCart(this.currentPack);
        this.showNotification('Producto añadido al carrito');
      } catch (error) {
        console.error('Add to cart failed:', error);
        this.showNotification('Error al añadir al carrito', true);
      } finally {
        this.addToCartButton.disabled = false;
        this.addToCartButton.innerHTML = originalHTML;
      }
    }

    async handleBuyNow(event) {
      event.preventDefault();

      if (this.buyNowButton.disabled) return;

      const originalText = this.buyNowButton.textContent;
      this.buyNowButton.disabled = true;
      this.buyNowButton.textContent = 'Procesando...';

      try {
        await this.addPackToCart(this.currentPack);
        window.location.href = '/checkout';
      } catch (error) {
        console.error('Buy now failed:', error);
        this.showNotification('Error al procesar la compra', true);
        this.buyNowButton.disabled = false;
        this.buyNowButton.textContent = originalText;
      }
    }

    async addPackToCart(pack) {
      const packData = this.packData?.[pack];
      if (!packData) throw new Error('Pack data not found');

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: packData.items.map(item => ({
            id: item.variant_id,
            quantity: item.quantity,
            properties: packData.properties
          }))
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.description || 'Failed to add to cart');
      }

      return response.json();
    }

    showNotification(message, isError = false) {
      const notification = document.createElement('div');
      notification.className = `nuvel-notification${isError ? ' nuvel-notification--error' : ''}`;
      notification.setAttribute('role', 'alert');
      notification.textContent = message;

      document.body.appendChild(notification);

      requestAnimationFrame(() => {
        notification.classList.add('is-visible');
      });

      setTimeout(() => {
        notification.classList.remove('is-visible');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll(SELECTORS.container);
    containers.forEach(container => {
      new NuvelProductPage(container);
    });
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NuvelProductPage;
  }
})();