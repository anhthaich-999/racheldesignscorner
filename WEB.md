# WEB.md — Racheldesignscorner Website

> Đọc file này để hiểu toàn bộ kiến trúc, flow, và cách phát triển tiếp website.

---

## 📌 Tổng Quan

- **Brand:** Racheldesignscorner
- **Loại:** E-commerce static website (HTML/CSS/JS thuần, không framework)
- **Sản phẩm:** Handmade ornaments, keepsakes, clipboards, coach gifts, pet memorial, night lights...
- **Domain:** racheldesignscorner.com
- **Data:** 318 sản phẩm từ Etsy CSV, 9 danh mục tự động phân loại

---

## 🌐 Hosting & Deployment

| Mục | Chi tiết |
|-----|---------|
| **Server** | RackNerd VPS — Ubuntu 24.04 LTS |
| **IP** | 192.210.236.27 |
| **SSH** | `ssh root@192.210.236.27` (port 22) |
| **NerdVM Panel** | https://nerdvm.racknerd.com/ (user: vmuser319922) |
| **Web Server** | Nginx |
| **SSL** | Certbot (Let's Encrypt) |
| **Website path** | `/var/www/racheldesignscorner/` |
| **GitHub repo** | https://github.com/anhthaich-999/racheldesignscorner |
| **DMCA** | Đã tích hợp badge + verification |

### Deploy flow:
```
Sửa code trên máy local (D:\tool\wedding-website\)
    ↓
git add . && git commit -m "update" && git push
    ↓
SSH server → cd /var/www/racheldesignscorner && git pull
    ↓
Website live!
```

---

## 🏗️ Kiến Trúc

```
D:\tool\wedding-website\
├── index.html                 # Homepage — hero, products, about, categories, reviews, footer
├── products.html              # All Products — grid 310+ SP, search, filter, load more
├── product.html               # Product Detail — gallery, giá, variants, qty, Buy It Now
├── category.html              # Category — lọc theo danh mục (?cat=X)
├── checkout.html              # Checkout — Shopify-style form + order summary
├── contact.html               # Contact — địa chỉ Singapore + form liên hệ
├── privacy.html               # Privacy Policy
├── refund.html                # Refund Policy
├── terms.html                 # Terms of Service
├── admin.html                 # 🔧 Admin — Upload CSV cập nhật sản phẩm
├── dmca-validation.html       # DMCA verification file
├── deploy.sh                  # Server setup script (đã chạy)
│
├── css/
│   ├── variables.css          # CSS variables — dark/light theme colors, spacing, fonts
│   ├── base.css               # Reset, typography, scrollbar, focus styles
│   ├── layout.css             # Container, grid, responsive utilities
│   ├── theme.css              # Dark/light theme transition helpers
│   ├── utilities.css          # Buttons, badges, scroll reveal, overlay
│   └── components/
│       ├── announcement.css   # Announcement bar (top banner)
│       ├── header.css         # Sticky header + mobile hamburger drawer
│       ├── hero.css           # Hero slideshow
│       ├── highlights.css     # USP bar (Free Shipping, Handmade, etc.)
│       ├── products.css       # Featured grid + product cards + modal
│       ├── collections.css    # Category cards grid
│       ├── reviews.css        # Review cards grid
│       ├── footer.css         # Footer 4-column + bottom bar
│       ├── page.css           # Product detail, contact form, policy, variants, qty/buy
│       ├── checkout.css       # Checkout form + order summary
│       ├── admin.css          # Admin upload page
│       └── video.css          # (unused — video section removed)
│
├── js/
│   ├── theme-toggle.js        # Dark/light mode — runs before render, saves to localStorage
│   ├── header.js              # Sticky scroll, hamburger menu, announcement close, active nav
│   ├── slideshow.js           # Hero auto-play 5s, fade transition, dots
│   ├── animations.js          # Scroll reveal with IntersectionObserver
│   ├── app.js                 # Main entry point
│   ├── products-data.js       # 📦 ALL PRODUCT DATA (var PRODUCTS_DATA = [...]) ~1.1MB
│   ├── products.js            # (legacy — dynamic product loader, not used on homepage)
│   ├── page-products.js       # All Products page logic — filter, search, load more
│   ├── page-product.js        # Product detail page — gallery, variants, qty, buy now
│   ├── page-category.js       # Category page — filter by category
│   ├── page-checkout.js       # Checkout — order summary, form validation, pay
│   └── admin.js               # Admin CSV upload — parse, preview, merge/replace, export
│
├── data/
│   └── products.json          # Raw JSON (310 products) — backup, not used at runtime
│
└── WEB.md                     # 📖 This file
```

---

## 🎨 Theme System

### Dark theme (mặc định):
```
--bg-primary: #0a0a0a     --text-primary: #f0f0f0
--bg-card: #1a1a1a        --accent: #c9a96e (gold)
--border: #333333         --accent-hover: #d4b97a
```

### Light theme:
```
--bg-primary: #ffffff     --text-primary: #1a1a1a
--bg-card: #f8f8f8        --accent: #8B6914
--border: #e0e0e0
```

- Toggle button 🌙/☀️ trong header
- Lưu preference vào `localStorage('theme')`
- `theme-toggle.js` chạy trước render để tránh flash

---

## 📦 Product Data

### Cấu trúc 1 product trong `products-data.js`:
```javascript
{
  id: 1,                        // Auto-increment ID
  title: "Product Name",
  description: "Full description...",
  price: 28.00,
  currency: "USD",
  quantity: 100,
  images: [                     // Tối đa 10 ảnh từ Etsy CDN
    "https://i.etsystatic.com/...",
    "https://i.etsystatic.com/..."
  ],
  tags: "tag1,tag2,tag3",
  materials: "wood,acrylic",
  sku: "SKU-001",
  variations: [                 // Variants (size, color, etc.)
    {
      type: "...",
      name: "Size",
      values: ["Small", "Medium", "Large"]
    },
    {
      type: "...",
      name: "Color",
      values: ["Red", "Blue"]
    }
  ],
  category: "Coach & Sports"    // Auto-categorized
}
```

### 9 Categories (auto-detect từ title):
| Category | Keywords | Count |
|----------|----------|-------|
| Coach & Sports | coach, soccer, baseball, basketball... | ~89 |
| Clipboards | clipboard | ~70 |
| Christmas & Ornaments | ornament, christmas, xmas | ~33 |
| Pet Memorial | pet, dog, cat, memorial, paw | ~25 |
| Night Lights & Lamps | night light, lamp, led, crystal ball | ~21 |
| Wedding & Couples | wedding, couple, bride, anniversary | ~17 |
| Christian & Cross | christian, cross, faith, bible | varies |
| Teacher Gifts | teacher, school, educator | varies |
| Other | everything else | varies |

### Cách thêm sản phẩm mới:
1. Mở `admin.html` trong trình duyệt
2. Chọn **➕ Thêm sản phẩm mới** (merge) hoặc **🔄 Thay thế** (replace)
3. Kéo thả CSV (Etsy format) vào
4. Preview → Download `products-data.js`
5. Copy vào `js/` thay file cũ
6. `git add . && git commit -m "update products" && git push`
7. SSH server → `cd /var/www/racheldesignscorner && git pull`

---

## 📄 Chi Tiết Từng Trang

### Homepage (index.html)
- **Announcement bar** — gold background, marquee trên mobile
- **Header** — sticky, blur, logo + nav + theme toggle + hamburger mobile
- **Hero** — 2 slides auto-play 5s, background image từ ibb.co
- **Highlights** — 4 USPs: Free Shipping, Handmade, Subscribe, Follow Us
- **Featured Products** — 6 sản phẩm Coach & Sports (hardcoded, IDs 312-317)
- **About Us** — 3 đoạn mô tả shop
- **Categories** — 6 collection cards → link tới category.html
- **Reviews** — 6 review cards (Pet Memorial, Clipboard, Night Lights...)
- **Footer** — 4 cột: Menu, Categories, Social, Subscribe + DMCA badge

### All Products (products.html)
- Load data từ `js/products-data.js` (biến global `PRODUCTS_DATA`)
- Category filter buttons (pill shape, gold)
- Search bar
- Grid 4 cột desktop / 2 cột mobile
- Load More 24 items/lần
- Hỗ trợ `?cat=bestsellers` → filter Coach & Sports + Clipboards
- Click product → `product.html?id=X`

### Product Detail (product.html)
- URL params: `?id=X`
- Gallery: main image + thumbnail row (click đổi ảnh)
- Title, Price (gold), Category tag (click → category page)
- **Variant selectors** (dropdown) — từ CSV VARIATION 1/2
- **Quantity** — nút −/+ 
- **Buy It Now** → redirect tới `checkout.html?id=X&qty=Y`
- Full description
- Tags (pill badges)
- Breadcrumb: Home > All Products > Category

### Category (category.html)
- URL params: `?cat=Category+Name`
- Grid sản phẩm chỉ từ category đó
- Load More
- Click → product.html

### Checkout (checkout.html)
- URL params: `?id=X&qty=Y`
- **Cột trái:** Email, Delivery (name, address, city, state, zip, phone), Shipping (Standard free / Express $12.99), Payment (card number, expiry, CVV)
- **Cột phải:** Order summary (thumbnail, name, qty, subtotal, shipping, total)
- **Pay Now** → success modal với order ID
- Mobile: 1 cột, summary trên cùng
- ⚠️ Frontend only — không có backend xử lý payment thật

### Admin (admin.html)
- Load `products-data.js` để đếm sản phẩm hiện tại
- 2 chế độ: **Merge** (thêm mới) / **Replace** (thay hết)
- CSV parser hỗ trợ quoted fields, newlines, 24 columns
- Auto-categorize dựa trên title keywords
- Preview table: thumbnail, title, price, category, images, variants
- Pagination 50 items/page
- Export `products-data.js` → download
- Hướng dẫn step-by-step trên trang

### Policy Pages (privacy.html, refund.html, terms.html)
- Static content
- Refund: 14 days return, 30 days ship back
- Address: 470 NORTH BRIDGE ROAD #05-12 BUGIS CUBE Singapore 188735

### Contact (contact.html)
- Shop address + description
- Contact form (name, email, subject, message) → alert on submit

---

## 🔗 Navigation Map

```
Header: Home | Bestsellers | All Products | Reviews | About | Contact
                  ↓               ↓            ↓        ↓       ↓
         products.html?    products.html   index.html  index   contact
         cat=bestsellers                   #reviews    #about   .html

Footer Menu: Home, Bestsellers, All Products, Reviews, About, Contact
Footer Categories: Coach & Sports, Clipboards, Christmas, Pet Memorial, Night Lights, Wedding
Footer Policy: Privacy, Refund, Terms
Footer: DMCA badge, Address, Copyright, Payment icons

Homepage:
  Hero → #products / #collections
  Featured Products (6) → product.html?id=312-317
  Categories (6) → category.html?cat=X
  
Product → Buy It Now → checkout.html?id=X&qty=Y → Pay Now → Success
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Áp dụng |
|------------|---------|
| ≤ 480px | Small mobile: grid 2 col, smaller fonts |
| ≤ 768px | Mobile: hamburger menu, hero 50vh, grid 2 col, footer stack |
| ≤ 1024px | Tablet: hamburger menu, grid 3 col |
| > 1024px | Desktop: full nav, grid 3-4 col |

---

## 🔧 Server Commands

```bash
# SSH vào server
ssh root@192.210.236.27

# Update website
cd /var/www/racheldesignscorner && git pull

# Restart Nginx
systemctl restart nginx

# Cài SSL (chỉ cần 1 lần, sau khi DNS trỏ xong)
certbot --nginx -d racheldesignscorner.com -d www.racheldesignscorner.com --agree-tos -m email@example.com

# Xem Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Nginx config location
/etc/nginx/sites-available/racheldesignscorner
```

---

## 🚀 Hướng Phát Triển Tiếp

### Có thể thêm:
1. **SSL HTTPS** — chạy certbot sau khi trỏ domain
2. **Google Analytics** — thêm tracking code vào head
3. **Facebook Pixel** — remarketing ads
4. **Live chat** — Tawk.to hoặc Crisp (free)
5. **Blog section** — SEO content
6. **Wishlist** — lưu localStorage
7. **Cart** — multi-product cart trước checkout
8. **Backend API** — Node.js/Express để xử lý order thật
9. **Payment gateway** — Stripe/PayPal integration
10. **Email notifications** — order confirmation emails
11. **Product search** — thêm lại search bar nếu cần
12. **Image optimization** — resize/compress Etsy images
13. **Sitemap.xml** — SEO
14. **Robots.txt** — SEO
15. **PWA** — Progressive Web App cho mobile

### Khi thêm tính năng:
1. Sửa code trong `D:\tool\wedding-website\`
2. Test local (mở file HTML trong browser)
3. `git add . && git commit -m "mô tả" && git push`
4. SSH → `cd /var/www/racheldesignscorner && git pull`
5. **Luôn update file WEB.md này** khi thay đổi kiến trúc

---

## ⚠️ Lưu Ý Quan Trọng

- `products-data.js` ~1.1MB — file lớn nhất, chứa toàn bộ data sản phẩm
- Khi upload CSV mới qua admin, chọn **Merge** để không mất data cũ
- Website là static — checkout chỉ là UI demo, không xử lý payment thật
- Ảnh sản phẩm host trên Etsy CDN (`i.etsystatic.com`) — miễn phí, nhanh
- Server RackNerd $11/năm — nhớ gia hạn
- SSL cần cài sau khi domain DNS đã trỏ xong
