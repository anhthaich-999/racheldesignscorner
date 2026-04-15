# 💒 Wedding by Eli — Static Website

A beautiful, fully responsive static wedding accessories shop website with dark/light theme support.

## Features

- **Dark theme by default** with smooth light/dark toggle (🌙/☀️)
- **Fully responsive** — mobile, tablet, desktop
- **9 polished sections**: Announcement, Header, Hero Slideshow, Highlights, Featured Products, Video, Collections, Reviews, Footer
- **CSS component architecture** — split into modular files
- **Vanilla JS** — no frameworks, no dependencies
- **Scroll reveal animations** via IntersectionObserver
- **Auto-playing hero slideshow** with fade transitions
- **Sticky header** with blur backdrop + mobile hamburger drawer

## Quick Start

Just open `index.html` in any browser. No server needed!

```bash
# Or use a simple server for best experience:
npx serve .
# or
python -m http.server 8000
```

## Project Structure

```
├── index.html              # All 9 sections inline
├── css/
│   ├── variables.css       # Theme CSS variables
│   ├── base.css            # Reset & typography
│   ├── layout.css          # Grid & responsive utils
│   ├── theme.css           # Theme transition helpers
│   ├── utilities.css       # Buttons, badges, helpers
│   └── components/         # Per-section styles
│       ├── announcement.css
│       ├── header.css
│       ├── hero.css
│       ├── highlights.css
│       ├── products.css
│       ├── video.css
│       ├── collections.css
│       ├── reviews.css
│       └── footer.css
├── js/
│   ├── app.js              # Main entry
│   ├── theme-toggle.js     # Dark/light switcher
│   ├── slideshow.js        # Hero slideshow
│   ├── header.js           # Sticky header + mobile menu
│   └── animations.js       # Scroll reveal
└── README.md
```

## Design

- **Dark theme**: bg `#0a0a0a`, cards `#1a1a1a`, accent gold `#c9a96e`
- **Light theme**: bg `#ffffff`, cards `#f8f8f8`, accent `#8B6914`
- **Font**: System font stack (Segoe UI, etc.)
- **Images**: Unsplash placeholders (replace with your own)

## Customization

- Edit CSS variables in `css/variables.css` to change colors, spacing, fonts
- Replace placeholder images with real product photos
- Update product names, prices, and reviews in `index.html`

---

Built with ❤️ for Wedding by Eli
