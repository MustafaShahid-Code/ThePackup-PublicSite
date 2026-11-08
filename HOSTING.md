# Hosting on Hostinger (Node.js Web App)

The site + admin run as **one Node.js app** (`npm start` → `server/index.js`). It needs a Hostinger plan that supports **Node.js Web Apps** (static/PHP-only shared hosting cannot run the admin). Menu names in hPanel change over time, so follow the intent below if labels differ.

## 1. Deploy
1. In hPanel create a **Node.js Web App** and upload this project (zip upload or connect a GitHub repo). Do **not** upload `node_modules/` or `data/`.
2. Settings:
   - **Node version:** 20 or 22
   - **Install command:** `npm install` (dev dependencies are needed for the build)
   - **Build command:** `npm run build`
   - **Start command:** `npm start` (entry file: `server/index.js`)
3. Add the environment variables (see `.env.example`):

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATA_DIR` | an absolute folder **outside** the app directory, e.g. `/home/<your-user>/pack-up-data` — holds `content.json`, `uploads/`, `backups/`, `auth.json` |
| `ADMIN_EMAIL` | your login email |
| `ADMIN_PASSWORD` | a long password (first start only) |
| `VITE_FORM_ENDPOINT` | optional, form endpoint — needed at **build** time |

   `PORT` is normally provided by Hostinger; the app reads it automatically.
4. Deploy / restart, open `https://your-domain/admin` and sign in. Then remove `ADMIN_PASSWORD` from the variables.

## 2. Why `DATA_DIR` matters
Redeploying replaces the app folder. If content and photos lived inside it they would be lost, so keep `DATA_DIR` outside the app folder. **Back up that folder** (hPanel backups or download via File Manager) — plus the "Download content backup" button in Admin → Account.

## 3. Updating the site later
- Text/images/gallery: use `/admin` — no redeploy.
- Design/code changes: change the code, redeploy (build + restart). Content is untouched.

## 4. Checklist
- HTTPS enabled for the domain (the admin cookie is `Secure` in production).
- Admin password changed to something only you know.
- Business email, phone, location filled in (Admin → Contact & social).
- Form endpoint configured (or accept demo-mode forms).
- Real photos uploaded; "fictional sample" concepts replaced where you want.
