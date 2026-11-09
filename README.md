# Meridian & Stone

A frontend-only real estate site for a fictional private brokerage. Pure HTML, CSS, and vanilla JavaScript — no build step, no dependencies, no framework. Designed to be deployed as static files anywhere.

> Demo site — built for illustration only. All residences, agents, and testimonials are fictional.

---

## Table of contents

- [What's in it](#whats-in-it)
- [Pages](#pages)
- [Project structure](#project-structure)
- [Running locally](#running-locally)
- [Deploying](#deploying)
  - [GitHub Pages](#github-pages)
  - [Cloudflare Pages](#cloudflare-pages)
  - [Netlify Drop](#netlify-drop)
- [Feature notes](#feature-notes)
- [State & persistence](#state--persistence)
- [Editing the data](#editing-the-data)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Credits](#credits)
- [License](#license)

---

## What's in it

- **Multi-page static site** — no SPA router, no build step.
- **Vanilla JS, ~900 lines** — data, rendering, filters, favorites, compare, forms, modals, animations all in one file.
- **No dependencies** — no npm, no bundler, no React/Vue. Google Fonts is the only external asset.
- **Theming via CSS custom properties** — change the palette in `:root` and the whole site follows.
- **Persistent client state** — favorites, compare list, and recently viewed are stored in `localStorage` so they survive page navigation and reloads.
- **Accessible by default** — skip links, focus traps on modals, `aria-expanded` on menus and FAQ, keyboard dismiss for all overlays.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, hero search, stats strip, featured grid, newsletter |
| `listings.html` | Full collection with keyword / type / bedrooms / price-range filters and sort |
| `agents.html` | Featured agents grid |
| `about.html` | Company story, leadership team, testimonials carousel, FAQ accordion |
| `journal.html` | Journal grid (demo articles) |
| `contact.html` | Contact form + social links |
| `booking.html` | Private viewing request form |
| `upload.html` | "List a Property" submission form (front-end demo only) |

Every page shares the same shell: skip link → loader → toast stack → compare dock → mobile backdrop → nav header → `<main>` → footer → back-to-top → property/compare/fav modals → script.

---

## Project structure

├── index.html
├── listings.html
├── agents.html
├── about.html
├── journal.html
├── contact.html
├── booking.html
├── upload.html
├── styles.css
├── script.js
└── README.md


No subfolders, no assets to bundle. Every page references `styles.css` and `script.js` with relative paths, so the whole thing can be dropped into any static host root.

---

## Running locally

Because every page is pure static HTML, you can open `index.html` directly in a browser. Two caveats:

1. **`file://` protocol** — some browsers block `localStorage` access and the Google Maps iframe on `file://`. For a reliable local preview, serve over HTTP.
2. **Hero search and compare dock** rely on cross-page `localStorage`, so they need a real origin.

Serve locally with any of these:

```bash
# Python 3
python3 -m http.server 8000

# Node (no install)
npx serve .

# PHP
php -S localhost:8000

Feature notes
Hero search → listings hand-off
The hero search on index.html collects keyword, type, beds, and price into localStorage under ms_search, then redirects to listings.html. initFilters() reads that key on load, applies the values to the filter controls, and clears the key. The price is applied to the range slider (#filterPriceRange), not a dropdown.

Favorites
Every property card has a heart button. Toggling it pushes/removes the ID from state.favorites and re-renders the count badge in the nav. The full saved list is shown in the #favModal panel, reachable from the nav heart icon.

Compare
Up to 3 properties can be compared. The dock at the bottom of every page shows the current selection with thumbnails and a "View comparison" button. Clicking it opens a table modal with side-by-side specs (photo, residence, location, price, type, bedrooms, bathrooms, size, year built).

Recently viewed
Opening a property modal records its ID in state.recent (max 8). listings.html renders them in a horizontal rail below the main grid, hidden when empty.

Forms
booking.html, contact.html, upload.html, and the homepage newsletter form all validate on the client:

Required fields → inline error under the field + has-error class on the .field wrapper

Email → regex check

Phone → permissive pattern (7+ digits with optional +, spaces, parens, dots, hyphens)

Date → rejects past dates

All forms are front-end demos. No network request is made. On success they show a toast and reset. To make them live, replace the submit handlers in script.js (initBookingForm, initContactForm, initUploadForm, initNewsletterForm) with fetch calls to your endpoint of choice.

Upload form (demo)
upload.html collects a property submission. On submit it:

Validates title, location, price, contact email.

Constructs a new property object and pushes it onto the in-memory PROPERTIES array.

Re-renders the listings and featured grids so the new property appears in the current session only.

Nothing is persisted — a page reload resets it. This is intentional, so you can try the flow without worrying about state.

Animations
Loader fades out on window.load with a 3s safety fallback.

Stats counters animate from 0 to their target when scrolled into view (IntersectionObserver).

[data-reveal] elements fade up on scroll.

Property cards use a CSS keyframe (cardIn) on render.

Hero image has a slow zoom (heroZoom) that alternates on a 22s cycle.

All animations respect prefers-reduced-motion: reduce.

State & persistence
Everything the site remembers lives in localStorage under these keys:

Key	Holds	Managed by
ms_favorites	Array of property IDs	toggleFavorite()
ms_compare	Array of property IDs (max 3)	toggleCompare()
ms_recent	Array of property IDs (max 8)	addRecent()
ms_search	Object with keyword, type, beds, price	initHeroSearch() writes, initFilters() reads and clears
To reset everything, open DevTools → Application → Local Storage → delete the keys starting with ms_.

Editing the data
All site content lives as plain JavaScript arrays at the top of script.js:

PROPERTIES — the 12 sample residences

AGENTS — 4 agent cards on the agents page

TEAM — 4 leadership cards on the about page

TESTIMONIALS — the carousel on the about page

FAQS — the accordion on the about page

JOURNAL — the 6 cards on the journal page

MAP_REGIONS — the map legend (only used if you add a map section)

IMG — the curated Unsplash IDs used across the site

Property object shape:
{
  id: 'p1',                  // must be unique
  title: 'The Glasshouse',
  type: 'villa',             // villa | penthouse | estate | cabin | apartment
  city: 'Malibu',
  region: 'California',
  price: 8250000,            // integer, USD
  beds: 5,
  baths: 6,
  size: 6200,                // sq ft
  year: 2021,
  tag: 'Featured',           // 'Featured' | 'New' | '' — controls the card badge and the homepage featured grid
  lat: 'Malibu, CA',         // string passed to Google Maps embed
  images: [ ... ],           // array of URLs; index 0 is the card thumbnail
  description: '…',
  amenities: [ ... ]         // array of strings
}
To add a property, append it to PROPERTIES and reload. No template edits required.

To change the color palette, edit the :root block at the top of styles.css. Every component reads from those variables.

Accessibility
Skip-to-content link on every page, visible on first Tab.

<main id="main"> landmark wraps page content; <header> and <footer> are outside it.

Focus management — opening a modal moves focus to its close button; closing returns focus to the element that opened it.

Focus trap — Tab and Shift+Tab cycle inside the open modal; Escape closes.

aria-expanded on the mobile menu burger and FAQ accordion buttons.

aria-controls on the burger, pointing at #navLinks.

aria-label on every icon-only button (fav, burger, back-to-top, carousel arrows, social links).

Reduced motion — all animations are disabled under prefers-reduced-motion: reduce.

Contrast — body copy (--sage) is set to #55635B on ivory, ~5.1:1 (WCAG AA). Brass buttons use a darkened focus ring with white halo so the ring is visible on both light and dark backgrounds.

Known gaps for a production build:

Hero image has alt="" (decorative) — intentional.

Google Maps iframes in the property modal have a title but rely on Google's own accessibility, which is limited.

Form validation messages are not announced via aria-live — the toast stack is, but per-field errors aren't. If that matters, wrap the .field__error spans in an aria-live="polite" region.

Browser support
Tested on and designed for:

Chrome / Edge 105+

Firefox 121+

Safari 15.4+

Uses :has() for one layout rule (lifting the back-to-top button above the compare dock). If you need older browser support, replace body:has(.compare-dock.is-visible) .back-to-top in styles.css with a JS-toggled class on <body> — everything else already works on any evergreen browser.

IntersectionObserver, localStorage, classList, dataset, :focus-visible, backdrop-filter, and CSS custom properties are all required.

Credits
Type — Fraunces, Inter, Space Mono via Google Fonts.

Photography — Unsplash (curated IDs hardcoded in IMG). Picsum is used as an automatic fallback if an Unsplash ID fails.

Maps — Google Maps embed via https://www.google.com/maps?q=…&output=embed.

Icons — hand-drawn inline SVG; no icon library.

License
This is a demo project. The code is free to copy, modify, and reuse. The fictional brand "Meridian & Stone" and all residence, agent, and testimonial content are illustrative and not associated with any real business.

