/* Product Detail Page */
(function () {
  var products = PRODUCTS_DATA || [];
  var params = new URLSearchParams(window.location.search);
  var productId = parseInt(params.get('id'));
  var product = null;

  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) { product = products[i]; break; }
  }

  if (!product) {
    document.getElementById('productDetail').innerHTML = '<p style="text-align:center;padding:3rem;color:var(--text-muted);">Product not found.</p>';
    return;
  }

  document.title = product.title + ' — Racheldesignscorner';

  // Breadcrumb
  var breadcrumbCat = document.getElementById('breadcrumbCat');
  if (breadcrumbCat) {
    breadcrumbCat.innerHTML = '<a href="category.html?cat=' + encodeURIComponent(product.category) + '">' + esc(product.category) + '</a>';
  }

  // Title
  var titleEl = document.getElementById('pdTitle');
  if (titleEl) titleEl.textContent = product.title;

  // Price
  var priceEl = document.getElementById('pdPrice');
  if (priceEl) priceEl.textContent = '$' + product.price.toFixed(2) + ' ' + product.currency;

  // Category
  var catEl = document.getElementById('pdCategory');
  if (catEl) {
    catEl.textContent = product.category;
    catEl.addEventListener('click', function () {
      window.location.href = 'category.html?cat=' + encodeURIComponent(product.category);
    });
  }

  // Description
  var descEl = document.getElementById('pdDesc');
  if (descEl) descEl.innerHTML = product.description ? product.description.replace(/\n/g, '<br>') : 'No description available.';

  // Main image
  var mainImg = document.getElementById('pdMainImg');
  if (mainImg && product.images.length > 0) {
    mainImg.src = product.images[0];
    mainImg.alt = product.title;
  }

  // Thumbnails
  var thumbsEl = document.getElementById('pdThumbs');
  if (thumbsEl && product.images.length > 1) {
    product.images.forEach(function (img, idx) {
      var thumb = document.createElement('img');
      thumb.src = img;
      thumb.alt = 'Image ' + (idx + 1);
      if (idx === 0) thumb.className = 'active';
      thumb.addEventListener('click', function () {
        mainImg.src = img;
        thumbsEl.querySelectorAll('img').forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
      });
      thumbsEl.appendChild(thumb);
    });
  }

  // Tags
  var tagsEl = document.getElementById('pdTags');
  if (tagsEl && product.tags) {
    var tags = product.tags.split(',');
    tags.forEach(function (tag) {
      tag = tag.trim().replace(/_/g, ' ');
      if (tag) {
        var span = document.createElement('span');
        span.className = 'pd-tag';
        span.textContent = tag;
        tagsEl.appendChild(span);
      }
    });
  }

  // Variants
  var variantsEl = document.getElementById('pdVariants');
  if (variantsEl && product.variations && product.variations.length > 0) {
    var vhtml = '';
    product.variations.forEach(function (v, idx) {
      vhtml += '<div class="pd-variant-group">';
      vhtml += '<label class="pd-variant-label">' + esc(v.name) + '</label>';
      vhtml += '<select class="pd-variant-select" id="variant' + idx + '">';
      v.values.forEach(function (val) {
        vhtml += '<option value="' + esc(val) + '">' + esc(val) + '</option>';
      });
      vhtml += '</select></div>';
    });
    variantsEl.innerHTML = vhtml;
  }

  // Quantity buttons
  var qtyInput = document.getElementById('pdQty');
  var qtyMinus = document.getElementById('qtyMinus');
  var qtyPlus = document.getElementById('qtyPlus');
  var buyNowBtn = document.getElementById('buyNowBtn');

  if (qtyMinus) qtyMinus.addEventListener('click', function () {
    var v = parseInt(qtyInput.value) || 1;
    if (v > 1) qtyInput.value = v - 1;
  });
  if (qtyPlus) qtyPlus.addEventListener('click', function () {
    var v = parseInt(qtyInput.value) || 1;
    if (v < 99) qtyInput.value = v + 1;
  });
  if (buyNowBtn) buyNowBtn.addEventListener('click', function () {
    var qty = parseInt(qtyInput.value) || 1;
    window.location.href = 'checkout.html?id=' + productId + '&qty=' + qty;
  });

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
})();
