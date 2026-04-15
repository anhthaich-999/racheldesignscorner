/* ==============================================
   Admin — CSV Upload, Parse, Preview, Export
   ============================================== */
(function () {
  var products = [];
  var currentPage = 1;
  var perPage = 50;

  var dropZone = document.getElementById('dropZone');
  var fileInput = document.getElementById('csvFile');
  var statsEl = document.getElementById('adminStats');
  var catBreakdown = document.getElementById('catBreakdown');
  var previewBody = document.getElementById('previewBody');
  var paginationEl = document.getElementById('pagination');
  var exportBtn = document.getElementById('exportBtn');
  var previewSection = document.getElementById('previewSection');
  var toastEl = document.getElementById('toast');

  // ========== CSV PARSER ==========
  function parseCSV(text) {
    var rows = [];
    var i = 0;

    function readField() {
      if (i >= text.length) return '';
      if (text[i] === '"') {
        i++;
        var field = '';
        while (i < text.length) {
          if (text[i] === '"') {
            if (i + 1 < text.length && text[i + 1] === '"') {
              field += '"'; i += 2;
            } else { i++; break; }
          } else { field += text[i]; i++; }
        }
        return field;
      } else {
        var field = '';
        while (i < text.length && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
          field += text[i]; i++;
        }
        return field;
      }
    }

    // Header
    var header = [];
    while (i < text.length && text[i] !== '\n' && text[i] !== '\r') {
      header.push(readField());
      if (i < text.length && text[i] === ',') i++;
    }
    if (text[i] === '\r') i++;
    if (text[i] === '\n') i++;

    // Rows
    while (i < text.length) {
      if (text[i] === '\n' || text[i] === '\r') { i++; continue; }
      var row = {};
      for (var h = 0; h < header.length; h++) {
        row[header[h]] = readField();
        if (h < header.length - 1 && i < text.length && text[i] === ',') i++;
      }
      while (i < text.length && text[i] !== '\n') i++;
      if (text[i] === '\n') i++;
      if (row.TITLE) rows.push(row);
    }
    return rows;
  }

  // ========== CATEGORIZE ==========
  function categorize(title) {
    var t = title.toLowerCase();
    if (/clipboard/.test(t)) return 'Clipboards';
    if (/coach|soccer|baseball|basketball|football|volleyball|hockey|tennis|lacrosse|swimming|wrestling|gymnastics|cheer|softball|rugby|track|golf/.test(t)) return 'Coach & Sports';
    if (/ornament|christmas|xmas|stocking|santa/.test(t)) return 'Christmas & Ornaments';
    if (/christian|cross|faith|bible|prayer|blessing|psalm|verse/.test(t)) return 'Christian & Cross';
    if (/pet|dog|cat|memorial|rainbow.bridge|paw/.test(t)) return 'Pet Memorial';
    if (/teacher|school|educator/.test(t)) return 'Teacher Gifts';
    if (/night.light|lamp|led|crystal.ball/.test(t)) return 'Night Lights & Lamps';
    if (/wedding|couple|bride|groom|anniversary|engagement/.test(t)) return 'Wedding & Couples';
    return 'Other';
  }

  // ========== PROCESS CSV ==========
  function processCSV(text) {
    var rows = parseCSV(text);
    products = rows.map(function (row, idx) {
      var images = [];
      for (var j = 1; j <= 10; j++) {
        var key = 'IMAGE' + j;
        if (row[key] && row[key].trim()) images.push(row[key].trim());
      }
      // Parse variations
      var variations = [];
      if (row['VARIATION 1 NAME'] && row['VARIATION 1 NAME'].trim()) {
        variations.push({
          type: (row['VARIATION 1 TYPE'] || '').trim(),
          name: (row['VARIATION 1 NAME'] || '').trim(),
          values: (row['VARIATION 1 VALUES'] || '').split(',').map(function(v){ return v.trim(); }).filter(Boolean)
        });
      }
      if (row['VARIATION 2 NAME'] && row['VARIATION 2 NAME'].trim()) {
        variations.push({
          type: (row['VARIATION 2 TYPE'] || '').trim(),
          name: (row['VARIATION 2 NAME'] || '').trim(),
          values: (row['VARIATION 2 VALUES'] || '').split(',').map(function(v){ return v.trim(); }).filter(Boolean)
        });
      }

      return {
        id: idx + 1,
        title: (row.TITLE || '').trim(),
        description: (row.DESCRIPTION || '').trim(),
        price: parseFloat(row.PRICE) || 0,
        currency: (row.CURRENCY_CODE || 'USD').trim(),
        quantity: parseInt(row.QUANTITY) || 0,
        images: images,
        tags: (row.TAGS || '').trim(),
        materials: (row.MATERIALS || '').trim(),
        sku: (row.SKU || '').trim(),
        variations: variations,
        category: categorize(row.TITLE || '')
      };
    });

    showToast('Parsed ' + products.length + ' products!');
    renderStats();
    renderCategoryBreakdown();
    currentPage = 1;
    renderTable();
    previewSection.style.display = 'block';
    exportBtn.disabled = false;
  }

  // ========== RENDER STATS ==========
  function renderStats() {
    var cats = {};
    var totalImages = 0;
    products.forEach(function (p) {
      cats[p.category] = (cats[p.category] || 0) + 1;
      totalImages += p.images.length;
    });
    var avgPrice = products.reduce(function (s, p) { return s + p.price; }, 0) / products.length;

    statsEl.innerHTML =
      '<div class="stat-card"><div class="stat-value">' + products.length + '</div><div class="stat-label">Products</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + Object.keys(cats).length + '</div><div class="stat-label">Categories</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + totalImages + '</div><div class="stat-label">Images</div></div>' +
      '<div class="stat-card"><div class="stat-value">$' + avgPrice.toFixed(0) + '</div><div class="stat-label">Avg Price</div></div>';
  }

  function renderCategoryBreakdown() {
    var cats = {};
    products.forEach(function (p) { cats[p.category] = (cats[p.category] || 0) + 1; });
    var html = '';
    var order = ['Coach & Sports','Clipboards','Christmas & Ornaments','Christian & Cross','Pet Memorial','Night Lights & Lamps','Wedding & Couples','Teacher Gifts','Other'];
    order.forEach(function (cat) {
      if (cats[cat]) {
        html += '<span class="cat-chip">' + esc(cat) + '<span class="cat-count">' + cats[cat] + '</span></span>';
      }
    });
    catBreakdown.innerHTML = html;
  }

  // ========== RENDER TABLE ==========
  function renderTable() {
    if (!previewBody) return;
    var start = (currentPage - 1) * perPage;
    var end = Math.min(start + perPage, products.length);
    var html = '';

    for (var i = start; i < end; i++) {
      var p = products[i];
      var hasError = !p.images.length || p.price === 0;
      var variantText = p.variations.map(function(v){ return v.name + ': ' + v.values.length; }).join(', ') || '-';
      html += '<tr' + (hasError ? ' style="background:rgba(231,76,60,0.05)"' : '') + '>' +
        '<td>' + p.id + '</td>' +
        '<td>' + (p.images[0] ? '<img src="' + p.images[0] + '" class="preview-thumb" loading="lazy">' : '<span class="preview-error">No img</span>') + '</td>' +
        '<td><span class="preview-title">' + esc(p.title) + '</span></td>' +
        '<td class="preview-price">$' + p.price.toFixed(2) + '</td>' +
        '<td><span class="preview-cat">' + esc(p.category) + '</span></td>' +
        '<td class="preview-imgs">' + p.images.length + '</td>' +
        '<td style="font-size:11px;color:var(--text-muted)">' + variantText + '</td>' +
        '</tr>';
    }
    previewBody.innerHTML = html;
    renderPagination();
  }

  function renderPagination() {
    var totalPages = Math.ceil(products.length / perPage);
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }
    var html = '<button class="page-btn" onclick="adminPrev()" ' + (currentPage === 1 ? 'disabled' : '') + '>‹ Prev</button>';
    html += '<span class="page-info">Page ' + currentPage + ' of ' + totalPages + '</span>';
    html += '<button class="page-btn" onclick="adminNext()" ' + (currentPage === totalPages ? 'disabled' : '') + '>Next ›</button>';
    paginationEl.innerHTML = html;
  }

  window.adminPrev = function () { if (currentPage > 1) { currentPage--; renderTable(); } };
  window.adminNext = function () {
    var totalPages = Math.ceil(products.length / perPage);
    if (currentPage < totalPages) { currentPage++; renderTable(); }
  };

  // ========== EXPORT ==========
  function exportProductsData() {
    if (!products.length) return;
    var content = 'var PRODUCTS_DATA = ' + JSON.stringify(products, null, 2) + ';\n';
    var blob = new Blob([content], { type: 'application/javascript' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'products-data.js';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded products-data.js! Copy it to js/ folder.');
  }

  // ========== DROP ZONE ==========
  if (dropZone) {
    dropZone.addEventListener('click', function () { fileInput.click(); });

    dropZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', function () {
      dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      var file = e.dataTransfer.files[0];
      if (file) readFile(file);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      if (this.files[0]) readFile(this.files[0]);
    });
  }

  function readFile(file) {
    if (!file.name.endsWith('.csv')) {
      showToast('Please upload a .csv file');
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      processCSV(e.target.result);
    };
    reader.readAsText(file, 'UTF-8');
  }

  // ========== EXPORT BUTTON ==========
  if (exportBtn) {
    exportBtn.addEventListener('click', exportProductsData);
  }

  // ========== TOAST ==========
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(function () { toastEl.classList.remove('show'); }, 3000);
  }

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
})();
