/* All Products Page */
(function () {
  var products = PRODUCTS_DATA || [];
  var filtered = products.slice();
  var perPage = 24;
  var shown = 0;
  var currentCat = 'All';
  var searchQuery = '';

  var grid = document.getElementById('pageGrid');
  var filtersEl = document.getElementById('pageFilters');
  var searchEl = document.getElementById('pageSearch');
  var loadMoreBtn = document.getElementById('pageLoadMore');
  var countEl = document.getElementById('productCount');

  // Check URL params for category
  var params = new URLSearchParams(window.location.search);
  if (params.get('cat')) currentCat = params.get('cat');
  var isBestsellers = currentCat === 'bestsellers';

  function init() {
    renderFilters();
    applyFilters();
  }

  function renderFilters() {
    if (!filtersEl) return;
    var cats = {};
    products.forEach(function (p) { cats[p.category] = (cats[p.category] || 0) + 1; });
    var order = ['All','Coach & Sports','Clipboards','Christmas & Ornaments','Christian & Cross','Pet Memorial','Night Lights & Lamps','Wedding & Couples','Teacher Gifts','Other'];
    var html = '';
    order.forEach(function (cat) {
      var count = cat === 'All' ? products.length : (cats[cat] || 0);
      if (count > 0) {
        html += '<button class="filter-btn' + (currentCat === cat ? ' active' : '') + '" data-cat="' + cat + '">' + cat + ' (' + count + ')</button>';
      }
    });
    filtersEl.innerHTML = html;
    filtersEl.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentCat = this.dataset.cat;
        filtersEl.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        applyFilters();
      });
    });
  }

  function applyFilters() {
    var q = searchQuery.toLowerCase();
    filtered = products.filter(function (p) {
      var catOk;
      if (isBestsellers) {
        catOk = p.category === 'Coach & Sports' || p.category === 'Clipboards';
      } else {
        catOk = currentCat === 'All' || p.category === currentCat;
      }
      var searchOk = !q || p.title.toLowerCase().indexOf(q) !== -1;
      return catOk && searchOk;
    });
    var label = isBestsellers ? 'Bestsellers' : (currentCat !== 'All' ? currentCat : '');
    if (countEl) countEl.textContent = filtered.length + ' products' + (label ? ' in ' + label : '');
    render(true);
  }

  function render(reset) {
    if (!grid) return;
    if (reset) { shown = 0; grid.innerHTML = ''; }
    var end = Math.min(shown + perPage, filtered.length);
    for (var i = shown; i < end; i++) {
      var p = filtered[i];
      var card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML =
        '<div class="product-image"><img src="' + (p.images[0]||'') + '" alt="' + esc(p.title) + '" loading="lazy"></div>' +
        '<div class="product-info"><h3 class="product-name">' + esc(p.title) + '</h3>' +
        '<div class="product-price"><span class="price-sale">$' + p.price.toFixed(2) + '</span></div>' +
        '<span class="product-category-tag">' + esc(p.category) + '</span></div>';
      card.addEventListener('click', (function(id) { return function() { window.location.href = 'product.html?id=' + id; }; })(p.id));
      grid.appendChild(card);
    }
    shown = end;
    if (loadMoreBtn) loadMoreBtn.style.display = (shown < filtered.length) ? 'inline-flex' : 'none';
  }

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  if (searchEl) {
    var t;
    searchEl.addEventListener('input', function () {
      clearTimeout(t);
      var self = this;
      t = setTimeout(function () { searchQuery = self.value; applyFilters(); }, 300);
    });
  }
  if (loadMoreBtn) loadMoreBtn.addEventListener('click', function () { render(false); });

  // Modal
  var modal = document.getElementById('productModal');
  var modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', function () { modal.classList.remove('open'); document.body.style.overflow = ''; });
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) { modal.classList.remove('open'); document.body.style.overflow = ''; } });

  init();
})();
