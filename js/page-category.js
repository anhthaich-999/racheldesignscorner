/* Category Page */
(function () {
  var products = PRODUCTS_DATA || [];
  var params = new URLSearchParams(window.location.search);
  var category = params.get('cat') || 'Coach & Sports';
  var filtered = products.filter(function (p) { return p.category === category; });
  var perPage = 24;
  var shown = 0;

  var grid = document.getElementById('catGrid');
  var titleEl = document.getElementById('catTitle');
  var countEl = document.getElementById('catCount');
  var loadMoreBtn = document.getElementById('catLoadMore');

  if (titleEl) titleEl.textContent = category;
  if (countEl) countEl.textContent = filtered.length + ' products';
  document.title = category + ' — Racheldesignscorner';

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
        '<div class="product-price"><span class="price-sale">$' + p.price.toFixed(2) + '</span></div></div>';
      card.addEventListener('click', (function(id) { return function() { window.location.href = 'product.html?id=' + id; }; })(p.id));
      grid.appendChild(card);
    }
    shown = end;
    if (loadMoreBtn) loadMoreBtn.style.display = (shown < filtered.length) ? 'inline-flex' : 'none';
  }

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  if (loadMoreBtn) loadMoreBtn.addEventListener('click', function () { render(false); });
  render(true);
})();
