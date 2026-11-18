# Packup — Website

**Pack. Store. Deliver.** Marketing site + admin for Packup: packaging from verified vendors, stored and delivered for your business.
Brand: Charcoal Navy `#0F2D3D`, Orange `#FF7A00`, Gray `#9CA3AF`, Light `#F7F7F7` · Poppins (headings) + Inter (text).

### What changed in this version (rebrand)
- New logo set in `public/brand` (wordmark with the orange cube "p", icon, favicon, tagline versions, PNG exports).
- New design: navy/orange, flat isometric cube motif, new Home, **Services** (Pack / Store / Deliver), **Packaging**, **Gallery**, For Vendors, About, Contact.
- Old addresses `/solutions` and `/our-work` redirect to `/packaging` and `/gallery`.
- Same admin at `/admin`. On first start with an existing `DATA_DIR`, the old text overrides, colours and "why" points are reset to the new defaults (a copy is kept in `DATA_DIR/backups/content-v1-before-packup-rebrand-*.json`); contact details, images, gallery and settings are kept.
- Text about storage and delivery is a **draft** — edit it in the admin (Page text → Services) so it matches what Packup actually offers.


## Run it
```bash
npm install
npm run build
# copy .env.example to .env and fill in ADMIN_EMAIL + ADMIN_PASSWORD (the server reads .env automatically)
npm start   # site + admin on http://localhost:3000
```
Admin panel: **/admin**. The admin account is created on first start from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (min 10 chars); after that you can remove `ADMIN_PASSWORD` and change the password inside the admin. For design work use `npm run dev` (site, port 5173) together with `npm run server` (API, port 3000).

See **HOSTING.md** for deploying to Hostinger (Node.js Web App).

## Pages
Home · About · Solutions · Showcase (route `/our-work`) · Vendors · Contact (+ 404) · **/admin** (private). Routes are in `src/App.tsx`.

## Content management (admin)
Sign in at `/admin` to edit, with changes live immediately:
- **Page text** — headlines and paragraphs on Home, About, Solutions, Showcase, Vendors, Contact and the closing banner
- **Showcase gallery** — add / edit / reorder / delete items, upload a real photo per item (replaces the illustration)
- **Categories** — titles, descriptions, vendor-offer lists and a photo for each of the six categories
- **Why us** — the "Why Packup" points
- **Contact & social** — email, phone, location, social links
- **Media library** — upload and delete images (JPG/PNG/WebP/AVIF/GIF, 8 MB max)
- **Account** — change password, download a content backup

How it works: `server/` is a small Express API that stores content in `DATA_DIR/content.json` and images in `DATA_DIR/uploads/` (no database to install; last 20 saves are kept in `DATA_DIR/backups/`). It embeds the content into the page it serves, so edited text appears on first paint. Default wording lives in `shared/defaults/` (`copy.json` lists every editable text field — add a field there, then use `useCopy()` in a component to make more text editable). Security: scrypt-hashed password, signed HttpOnly SameSite=Strict cookie, login throttling, CSRF header on all changes, uploads limited to images and served with `nosniff`.

If the site is served as plain static files (no Node server) it still works and simply shows the built-in default content.

## Colours, buttons & theme (admin → Colours & buttons)
Pick a ready-made theme (Espresso & Gold, Midnight, Forest & Brass, Terracotta, Mono) or set each colour by hex / colour picker, then choose button colours and shape (pill, rounded, square). A live preview and a contrast warning (WCAG) are shown before you save. Saved themes apply instantly to the whole public site with no flash on load. "Reset to original" restores the launch palette. Code: `shared/theme.js` (single source), CSS variables in `src/index.css`.

## Speed
Pages load on demand (route-level code splitting), the server gzips everything, fonts load without blocking first paint, and uploaded photos are auto-compressed to WebP in three sizes (640 / 1200 / 1800px) and served with `srcset`. Image compression uses the optional `sharp` package; if it cannot install on the host, the site still works and photos are stored as uploaded.

## Housekeeping (admin → Health & backups)
- **Automatic backups:** a daily snapshot of all content (and a copy of uploaded photos) is kept in `DATA_DIR/backups`; the latest 30 per kind are retained. "Back up now" makes a manual one; "Restore" brings one back (a safety backup is taken first).
- **Download everything:** one zip with content + all photos.
- **Health:** `/api/health` (public, for uptime monitors) returns 200 when the site can read/write its data; the admin tab shows storage, last backup and image-compression status.
- **Privacy page & cookie notice:** `/privacy` is editable in Page text → "Privacy & cookies" (`## ` starts a heading). Replace the [bracketed] placeholders and have it reviewed for your jurisdiction. The cookie notice is off by default (the site sets no tracking cookies); switch it on in Health & backups if you add analytics.

## What you need to fill in before launch
Everything below is now done from `/admin` (no code edits):
| What | Where in admin |
|---|---|
| Business email, phone, office location, social links | Contact & social |
| Our Story (About page) | Page text → About page → "Our story" |
| Real photography | Showcase gallery / Categories |
| Real merchant brands | `src/data/merchants.ts` — current merchants are **fictional samples** (code change) |

No company history, statistics, certifications or vendor-verification claims have been invented.

## Images
All packaging visuals are custom SVG illustrations / a CSS-3D pizza box using fictional sample merchants, labelled "illustrative concept" on the site. Upload real photos in the admin (Showcase gallery or Categories) and they replace the illustration automatically.

## Making the forms work
The Contact and Vendor forms are fully validated on the front end, but the CMS server does not receive them. Until you configure an endpoint, submitting shows a success screen with a visible "Demo mode — nothing was sent" notice (so no lead is silently lost).

To make submissions operational:
1. Create an endpoint that accepts JSON `POST` — e.g. a Formspree / Getform / Basin form, or your own API (Azure Function etc.).
2. Copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT=<your endpoint URL>`.
3. Rebuild. The payload contains `formType`, `name`, `company`, `email`, `phone`, `category` (contact) or `supplies` (vendor), and `message`.

A hidden honeypot field is included as basic spam protection; add rate limiting / CAPTCHA at the endpoint for production.

## Theme & surfaces
- Colour tokens: `tailwind.config.js` (`charcoal` espresso ink, `ivory`, `cream`, `gold`, `ember`, `beige`, `kraft`) and the CSS variables at the top of `src/index.css`.
- Surfaces are defined once in `src/index.css`: `.card` (solid rounded card), `.aurora` (dark panel glow), and the liquid-glass family — `.glass-dark` (over dark backgrounds), `.glass-ink` (darker, for use over light content) and `.glass-light`. Glass is used sparingly: header capsule, hero chips/tiles, Brand Studio panel, vision/mission cards, hover captions and the lightbox.
- Corner radius: cards/tiles use `rounded-[28px]`; large panels `rounded-[2rem]`–`rounded-[3rem]`; buttons and chips are pill-shaped.

## Positioning
Packup connects businesses with verified packaging vendors (**Pack**), holds their stock (**Store**) and arranges delivery (**Deliver**). Packaging illustrations are concepts with fictional sample brands; replace them with real photos from the admin.

## Logo & brand assets
The logo is a gold arch bridge carrying a parcel (customer ⇄ vendor), paired with a serif wordmark and the line "Packaging Vendor Network". Files in `public/brand/`:
- `logo-mark.svg/.png` — emblem only
- `logo-full-dark.svg/.png` (+ `-transparent.png`) — for dark backgrounds
- `logo-full-light.svg/.png` (+ `-transparent.png`) — for light backgrounds
- `logo-icon.svg`, `logo-icon-512.png`, `apple-touch-icon.png` — app/social icon; `public/favicon.svg` is the browser icon
In the site the logo is the React component `src/components/Logo.tsx` (header, footer; `LogoMark` in the loader). SVG text is outlined, so no fonts are needed to use the files.

## Notes
- Fonts (Cormorant Garamond + Manrope) load from Google Fonts in `index.html`.
- This is a single-page app: configure your host to serve `index.html` for all routes (SPA fallback).
- Animations respect `prefers-reduced-motion`.
- The first-visit loading splash shows once per browser session (`src/components/Loader.tsx`).

## Home page scroll story — photos

The Home page opens with a full-screen hero and a three-step scroll story
(Pack → Store → Deliver), with inertia ("smooth") scrolling on mouse and
trackpad. Visitors who turn on "reduce motion" get plain scrolling and the
steps as simple stacked sections.

**To put in high-quality photos (recommended 2400px wide or more):**

1. Copy the originals into `story-src/`, named `hero`, `pack`, `store`, `deliver`
   (`.jpg`, `.png` or `.webp`, any size; landscape works best).
2. Run `npm run story-images`.
3. Rebuild/redeploy as usual.

The script crops each photo to 16:9 and writes two versions into
`public/story/`: `<name>.webp` at 2560px for large and retina screens, and
`<name>-1280.webp` for phones. The browser picks the right one automatically.
It warns you if a photo is too small to look sharp full-screen.

| Photo | Used for |
| --- | --- |
| `hero` | Full-screen background at the top of the Home page |
| `pack` | Step 1, "Packed with care." |
| `store` | Step 2, "Stored and ready." |
| `deliver` | Step 3, "Delivered on time." |

If a photo is missing, the site shows a brand illustration instead, so nothing
breaks. Darker, moody photos work best because white headlines sit on top of them.
The step headlines and text are editable in the admin under Page text → Home page.
