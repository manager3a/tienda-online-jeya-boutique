/* Jeya Boutique — Fase 1 Prototipo
   Solo interacciones de UI (menú, carrito visual, filtros de tarjetas ya visibles).
   Sin conexión a fuente de datos ni checkout real: eso llega en Fase 2. */

(function () {
  'use strict';

  var cartCount = 0;

  function $(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }
  function $all(selector, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(selector));
  }

  // Menú mobile
  var navToggle = $('#navToggle');
  var navMenu = $('#navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    $all('#navMenu a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Filtros de catálogo (solo muestra/oculta tarjetas ya presentes en el prototipo)
  var chips = $all('.chip');
  var cards = $all('.product-card');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      var filter = chip.getAttribute('data-filter');
      cards.forEach(function (card) {
        var match = filter === 'todos' || card.getAttribute('data-cat') === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  // Atajos de categoría desde el menú
  $all('[data-cat]').forEach(function (link) {
    link.addEventListener('click', function () {
      var cat = link.getAttribute('data-cat');
      var chip = $all('.chip').filter(function (c) { return c.getAttribute('data-filter') === cat; })[0];
      if (chip) chip.click();
    });
  });

  // Carrito (visual, contador en memoria — sin persistencia real hasta Fase 2)
  var cartCountEls = ['#cartCount', '#cartCountDesktop'].map(function (sel) { return $(sel); });
  var cartDrawer = $('#cartDrawer');
  var cartBackdrop = $('#cartBackdrop');
  var cartClose = $('#cartClose');
  var toast = $('#toast');
  var toastTimer;

  function updateCartCount() {
    cartCountEls.forEach(function (el) { if (el) el.textContent = String(cartCount); });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2200);
  }

  function openCart() {
    if (!cartDrawer || !cartBackdrop) return;
    cartDrawer.hidden = false;
    cartBackdrop.hidden = false;
    requestAnimationFrame(function () {
      cartDrawer.classList.add('is-open');
      cartBackdrop.classList.add('is-open');
    });
  }

  function closeCart() {
    if (!cartDrawer || !cartBackdrop) return;
    cartDrawer.classList.remove('is-open');
    cartBackdrop.classList.remove('is-open');
    setTimeout(function () {
      cartDrawer.hidden = true;
      cartBackdrop.hidden = true;
    }, 280);
  }

  $all('.navbar__cart').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openCart();
    });
  });
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCart();
  });

  $all('[data-add-cart]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      cartCount += 1;
      updateCartCount();
      var card = btn.closest('.product-card');
      var name = card ? $('.product-card__name', card).textContent : 'Producto';
      showToast(name + ' agregado al carrito');
    });
  });

  // Año en footer
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
