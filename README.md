# The Pack Up — Website

Premium, restaurant-focused packaging website. React + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide.

```bash
npm install
npm run dev        # local development
npm run build      # type-check + production build into /dist
npm run preview    # serve the production build locally
```

## Run it
```bash
npm install
npm run build
ADMIN_PASSWORD='choose-a-long-password' ADMIN_EMAIL='you@yourdomain.com' npm start   # site + admin on http://localhost:3000
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
- **Why us** — the "Why The Pack Up" points
- **Contact & social** — email, phone, location, social links
- **Media library** — upload and delete images (JPG/PNG/WebP/AVIF/GIF, 8 MB max)
- **Account** — change password, download a content backup

How it works: `server/` is a small Express API that stores content in `DATA_DIR/content.json` and images in `DATA_DIR/uploads/` (no database to install; last 20 saves are kept in `DATA_DIR/backups/`). It embeds the content into the page it serves, so edited text appears on first paint. Default wording lives in `shared/defaults/` (`copy.json` lists every editable text field — add a field there, then use `useCopy()` in a component to make more text editable). Security: scrypt-hashed password, signed HttpOnly SameSite=Strict cookie, login throttling, CSRF header on all changes, uploads limited to images and served with `nosniff`.

If the site is served as plain static files (no Node server) it still works and simply shows the built-in default content.

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
The Pack Up is a **bridge** between customers (restaurants/merchants) and packaging vendors — it does not manufacture, print or ship. All copy, the "How it works" section (`src/components/HowItBridges.tsx`) and the logo follow that idea. Packaging illustrations are concepts of what vendors can produce.

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
