/* ===== Nuvel — carrito funcional (localStorage), sin backend real ===== */
(function () {
  const CART_KEY = "nuvel_cart_v1";
  // El producto de cada ficha se declara en su propio HTML con
  // <body data-producto-id data-producto-nombre data-producto-precio data-producto-foto>.
  // Si no lo declara, se usa la faja como valor por defecto.
  const CUERPO = document.body;
  const PRODUCT = {
    id: CUERPO.dataset.productoId || "nuvel-faja-invisible",
    name: CUERPO.dataset.productoNombre || "Faja Moldeadora Invisible",
    price: parseFloat(CUERPO.dataset.productoPrecio || "39.90"),
    image: CUERPO.dataset.productoFoto || "producto-frente.jpg",
  };

  function imgPath(name) {
    // resolves relative to whatever page is loading this script
    const depth = document.body.getAttribute("data-root") || "";
    return depth + "images/" + name;
  }

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }
  function addToCart({ size, quantity }) {
    const cart = getCart();
    const elegido = document.querySelector("[data-color-shot].selected");
    const color = elegido ? elegido.dataset.color : null;
    const key = PRODUCT.id + "-" + size + (color ? "-" + color : "");
    const etiqueta = color ? size + " · " + color.charAt(0).toUpperCase() + color.slice(1) : size;
    const foto = elegido ? elegido.dataset.colorShot.replace("images/", "") : PRODUCT.image;
    const existing = cart.find((i) => i.key === key);
    if (existing) existing.qty += quantity;
    else cart.push({ key, name: PRODUCT.name, size: etiqueta, price: PRODUCT.price, qty: quantity, image: foto });
    saveCart(cart);
    openCart();
  }
  function updateQty(key, delta) {
    const cart = getCart();
    const item = cart.find((i) => i.key === key);
    if (!item) return;
    item.qty += delta;
    const filtered = item.qty <= 0 ? cart.filter((i) => i.key !== key) : cart;
    saveCart(filtered);
  }
  function removeItem(key) {
    saveCart(getCart().filter((i) => i.key !== key));
  }

  function fmt(n) {
    return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }

  function renderCart() {
    const cart = getCart();
    const countEls = document.querySelectorAll("[data-cart-count]");
    const totalCount = cart.reduce((s, i) => s + i.qty, 0);
    countEls.forEach((el) => {
      el.textContent = totalCount;
      el.style.display = totalCount > 0 ? "flex" : "none";
    });

    const itemsEl = document.getElementById("cart-items");
    const footEl = document.getElementById("cart-foot");
    if (!itemsEl) return;

    if (cart.length === 0) {
      itemsEl.innerHTML = '<div class="cart-empty">Tu carrito está vacío.</div>';
      if (footEl) footEl.style.display = "none";
      return;
    }
    if (footEl) footEl.style.display = "block";

    itemsEl.innerHTML = cart.map((item) => `
      <div class="cart-item">
        <img src="${imgPath(item.image)}" alt="${item.name}">
        <div class="ci-info">
          <h5>${item.name}</h5>
          <div class="ci-meta">Talla: ${item.size} · ${fmt(item.price)}</div>
          <div class="qty-stepper">
            <button data-qty-minus="${item.key}" aria-label="Restar">−</button>
            <span>${item.qty}</span>
            <button data-qty-plus="${item.key}" aria-label="Sumar">+</button>
            <button class="remove-link" data-remove="${item.key}">Eliminar</button>
          </div>
        </div>
      </div>
    `).join("");

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const subEl = document.getElementById("cart-subtotal-value");
    if (subEl) subEl.textContent = fmt(subtotal);

    itemsEl.querySelectorAll("[data-qty-plus]").forEach((b) => b.addEventListener("click", () => updateQty(b.dataset.qtyPlus, 1)));
    itemsEl.querySelectorAll("[data-qty-minus]").forEach((b) => b.addEventListener("click", () => updateQty(b.dataset.qtyMinus, -1)));
    itemsEl.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => removeItem(b.dataset.remove)));
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

  window.NuvelCart = { addToCart, openCart, closeCart, renderCart, getCart };

  document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    document.querySelectorAll("[data-cart-open]").forEach((b) => b.addEventListener("click", openCart));
    document.getElementById("cart-close")?.addEventListener("click", closeCart);
    document.getElementById("cart-overlay")?.addEventListener("click", closeCart);

    // ===== Modal de checkout (demo sin pasarela de pago) =====
    const checkoutOverlay = document.getElementById("checkout-overlay");
    const checkoutModal = document.getElementById("checkout-modal");
    function openCheckoutModal() {
      checkoutOverlay?.classList.add("open");
      checkoutModal?.classList.add("open");
      lockScroll();
    }
    function closeCheckoutModal() {
      if (!checkoutModal?.classList.contains("open")) return;
      checkoutOverlay?.classList.remove("open");
      checkoutModal?.classList.remove("open");
      unlockScroll();
    }
    document.getElementById("checkout-btn")?.addEventListener("click", openCheckoutModal);
    document.getElementById("checkout-modal-close")?.addEventListener("click", closeCheckoutModal);
    checkoutOverlay?.addEventListener("click", closeCheckoutModal);

    // Mobile menu toggle
    const menuBtn = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    menuBtn?.addEventListener("click", () => {
      const open = mobileMenu?.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
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
      { title: "Faja Moldeadora Invisible (producto)", url: "producto.html", keywords: "faja moldeadora producto comprar talla precio invisible cintura" },
      { title: "Catálogo de fajas", url: "catalogo.html", keywords: "catalogo catálogo fajas moldeadoras tienda" },
      { title: "Sobre Nuvel", url: "sobre-nosotros.html", keywords: "sobre nosotros historia marca quienes somos" },
      { title: "Preguntas frecuentes", url: "faq.html", keywords: "faq preguntas frecuentes dudas ayuda" },
      { title: "Guía de tallas", url: "faq.html#talla", keywords: "talla tallas guia guía medidas s m l xl" },
      { title: "Envíos", url: "envios.html", keywords: "envio envío entrega tiempo plazo" },
      { title: "Devoluciones", url: "devoluciones.html", keywords: "devolucion devolución cambio reembolso" },
      { title: "Privacidad", url: "privacidad.html", keywords: "privacidad datos rgpd" },
      { title: "Términos y condiciones", url: "terminos.html", keywords: "terminos términos condiciones legal" },
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
        searchResults.innerHTML = `<div class="search-empty">No encontramos nada para "${q}". <a href="producto.html" style="text-decoration:underline;">Ver nuestra faja</a> o <a href="faq.html" style="text-decoration:underline;">revisa las preguntas frecuentes</a>.</div>`;
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
      if (e.key === "Escape") { closeSearch(); closeCart(); closeAccount(); closeCheckoutModal(); closeZoom(); }
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

    // Size selector
    let selectedSize = "M";
    document.querySelectorAll("[data-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-size]").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedSize = btn.dataset.size;
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

    // Add to cart (product page)
    document.getElementById("add-to-cart-btn")?.addEventListener("click", () => {
      addToCart({ size: selectedSize, quantity: selectedQty });
    });

    // ===== Comprados juntos habitualmente (bundle) =====
    // Añade una prenda "en bruto" al carrito con talla M por defecto — a
    // diferencia de addToCart(), no depende del producto de la página actual,
    // porque un bundle añade DOS prendas distintas a la vez.
    function addRawItem({ id, name, price, image }) {
      const cart = getCart();
      const key = id + "-M";
      const existing = cart.find((i) => i.key === key);
      if (existing) existing.qty += 1;
      else cart.push({ key, name, size: "M", price, qty: 1, image });
      saveCart(cart);
    }

    document.querySelectorAll(".bundle-box").forEach((box) => {
      const mainPrice = parseFloat(box.dataset.mainPrice);
      const partnerPrice = parseFloat(box.dataset.partnerPrice);
      const pct = parseFloat(box.dataset.discountPct);
      const checkbox = box.querySelector("[data-bundle-toggle]");
      const wasEl = box.querySelector(".bundle-total-was");
      const nowEl = box.querySelector(".bundle-total-now");
      const saveEl = box.querySelector(".bundle-save");

      function refresh() {
        if (checkbox.checked) {
          const total = mainPrice + partnerPrice;
          const bundlePrice = total * (1 - pct / 100);
          wasEl.style.display = "";
          wasEl.textContent = fmt(total);
          nowEl.textContent = fmt(bundlePrice);
          saveEl.style.display = "";
          saveEl.textContent = `Ahorras ${fmt(total - bundlePrice)} (${pct}%) llevando el pack`;
        } else {
          wasEl.style.display = "none";
          nowEl.textContent = fmt(mainPrice);
          saveEl.style.display = "none";
        }
      }
      checkbox?.addEventListener("change", refresh);

      box.querySelector(".bundle-add-btn")?.addEventListener("click", () => {
        // El descuento del pack se reparte proporcionalmente entre las dos
        // prendas, para que lo que se lleva al carrito sea el mismo precio
        // que se le prometió al pack, no la suma sin descontar.
        const factor = checkbox.checked ? 1 - pct / 100 : 1;
        addRawItem({ id: box.dataset.mainId, name: box.dataset.mainName, price: Math.round(mainPrice * factor * 100) / 100, image: box.dataset.mainImg });
        if (checkbox.checked) {
          addRawItem({ id: box.dataset.partnerId, name: box.dataset.partnerName, price: Math.round(partnerPrice * factor * 100) / 100, image: box.dataset.partnerImg });
        }
        openCart();
      });
    });
  });
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

      var foto = btn.dataset.colorShot;
      // Igual que en las miniaturas: hay que quitar "srcset" o el navegador
      // ignora este cambio de "src" y se queda con la foto con la que cargó la página.
      if (principal) { principal.removeAttribute('srcset'); principal.src = foto; }

      // marcar como activa la miniatura correspondiente — las miniaturas apuntan a
      // "images/lg/archivo.jpg" y el color a "images/archivo.jpg", así que se compara
      // por nombre de archivo, no por la ruta completa.
      var fotoFile = foto.split('/').pop();
      document.querySelectorAll('[data-thumb]').forEach(function (t) {
        var thumbFile = (t.dataset.full || '').split('/').pop();
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
