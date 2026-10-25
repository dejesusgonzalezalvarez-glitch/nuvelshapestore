class ProductBundles extends HTMLElement {
  connectedCallback() {
    this.bundles = {};
    this.selectedBundle = null;
    this.selections = {};

    this.cardContainer = this.querySelector('[data-product-bundles-cards]');
    this.selectionsContainer = this.querySelector('[data-product-bundles-selections]');
    this.addButton = this.querySelector('[data-add-to-cart]');
    this.errorEl = this.querySelector('[data-add-error]');

    this.cardContainer.addEventListener('click', (evt) => {
      const btn = evt.target.closest('[data-select-bundle]');
      if (!btn) return;
      const bundleId = Number(btn.dataset.selectBundle);
      this.selectBundle(bundleId);
    });

    this.selectionsContainer.addEventListener('change', (evt) => {
      const select = evt.target.closest('[data-bundle]');
      if (!select) return;
      const bundleId = Number(select.dataset.bundle);
      const option = Number(select.dataset.option);
      this.selections[bundleId] = this.selections[bundleId] || {};
      this.selections[bundleId][option] = select.value;
      this.checkSelections();
    });

    this.addButton.addEventListener('click', () => {
      this.addToCart();
    });

    this.initSelectionState();
  }

  initSelectionState() {
    const cards = this.cardContainer.querySelectorAll('[data-bundle]');
    cards.forEach((card) => {
      const id = Number(card.dataset.bundle);
      const btn = card.querySelector('[data-select-bundle]');
      const selected = card.hasAttribute('data-selected');

      if (selected) {
        this.selectBundle(id, false);
      } else {
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    this.checkSelections();
  }

  selectBundle(id) {
    const cards = this.cardContainer.querySelectorAll('[data-bundle]');
    cards.forEach((card) => {
      const isSame = Number(card.dataset.bundle) === id;
      card.toggleAttribute('data-selected', isSame);
      const btn = card.querySelector('[data-select-bundle]');
      btn.setAttribute('aria-pressed', isSame);
    });

    const selections = this.selectionsContainer.querySelectorAll('[data-bundle-selection]');
    selections.forEach((sel) => {
      const isSame = Number(sel.dataset.bundleSelection) === id;
      sel.toggleAttribute('data-selected', isSame);
    });

    this.selectedBundle = id;
    this.checkSelections();
  }

  checkSelections() {
    if (!this.selectedBundle) {
      this.addButton.disabled = true;
      this.errorEl.hidden = false;
      return;
    }

    const sel = this.selections[this.selectedBundle] || {};
    let complete = true;
    const selects = this.selectionsContainer.querySelectorAll(`[data-bundle="${this.selectedBundle}"]`);
    selects.forEach((s) => {
      if (!s.value) complete = false;
    });

    this.addButton.disabled = !complete;
    this.errorEl.hidden = complete;
  }

  async addToCart() {
    const sel = this.selections[this.selectedBundle];
    if (!sel) return;

    const lines = [];
    for (const [option, variantId] of Object.entries(sel)) {
      lines.push({
        id: Number(variantId),
        quantity: 1,
        properties: {
          _bundle_id: this.selectedBundle,
          _bundle_name: this.selectedBundle
        }
      });
    }

    this.addButton.disabled = true;
    this.addButton.textContent = 'Añadiendo...';

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lines })
      });

      if (!res.ok) throw new Error('Error al añadir al carrito');

      window.dispatchEvent(new CustomEvent('cart:updated'));

      const drawer = document.querySelector('cart-drawer');
      if (drawer && typeof drawer.open === 'function') {
        drawer.open();
      } else {
        window.location.href = '/cart';
      }
    } catch (e) {
      console.error(e);
      this.addButton.disabled = false;
      this.addButton.textContent = 'Añadir al carrito';
    }
  }
}

customElements.define('product-bundles', ProductBundles);
