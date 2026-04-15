/* Checkout Page */
(function () {
  var products = PRODUCTS_DATA || [];
  var params = new URLSearchParams(window.location.search);
  var productId = parseInt(params.get('id'));
  var qty = parseInt(params.get('qty')) || 1;
  var product = null;
  var shippingCost = 0;

  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) { product = products[i]; break; }
  }

  if (!product) {
    document.querySelector('.checkout-layout').innerHTML = '<p style="text-align:center;padding:3rem;color:var(--text-muted);">No product selected. <a href="products.html">Browse products</a></p>';
    return;
  }

  // Fill summary
  var sumImg = document.getElementById('sumImg');
  var sumName = document.getElementById('sumName');
  var sumPrice = document.getElementById('sumPrice');
  var sumQtyBadge = document.getElementById('sumQtyBadge');
  var sumSubtotal = document.getElementById('sumSubtotal');
  var sumShipping = document.getElementById('sumShipping');
  var sumTotal = document.getElementById('sumTotal');

  if (sumImg) { sumImg.src = product.images[0] || ''; sumImg.alt = product.title; }
  if (sumName) sumName.textContent = product.title;
  if (sumQtyBadge) sumQtyBadge.textContent = qty;

  function updateTotals() {
    var subtotal = product.price * qty;
    var shipping = document.querySelector('input[name="shipping"]:checked');
    shippingCost = (shipping && shipping.value === 'express') ? 12.99 : 0;
    var total = subtotal + shippingCost;

    if (sumPrice) sumPrice.textContent = '$' + subtotal.toFixed(2);
    if (sumSubtotal) sumSubtotal.textContent = '$' + subtotal.toFixed(2);
    if (sumShipping) sumShipping.textContent = shippingCost > 0 ? '$' + shippingCost.toFixed(2) : 'Free';
    if (sumTotal) sumTotal.textContent = '$' + total.toFixed(2);
  }

  updateTotals();

  // Shipping option toggle
  var shippingOptions = document.querySelectorAll('.shipping-option');
  shippingOptions.forEach(function (opt) {
    opt.addEventListener('click', function () {
      shippingOptions.forEach(function (o) { o.classList.remove('active'); });
      this.classList.add('active');
      this.querySelector('input').checked = true;
      updateTotals();
    });
  });

  // Card number formatting
  var cardNum = document.getElementById('cardNumber');
  if (cardNum) {
    cardNum.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').substring(0, 16);
      var formatted = v.replace(/(\d{4})(?=\d)/g, '$1 ');
      this.value = formatted;
    });
  }

  // Expiry formatting
  var cardExpiry = document.getElementById('cardExpiry');
  if (cardExpiry) {
    cardExpiry.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').substring(0, 4);
      if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
      this.value = v;
    });
  }

  // Pay button
  var payBtn = document.getElementById('payBtn');
  var successModal = document.getElementById('successModal');
  var successOrderId = document.getElementById('successOrderId');

  if (payBtn) {
    payBtn.addEventListener('click', function () {
      // Basic validation
      var email = document.getElementById('email').value.trim();
      var firstName = document.getElementById('firstName').value.trim();
      var lastName = document.getElementById('lastName').value.trim();
      var address = document.getElementById('address').value.trim();
      var city = document.getElementById('city').value.trim();

      if (!email) { alert('Please enter your email address.'); document.getElementById('email').focus(); return; }
      if (!firstName) { alert('Please enter your first name.'); document.getElementById('firstName').focus(); return; }
      if (!lastName) { alert('Please enter your last name.'); document.getElementById('lastName').focus(); return; }
      if (!address) { alert('Please enter your address.'); document.getElementById('address').focus(); return; }
      if (!city) { alert('Please enter your city.'); document.getElementById('city').focus(); return; }

      // Generate order ID
      var orderId = 'RDC-' + Date.now().toString(36).toUpperCase();
      if (successOrderId) successOrderId.textContent = 'Order #' + orderId;
      if (successModal) {
        successModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }
})();
