/* ===== Nuvel — carrito funcional (localStorage), sin backend real ===== */
(function () {
  function fmt(n) {
    return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }

  function renderCart() {
    return fetch("/cart.js")
      .then((r) => r.json())
      .then((cart) => {
        document.querySelectorAll("[data-cart-count]").forEach((el) => {
          el.textContent = cart.item_count;
          el.style.display = cart.item_count > 0 ? "flex" : "none";
        });

        const itemsEl = document.getElementById("cart-items");
        const footEl = document.getElementById("cart-foot");
        if (!itemsEl) return cart;

        if (cart.item_count === 0) {
          itemsEl.innerHTML = '<div class="cart-empty">Tu carrito está vacío.</div>';
          if (footEl) footEl.style.display = "none";
          return cart;
        }
        if (footEl) footEl.style.display = "block";

        itemsEl.innerHTML = cart.items.map((item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.product_title}">
            <div class="ci-info">
              <h5>${item.product_title}</h5>
              <div class="ci-meta">${item.variant_title ? item.variant_title + " · " : ""}${fmt(item.price / 100)}</div>
              <div class="qty-stepper">
                <button data-qty-minus="${item.key}" aria-label="Restar">−</button>
                <span>${item.quantity}</span>
                <button data-qty-plus="${item.key}" aria-label="Sumar">+</button>
                <button class="remove-link" data-remove="${item.key}">Eliminar</button>
              </div>
            </div>
          </div>
        `).join("");

        const subEl = document.getElementById("cart-subtotal-value");
        if (subEl) subEl.textContent = fmt(cart.total_price / 100);

        itemsEl.querySelectorAll("[data-qty-plus]").forEach((b) => b.addEventListener("click", () => changeQty(b.dataset.qtyPlus, 1)));
        itemsEl.querySelectorAll("[data-qty-minus]").forEach((b) => b.addEventListener("click", () => changeQty(b.dataset.qtyMinus, -1)));
        itemsEl.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => removeItem(b.dataset.remove)));
        return cart;
      });
  }

  function changeQty(key, delta) {
    fetch("/cart.js")
      .then((r) => r.json())
      .then((cart) => {
        const item = cart.items.find((i) => i.key === key);
        if (!item) return null;
        const nuevaCantidad = Math.max(0, item.quantity + delta);
        return fetch("/cart/change.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: key, quantity: nuevaCantidad }),
        });
      })
      .then(() => renderCart());
  }

  function removeItem(key) {
    fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: key, quantity: 0 }),
    }).then(() => renderCart());
  }

  // Evita que la página de fondo haga scroll mientras hay un panel/modal abierto encima
  // (carrito, buscador, cuenta, checkout) — importante en móvil, donde si no el dedo
  // sigue moviendo el contenido detrás del overlay.
  let openOverlays = 0;
  function lockScroll() {
    openOverlays++;
    document.documentElement.classList.add("no-scroll");
  }
  function unlockScroll() {
    openOverlays = Math.max(0, openOverlays - 1);
    if (openOverlays === 0) document.documentElement.classList.remove("no-scroll");
  }

  function openCart() {
    document.getElementById("cart-drawer")?.classList.add("open");
    document.getElementById("cart-overlay")?.classList.add("open");
    lockScroll();
  }
  function closeCart() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (!drawer?.classList.contains("open")) return;
    drawer.classList.remove("open");
    overlay?.classList.remove("open");
    unlockScroll();
  }

  window.NuvelCart = { openCart, closeCart, renderCart };

  // Este archivo se inyecta con un <script src> creado por JS (ver
  // global-footer.liquid), lo que pasa siempre despues de que el DOM ya esta
  // listo. Un listener de "DOMContentLoaded" en ese momento no se dispara
  // nunca: nada de esto (carrito, filtros del catalogo, galeria de fotos...)
  // llegaba a engancharse. Se ejecuta directo en vez de esperar el evento.
  function nuvelInitCart() {
    renderCart();

    // Resalta en el menu la seccion en la que se esta, y solo esa. Se lee
    // location.pathname (la URL real del navegador) en vez de comparar contra
    // Liquid: las paginas que aun no existen en Shopify se sirven desde el
    // puente de 404.liquid, que siempre ve "/404" del lado del servidor.
    let ruta = location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
    if (ruta === "/pages/faq") ruta = "/pages/preguntas-frecuentes";
    document.querySelectorAll(".nav-link, .mobile-menu a").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase().replace(/\/+$/, "") || "/";
      a.classList.toggle("active", href === ruta);
    });

    document.querySelectorAll("[data-cart-open]").forEach((b) => b.addEventListener("click", openCart));
    document.getElementById("cart-close")?.addEventListener("click", closeCart);
    document.getElementById("cart-overlay")?.addEventListener("click", closeCart);

    // El carrito ya es el real de Shopify, asi que "Pagar" va directo al
    // checkout real — ya no hace falta ningun modal de aviso.
    document.getElementById("checkout-btn")?.addEventListener("click", () => {
      window.location.href = "/checkout";
    });

    // Mobile menu toggle
    const menuBtn = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    menuBtn?.addEventListener("click", () => {
      const open = mobileMenu?.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) lockScroll(); else unlockScroll();
    });

    // FAQ accordion
    document.querySelectorAll(".accordion-item button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".accordion-item");
        const open = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    // Deep-link into a specific FAQ item (e.g. faq.html#talla) and auto-open it
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target && target.classList.contains("accordion-item")) {
        target.classList.add("open");
        setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
      }
    }

    // ===== Search overlay =====
    const SITE_INDEX = [
      { title: "Faja Moldeadora Invisible (producto)", url: "/pages/producto", keywords: "faja moldeadora producto comprar talla precio invisible cintura" },
      { title: "Catálogo de fajas", url: "/pages/catalogo", keywords: "catalogo catálogo fajas moldeadoras tienda" },
      { title: "Sobre Nuvel", url: "/pages/sobre-nosotros", keywords: "sobre nosotros historia marca quienes somos" },
      { title: "Preguntas frecuentes", url: "/pages/preguntas-frecuentes", keywords: "faq preguntas frecuentes dudas ayuda" },
      { title: "Guía de tallas", url: "/pages/preguntas-frecuentes#talla", keywords: "talla tallas guia guía medidas s m l xl" },
      { title: "Envíos", url: "/pages/envios", keywords: "envio envío entrega tiempo plazo" },
      { title: "Devoluciones", url: "/pages/devoluciones", keywords: "devolucion devolución cambio reembolso" },
      { title: "Privacidad", url: "/pages/privacidad", keywords: "privacidad datos rgpd" },
      { title: "Términos y condiciones", url: "/pages/terminos", keywords: "terminos términos condiciones legal" },
    ];
    const searchOverlay = document.getElementById("search-overlay");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    function renderSearch(q) {
      if (!searchResults) return;
      const query = q.trim().toLowerCase();
      if (!query) { searchResults.innerHTML = ""; return; }
      const matches = SITE_INDEX.filter((it) => it.title.toLowerCase().includes(query) || it.keywords.includes(query));
      if (matches.length === 0) {
        searchResults.innerHTML = `<div class="search-empty">No encontramos nada para "${q}". <a href="/pages/producto" style="text-decoration:underline;">Ver nuestra faja</a> o <a href="/pages/preguntas-frecuentes" style="text-decoration:underline;">revisa las preguntas frecuentes</a>.</div>`;
        return;
      }
      searchResults.innerHTML = matches.map((it) => `<a href="${it.url}">${it.title}</a>`).join("");
    }
    function closeSearch() {
      if (!searchOverlay?.classList.contains("open")) return;
      searchOverlay.classList.remove("open");
      unlockScroll();
    }
    document.querySelectorAll("[data-search-open]").forEach((b) => b.addEventListener("click", () => {
      searchOverlay?.classList.add("open");
      lockScroll();
      setTimeout(() => searchInput?.focus(), 50);
    }));
    document.getElementById("search-close")?.addEventListener("click", closeSearch);
    searchOverlay?.addEventListener("click", (e) => { if (e.target === searchOverlay) closeSearch(); });
    searchInput?.addEventListener("input", (e) => renderSearch(e.target.value));
    document.getElementById("search-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      const match = SITE_INDEX.find((it) => it.title.toLowerCase().includes(query) || it.keywords.includes(query));
      if (match) window.location.href = match.url;
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeSearch(); closeCart(); closeAccount(); closeZoom(); }
    });

    // ===== Account panel (honest "no accounts yet" info panel) =====
    function openAccount() {
      document.getElementById("account-drawer")?.classList.add("open");
      document.getElementById("account-overlay")?.classList.add("open");
      lockScroll();
    }
    function closeAccount() {
      const drawer = document.getElementById("account-drawer");
      if (!drawer?.classList.contains("open")) return;
      drawer.classList.remove("open");
      document.getElementById("account-overlay")?.classList.remove("open");
      unlockScroll();
    }
    document.querySelectorAll("[data-account-open]").forEach((b) => b.addEventListener("click", openAccount));
    document.getElementById("account-close")?.addEventListener("click", closeAccount);
    document.getElementById("account-overlay")?.addEventListener("click", closeAccount);

    // ===== Catalog: category circles, filter dropdowns, sort =====
    const grid = document.getElementById("product-grid");
    if (grid) {
      const tiles = Array.from(grid.querySelectorAll(".product-tile"));
      const activeFilters = {}; // key -> value
      let activeCategory = null;

      function applyFilters() {
        const hasFilters = activeCategory || Object.keys(activeFilters).length > 0;
        document.getElementById("filters-clear").style.display = hasFilters ? "inline-block" : "none";
        let anyVisible = false;
        tiles.forEach((tile) => {
          const cats = (tile.dataset.cats || "").split(" ").filter(Boolean);
          let visible = true;
          if (activeCategory && !cats.includes(activeCategory)) visible = false;
          Object.entries(activeFilters).forEach(([key, val]) => {
            if (key === "precio") {
              // El precio se compara como número (data-price), no como etiqueta de texto:
              // así el filtro sigue funcionando aunque cambien los precios de los productos.
              const precio = parseFloat(tile.dataset.price);
              if (val === "menos-50" && !(precio < 50)) visible = false;
              if (val === "50-100" && !(precio >= 50 && precio <= 100)) visible = false;
              return;
            }
            const vals = (tile.dataset[key] || "").split(" ").filter(Boolean);
            if (!vals.includes(val)) visible = false;
          });
          tile.style.display = visible ? "" : "none";
          if (visible) anyVisible = true;
        });
        document.getElementById("filters-empty").style.display = anyVisible ? "none" : "block";
      }

      document.querySelectorAll(".cat-circle").forEach((btn) => {
        btn.addEventListener("click", () => {
          const cat = btn.dataset.cat;
          if (activeCategory === cat) { activeCategory = null; btn.classList.remove("active"); }
          else {
            document.querySelectorAll(".cat-circle").forEach((c) => c.classList.remove("active"));
            activeCategory = cat;
            btn.classList.add("active");
          }
          applyFilters();
        });
      });

      // Dropdown toggles (filters + sort)
      document.querySelectorAll("[data-filter-toggle]").forEach((chip) => {
        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          const key = chip.dataset.filterToggle;
          const panel = document.querySelector(`[data-filter-panel="${key}"]`);
          const wasOpen = panel.classList.contains("open");
          document.querySelectorAll(".filter-dropdown").forEach((p) => p.classList.remove("open"));
          if (!wasOpen) panel.classList.add("open");
        });
      });
      document.addEventListener("click", () => document.querySelectorAll(".filter-dropdown").forEach((p) => p.classList.remove("open")));

      // Filter option selection
      document.querySelectorAll("[data-filter-key]").forEach((opt) => {
        opt.addEventListener("click", (e) => {
          e.stopPropagation();
          if (opt.disabled) return;
          const key = opt.dataset.filterKey;
          const val = opt.dataset.filterValue;
          const panel = opt.closest(".filter-dropdown");
          const chip = document.querySelector(`[data-filter-toggle="${key}"]`);
          if (activeFilters[key] === val) {
            delete activeFilters[key];
            opt.classList.remove("active");
            chip.classList.remove("active");
          } else {
            panel.querySelectorAll("[data-filter-key]").forEach((o) => o.classList.remove("active"));
            activeFilters[key] = val;
            opt.classList.add("active");
            chip.classList.add("active");
          }
          panel.classList.remove("open");
          applyFilters();
        });
      });

      document.getElementById("filters-clear")?.addEventListener("click", () => {
        activeCategory = null;
        Object.keys(activeFilters).forEach((k) => delete activeFilters[k]);
        document.querySelectorAll(".cat-circle, .chip, [data-filter-key]").forEach((el) => el.classList.remove("active"));
        applyFilters();
      });

      // Sort
      document.querySelectorAll("[data-sort]").forEach((opt) => {
        opt.addEventListener("click", (e) => {
          e.stopPropagation();
          const mode = opt.dataset.sort;
          const sorted = [...tiles].sort((a, b) => {
            const pa = parseFloat(a.dataset.price), pb = parseFloat(b.dataset.price);
            if (mode === "precio-asc") return pa - pb;
            if (mode === "precio-desc") return pb - pa;
            return 0; // relevancia: original order
          });
          const base = mode === "relevancia" ? tiles : sorted;
          base.forEach((t) => grid.appendChild(t));
          document.querySelectorAll('[data-filter-panel="sort"] [data-sort]').forEach((o) => o.classList.remove("active"));
          opt.classList.add("active");
          opt.closest(".filter-dropdown").classList.remove("open");
        });
      });
    }

    // Product gallery: miniaturas, flechas izquierda/derecha y lupa de zoom
    function selectGalleryImage(thumb) {
      if (!thumb) return;
      const src = thumb.getAttribute("data-full");
      const main = document.getElementById("main-shot-img");
      // El <img> principal carga con "srcset": si no se limpia, el navegador
      // ignora el "src" nuevo y se queda con la foto original del srcset.
      if (main && src) { main.removeAttribute("srcset"); main.src = src; }
      document.querySelectorAll("[data-thumb]").forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      // Se pasa "src" directo en vez de releer main.currentSrc: justo después de
      // cambiar el src, currentSrc puede tardar un instante en ponerse al día.
      if (zoomBox?.classList.contains("open") && zoomImg && src) {
        zoomImg.src = src;
        zoomImg.alt = main ? main.alt : "";
      }
    }
    document.querySelectorAll("[data-thumb]").forEach((thumb) => {
      thumb.addEventListener("click", () => selectGalleryImage(thumb));
    });

    function moveGallery(delta) {
      const thumbs = Array.from(document.querySelectorAll("[data-thumb]"));
      if (!thumbs.length) return;
      let idx = thumbs.findIndex((t) => t.classList.contains("active"));
      if (idx === -1) idx = 0;
      idx = (idx + delta + thumbs.length) % thumbs.length;
      selectGalleryImage(thumbs[idx]);
      thumbs[idx].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    document.getElementById("gallery-prev")?.addEventListener("click", () => moveGallery(-1));
    document.getElementById("gallery-next")?.addEventListener("click", () => moveGallery(1));

    // Lupa: ver la foto principal ampliada, con las mismas flechas para navegar
    const zoomOverlay = document.getElementById("zoom-overlay");
    const zoomBox = document.getElementById("zoom-box");
    const zoomImg = document.getElementById("zoom-img");
    function setZoomImage() {
      const main = document.getElementById("main-shot-img");
      if (!main || !zoomImg) return;
      // "main.currentSrc" puede tardar en ponerse al día justo después de un
      // cambio reciente de foto — se usa la miniatura activa como fuente de
      // verdad (siempre apunta a la versión en alta resolución) en su lugar.
      const activeThumb = document.querySelector("[data-thumb].active");
      zoomImg.src = activeThumb ? activeThumb.getAttribute("data-full") : main.src;
      zoomImg.alt = main.alt;
    }
    function openZoom() {
      if (!document.getElementById("main-shot-img")) return;
      setZoomImage();
      zoomOverlay?.classList.add("open");
      zoomBox?.classList.add("open");
      lockScroll();
    }
    function closeZoom() {
      if (!zoomBox?.classList.contains("open")) return;
      zoomOverlay?.classList.remove("open");
      zoomBox?.classList.remove("open");
      unlockScroll();
    }
    document.getElementById("gallery-zoom")?.addEventListener("click", openZoom);
    document.getElementById("zoom-close")?.addEventListener("click", closeZoom);
    zoomOverlay?.addEventListener("click", closeZoom);
    document.getElementById("zoom-prev")?.addEventListener("click", () => moveGallery(-1));
    document.getElementById("zoom-next")?.addEventListener("click", () => moveGallery(1));

    // Gallery swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const mainShot = document.querySelector(".main-shot");
    if (mainShot) {
      mainShot.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
      mainShot.addEventListener('touchend', e => { 
        touchEndX = e.changedTouches[0].screenX; 
        if (touchEndX < touchStartX - 40) moveGallery(1); 
        if (touchEndX > touchStartX + 40) moveGallery(-1); 
      }, {passive: true});
    }
    if (zoomBox) {
      zoomBox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
      zoomBox.addEventListener('touchend', e => { 
        touchEndX = e.changedTouches[0].screenX; 
        if (touchEndX < touchStartX - 40) moveGallery(1); 
        if (touchEndX > touchStartX + 40) moveGallery(-1); 
      }, {passive: true});
    }

    // Size selector
    let selectedSize = "M";
    let selectedVariantId = document.querySelector("[data-size].selected")?.dataset.variantId || null;

    // En productos con color real (Corse, Short, Vestido) la variante depende
    // de talla Y color juntos, asi que no basta con el data-variant-id de la
    // talla sola. window.__NUVEL_VARIANTES__ (si el liquid lo genero) mapea
    // "ColorReal_Talla" -> id de variante; esto recalcula cada vez que cambia
    // cualquiera de los dos. Los productos sin ese mapa (como la Faja, que no
    // expone selector de color) siguen usando el id fijo de la talla.
    function recalcularVariante() {
      const mapa = window.__NUVEL_VARIANTES__;
      if (!mapa) return;
      const colorBtn = document.querySelector("[data-color-key].selected");
      const colorKey = colorBtn?.dataset.colorKey;
      if (!colorKey || !selectedSize) return;
      const id = mapa[colorKey + "_" + selectedSize];
      if (id) selectedVariantId = id;
    }
    window.__nuvelRecalcularVariante = recalcularVariante;
    recalcularVariante();

    document.querySelectorAll("[data-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-size]").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedSize = btn.dataset.size;
        selectedVariantId = btn.dataset.variantId || null;
        recalcularVariante();
      });
    });

    // Quantity offer selector
    let selectedQty = 1;
    document.querySelectorAll("[data-qty-offer]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-qty-offer]").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedQty = Number(btn.dataset.qtyOffer);
      });
    });

    // Add to cart (product page): agrega la variante real al carrito real de
    // Shopify y abre el cajon para que se vea lo que se llevo antes de pagar
    // — el boton "Pagar" del cajon es el que de verdad manda al checkout.
    document.getElementById("add-to-cart-btn")?.addEventListener("click", (e) => {
      if (!selectedVariantId) return;
      const boton = e.currentTarget;
      boton.disabled = true;
      fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: Number(selectedVariantId), quantity: selectedQty }] }),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(r)))
        .then(() => renderCart())
        .then(() => { boton.disabled = false; openCart(); })
        .catch(() => {
          boton.disabled = false;
          alert("No se pudo añadir el producto al carrito. Intenta de nuevo.");
        });
    });

    // ===== Comprados juntos habitualmente (bundle) =====
    // El pack se cobra a precio real de cada prenda (Shopify no aplica un
    // descuento aparte sin un codigo de verdad), asi que el total mostrado es
    // la suma real, sin una rebaja que luego no se refleja en el cobro.
    document.querySelectorAll(".bundle-box").forEach((box) => {
      const mainPrice = parseFloat(box.dataset.mainPrice);
      const partnerPrice = parseFloat(box.dataset.partnerPrice);
      const checkbox = box.querySelector("[data-bundle-toggle]");
      const wasEl = box.querySelector(".bundle-total-was");
      const nowEl = box.querySelector(".bundle-total-now");
      const saveEl = box.querySelector(".bundle-save");
      if (wasEl) wasEl.style.display = "none";
      if (saveEl) saveEl.style.display = "none";

      function refresh() {
        nowEl.textContent = fmt(checkbox.checked ? mainPrice + partnerPrice : mainPrice);
      }
      checkbox?.addEventListener("change", refresh);
      refresh();

      box.querySelector(".bundle-add-btn")?.addEventListener("click", (e) => {
        const items = [];
        if (selectedVariantId) items.push({ id: Number(selectedVariantId), quantity: 1 });
        if (checkbox.checked && box.dataset.partnerVariantId) {
          items.push({ id: Number(box.dataset.partnerVariantId), quantity: 1 });
        }
        if (!items.length) return;
        const boton = e.currentTarget;
        boton.disabled = true;
        fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        })
          .then((r) => (r.ok ? r.json() : Promise.reject(r)))
          .then(() => renderCart())
          .then(() => { boton.disabled = false; openCart(); })
          .catch(() => {
            boton.disabled = false;
            alert("No se pudo añadir el pack. Intenta de nuevo.");
          });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", nuvelInitCart);
  } else {
    nuvelInitCart();
  }
})();

/* ---------- selector de color en la ficha del short ---------- */
(function () {
  var botonesColor = document.querySelectorAll('[data-color-shot]');
  if (!botonesColor.length) return;
  var principal = document.getElementById('main-shot-img');

  botonesColor.forEach(function (btn) {
    btn.addEventListener('click', function () {
      botonesColor.forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      if (window.__nuvelRecalcularVariante) window.__nuvelRecalcularVariante();

      var foto = btn.dataset.colorShot;
      // Igual que en las miniaturas: hay que quitar "srcset" o el navegador
      // ignora este cambio de "src" y se queda con la foto con la que cargó la página.
      if (principal) { principal.removeAttribute('srcset'); principal.src = foto; }

      // marcar como activa la miniatura correspondiente — las miniaturas apuntan a
      // "images/lg/archivo.jpg" y el color a "images/archivo.jpg", así que se compara
      // por nombre de archivo, no por la ruta completa.
      var fotoFile = foto.split('/').pop().split('?')[0];
      document.querySelectorAll('[data-thumb]').forEach(function (t) {
        var thumbFile = (t.dataset.full || '').split('/').pop().split('?')[0].replace(/^lg-/, '');
        t.classList.toggle('active', thumbFile === fotoFile);
      });

      // Si la lupa está abierta, que también cambie de foto con el color.
      var zoomBox = document.getElementById('zoom-box');
      var zoomImg = document.getElementById('zoom-img');
      if (zoomBox && zoomImg && zoomBox.classList.contains('open') && principal) {
        zoomImg.src = foto;
      }
    });
  });
})();

/* ---------- el enlace "Guía de tallas" abre la foto de la tabla ---------- */
(function () {
  var enlace = document.querySelector('[data-ver-tallas]');
  if (!enlace) return;
  enlace.addEventListener('click', function (e) {
    e.preventDefault();
    var miniatura = document.querySelector('[data-thumb][data-full*="tallas"]');
    if (!miniatura) return;
    miniatura.click();
    miniatura.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();

/* ---------- barra de compra fija en movil ---------- */
(function () {
  var barra = document.getElementById('buy-bar');
  var botonReal = document.getElementById('add-to-cart-btn');
  if (!barra || !botonReal) return;

  document.body.classList.add('tiene-barra');

  var meta = barra.querySelector('[data-buy-bar-meta]');
  var anadir = barra.querySelector('[data-buy-bar-add]');

  // el texto de la barra refleja lo que hay elegido en la ficha
  function refrescar() {
    if (!meta) return;
    var talla = document.querySelector('.opt-btn.selected[data-size]');
    var color = document.querySelector('.opt-btn.selected[data-color]');
    var precio = document.querySelector('.price-now');
    var partes = [];
    if (talla) partes.push('Talla ' + talla.textContent.trim());
    if (color) partes.push(color.textContent.trim());
    if (precio) partes.push(precio.textContent.trim());
    meta.textContent = partes.join(' · ');
  }

  document.querySelectorAll('.opt-btn, [data-qty-offer]').forEach(function (b) {
    b.addEventListener('click', function () { setTimeout(refrescar, 20); });
  });
  refrescar();

  // aparece cuando el boton original sale de la pantalla
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        barra.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0);
      });
    }, { threshold: 0 }).observe(botonReal);
  } else {
    barra.classList.add('show');
  }

  if (anadir) {
    anadir.addEventListener('click', function () { botonReal.click(); });
  }
})();
