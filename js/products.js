/* ==============================================
   Products — Dynamic loader, filter, search, modal
   ============================================== */
(function () {
  var products = [];
  var filtered = [];
  var currentCategory = 'All';
  var searchQuery = '';
  var perPage = 24;
  var shown = 0;

  var grid = document.getElementById('productsGrid');
  var filtersEl = document.getElementById('productFilters');
  var loadMoreBtn = document.getElementById('loadMoreBtn');
  var featuredCarousel = document.getElementById('featuredCarousel');
  var carouselPrev = document.getElementById('carouselPrev');
  var carouselNext = document.getElementById('carouselNext');
  var modal = document.getElementById('productModal');
  var modalClose = document.getElementById('modalClose');
  var modalMainImg = document.getElementById('modalMainImg');
  var modalThumbs = document.getElementById('modalThumbs');
  var modalTitle = document.getElementById('modalTitle');
  var modalPrice = document.getElementById('modalPrice');
  var modalDesc = document.getElementById('modalDesc');

  // Category order
  var categoryOrder = [
    'All', 'Coach & Sports', 'Clipboards', 'Christmas & Ornaments',
    'Christian & Cross', 'Pet Memorial', 'Night Lights & Lamps',
    'Wedding & Couples', 'Teacher Gifts', 'Other'
  ];

  function fetchProducts() {
    fetch('data/products.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        products = data;
        filtered = products.slice();
        renderCarousel();
        renderFilters();
        renderProducts(true);
      })
      .catch(function (err) {
        console.error('Failed to load products:', err);
        if (grid) grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem;">Failed to load products. Make sure to serve via a local server.</p>';
      });
  }

  function renderFilters() {
    if (!filtersEl) return;
    var cats = {};
    products.forEach(function (p) { cats[p.category] = (cats[p.category] || 0) + 1; });

    var html = '';
    categoryOrder.forEach(function (cat) {
      if (cat === 'All') {
        html += '<button class="filter-btn' + (currentCategory === 'All' ? ' active' : '') + '" data-cat="All">All (' + products.length + ')</button>';
      } else if (cats[cat]) {
        html += '<button class="filter-btn' + (currentCategory === cat ? ' active' : '') + '" data-cat="' + cat + '">' + cat + ' (' + cats[cat] + ')</button>';
      }
    });
    filtersEl.innerHTML = html;

    filtersEl.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentCategory = this.dataset.cat;
        filtersEl.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        applyFilters();
      });
    });
  }

  function renderCarousel() {
    if (!featuredCarousel) return;
    var coachProducts = products.filter(function (p) { return p.category === 'Coach & Sports'; }).slice(0, 6);
    var html = '';
    coachProducts.forEach(function (p, i) {
      html +=
        '<div class="product-card" data-carousel-idx="' + i + '">' +
          '<div class="product-image">' +
            '<img src="' + (p.images[0] || '') + '" alt="' + escapeHtml(p.title) + '" loading="lazy">' +
          '</div>' +
          '<div class="product-info">' +
            '<h3 class="product-name">' + escapeHtml(p.title) + '</h3>' +
            '<div class="product-price"><span class="price-sale">$' + p.price.toFixed(2) + '</span></div>' +
          '</div>' +
        '</div>';
    });
    featuredCarousel.innerHTML = html;

    // Click to open modal
    featuredCarousel.querySelectorAll('.product-card').forEach(function (card, i) {
      card.addEventListener('click', function () {
        var idx = products.indexOf(coachProducts[i]);
        if (idx !== -1) { filtered = products; openModal(idx); }
      });
    });

    // Carousel arrows
    if (carouselPrev) {
      carouselPrev.addEventListener('click', function () {
        featuredCarousel.scrollBy({ left: -300, behavior: 'smooth' });
      });
    }
    if (carouselNext) {
      carouselNext.addEventListener('click', function () {
        featuredCarousel.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  }

  function applyFilters() {
    filtered = products.filter(function (p) {
      var catMatch = currentCategory === 'All' || p.category === currentCategory;
      return catMatch;
    });
    renderProducts(true);
  }

  function renderProducts(reset) {
    if (!grid) return;
    if (reset) {
      shown = 0;
      grid.innerHTML = '';
    }
    var end = Math.min(shown + perPage, filtered.length);
    var fragment = document.createDocumentFragment();

    for (var i = shown; i < end; i++) {
      var p = filtered[i];
      var card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.index = i;

      var imgSrc = p.images[0] || '';
      var shortDesc = p.description ? p.description.substring(0, 120) : '';
      if (shortDesc.length >= 120) shortDesc += '...';

      card.innerHTML =
        '<div class="product-image">' +
          '<img src="' + imgSrc + '" alt="' + escapeHtml(p.title) + '" loading="lazy">' +
        '</div>' +
        '<div class="product-info">' +
          '<h3 class="product-name">' + escapeHtml(p.title) + '</h3>' +
          '<div class="product-price">' +
            '<span class="price-sale">$' + p.price.toFixed(2) + '</span>' +
          '</div>' +
          '<span class="product-category-tag">' + escapeHtml(p.category) + '</span>' +
        '</div>';

      card.addEventListener('click', (function (idx) {
        return function () { openModal(idx); };
      })(i));

      fragment.appendChild(card);
    }

    grid.appendChild(fragment);
    shown = end;

    if (loadMoreBtn) {
      loadMoreBtn.style.display = (shown < filtered.length) ? 'inline-flex' : 'none';
    }

    // Update subtitle count
    var subtitle = document.querySelector('.products-section .section-subtitle');
    if (subtitle) {
      subtitle.textContent = filtered.length + ' handcrafted items' + (currentCategory !== 'All' ? ' in ' + currentCategory : '');
    }
  }

  function openModal(idx) {
    var p = filtered[idx];
    if (!p || !modal) return;

    modalTitle.textContent = p.title;
    modalPrice.textContent = '$' + p.price.toFixed(2) + ' ' + p.currency;
    modalDesc.innerHTML = p.description ? p.description.replace(/\n/g, '<br>') : 'No description available.';

    // Main image
    modalMainImg.src = p.images[0] || '';
    modalMainImg.alt = p.title;

    // Thumbnails
    modalThumbs.innerHTML = '';
    p.images.forEach(function (img, i) {
      var thumb = document.createElement('img');
      thumb.src = img;
      thumb.alt = 'Image ' + (i + 1);
      thumb.className = 'thumb' + (i === 0 ? ' active' : '');
      thumb.addEventListener('click', function () {
        modalMainImg.src = img;
        modalThumbs.querySelectorAll('.thumb').forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
      });
      modalThumbs.appendChild(thumb);
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event listeners
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      renderProducts(false);
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Init
  document.addEventListener('DOMContentLoaded', fetchProducts);
})();
