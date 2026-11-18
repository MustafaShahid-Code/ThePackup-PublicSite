import express from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, DATA_DIR, UPLOAD_DIR, defaults, get, save, load } from './store.js'
import { login, setSession, clearSession, currentUser, requireAdmin, throttled, noteFail, changePassword, adminEmail } from './auth.js'
import { cleanCopy, cleanSite, cleanCategories, cleanWhy, cleanWork, cleanTheme, cleanSettings, OPTIONS } from './validate.js'
import { themeCss, PRESETS } from '../shared/theme.js'
import compression from 'compression'
import { ZipArchive } from 'archiver'
import { snapshot, list as listBackups, lastAuto, mirrorUploads, schedule, uploadStats, dataDirWritable, BACKUP_DIR, isBackupName } from './backup.js'
import { optimise, isListable, variantsOf, hasSharp } from './images.js'

load()
const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
const isProd = process.env.NODE_ENV === 'production'

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  if (req.path.startsWith('/admin') || req.path.startsWith('/api/admin')) res.setHeader('Cache-Control', 'no-store')
  next()
})
app.use(compression())
app.use(express.json({ limit: '1mb' }))

// ---------- public content ----------
const publicContent = () => {
  const s = get()
  return { copy: s.copy, site: s.site, categories: s.categories, why: s.why, work: s.work, theme: s.theme, settings: s.settings }
}
app.get('/api/content', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache')
  res.json(publicContent())
})

// ---------- health (public, no details) ----------
app.get('/api/health', (_req, res) => {
  const ok = dataDirWritable()
  res.status(ok ? 200 : 503).json({ ok })
})

// ---------- admin auth ----------
app.post('/api/admin/login', (req, res) => {
  const ip = req.ip
  if (throttled(ip)) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' })
  if (!login(req.body?.email, req.body?.password)) {
    noteFail(ip)
    return res.status(401).json({ error: 'Email or password is incorrect' })
  }
  setSession(req, res)
  res.json({ ok: true, email: adminEmail() })
})
app.post('/api/admin/logout', (_req, res) => {
  clearSession(res)
  res.json({ ok: true })
})
app.get('/api/admin/me', (req, res) => {
  const u = currentUser(req)
  u ? res.json({ email: u }) : res.status(401).json({ error: 'Not signed in' })
})

// ---------- admin content ----------
const admin = express.Router()
admin.use(requireAdmin)
admin.get('/content', (_req, res) => {
  res.json({ ...publicContent(), schema: defaults.copy, options: OPTIONS, presets: PRESETS, updatedAt: get().updatedAt, defaults: { site: defaults.site, categories: defaults.categories, why: defaults.why, work: defaults.work } })
})
admin.put('/copy', (req, res) => {
  get().copy = cleanCopy(req.body?.copy)
  save()
  res.json({ ok: true, copy: get().copy })
})
admin.put('/site', (req, res) => {
  get().site = cleanSite(req.body?.site)
  save()
  res.json({ ok: true, site: get().site })
})
admin.put('/categories', (req, res) => {
  get().categories = cleanCategories(req.body?.categories, get().categories)
  save()
  res.json({ ok: true, categories: get().categories })
})
admin.put('/why', (req, res) => {
  get().why = cleanWhy(req.body?.why, get().why)
  save()
  res.json({ ok: true, why: get().why })
})
admin.put('/work', (req, res) => {
  get().work = cleanWork(req.body?.work, get().work)
  save()
  res.json({ ok: true, work: get().work })
})
admin.put('/theme', (req, res) => {
  get().theme = cleanTheme(req.body?.theme)
  save()
  res.json({ ok: true, theme: get().theme })
})
admin.put('/settings', (req, res) => {
  get().settings = cleanSettings(req.body?.settings)
  save()
  res.json({ ok: true, settings: get().settings })
})
admin.post('/password', (req, res) => {
  const err = changePassword(req.body?.current, req.body?.next)
  err ? res.status(400).json({ error: err }) : res.json({ ok: true })
})
admin.get('/export', (_req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="pack-up-content-backup.json"')
  res.json(get())
})

// ---------- media ----------
const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif', 'image/gif': '.gif' }
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, Date.now().toString(36) + '-' + crypto.randomBytes(4).toString('hex') + EXT[file.mimetype]),
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => cb(null, Boolean(EXT[file.mimetype])),
})
const imageFiles = () =>
  fs
    .readdirSync(UPLOAD_DIR)
    .filter(isListable)
    .map((f) => ({ name: f, url: '/uploads/' + f, size: fs.statSync(path.join(UPLOAD_DIR, f)).size, mtime: fs.statSync(path.join(UPLOAD_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)

admin.get('/media', (_req, res) => res.json({ files: imageFiles() }))
admin.post('/media', upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: 'No valid images received (JPG, PNG, WebP, AVIF or GIF, max 8 MB each).' })
    const files = []
    for (const f of req.files) {
      const r = await optimise(UPLOAD_DIR, f.filename)
      const size = r.optimised ? r.after : f.size
      files.push({ name: r.name, url: '/uploads/' + r.name, size, optimised: r.optimised, saved: r.optimised ? Math.max(0, f.size - r.after) : 0 })
    }
    res.json({ ok: true, files })
  } catch (e) {
    next(e)
  }
})
admin.delete('/media/:name', (req, res) => {
  const name = path.basename(req.params.name)
  const url = '/uploads/' + name
  const s = get()
  const used = s.work.some((w) => w.image === url) || s.categories.some((c) => c.image === url)
  if (used) return res.status(409).json({ error: 'This image is in use. Remove it from the item first.' })
  try {
    fs.unlinkSync(path.join(UPLOAD_DIR, name))
    for (const v of variantsOf(name)) fs.rmSync(path.join(UPLOAD_DIR, v), { force: true })
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})
// ---------- backups & status ----------
admin.get('/status', (_req, res) => {
  res.json({
    node: process.version,
    uptimeSeconds: Math.round(process.uptime()),
    dataDir: DATA_DIR,
    dataDirWritable: dataDirWritable(),
    imageOptimisation: hasSharp,
    uploads: uploadStats(),
    contentUpdatedAt: get().updatedAt,
    lastAutoBackup: lastAuto(),
  })
})
admin.get('/backups', (_req, res) => res.json({ backups: listBackups(), lastAutoBackup: lastAuto() }))
admin.post('/backups/run', (_req, res) => {
  const name = snapshot('manual')
  const copied = mirrorUploads()
  res.json({ ok: true, name, imagesCopied: copied, backups: listBackups() })
})
admin.get('/backups/:name', (req, res) => {
  const name = path.basename(req.params.name)
  if (!isBackupName(name) || !fs.existsSync(path.join(BACKUP_DIR, name))) return res.status(404).json({ error: 'Not found' })
  res.download(path.join(BACKUP_DIR, name), name)
})
admin.post('/backups/:name/restore', (req, res) => {
  const name = path.basename(req.params.name)
  if (!isBackupName(name) || !fs.existsSync(path.join(BACKUP_DIR, name))) return res.status(404).json({ error: 'Not found' })
  let data
  try {
    data = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, name), 'utf8'))
  } catch {
    return res.status(400).json({ error: 'That backup file is damaged.' })
  }
  snapshot('pre-restore') // so a restore can itself be undone
  const s = get()
  s.copy = cleanCopy(data.copy)
  s.site = cleanSite(data.site)
  s.categories = cleanCategories(data.categories, s.categories)
  s.why = cleanWhy(data.why, s.why)
  s.work = cleanWork(data.work, s.work)
  s.theme = cleanTheme(data.theme)
  s.settings = cleanSettings(data.settings)
  save()
  res.json({ ok: true })
})
// Everything in one zip: content + all uploaded images
admin.get('/export-all', (_req, res) => {
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', `attachment; filename="pack-up-full-backup-${new Date().toISOString().slice(0, 10)}.zip"`)
  const zip = new ZipArchive({ zlib: { level: 6 } })
  zip.on('error', () => res.destroy())
  zip.pipe(res)
  zip.append(JSON.stringify(get(), null, 2), { name: 'content.json' })
  zip.directory(UPLOAD_DIR, 'uploads')
  zip.finalize()
})
app.use('/api/admin', admin)
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message })
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' })
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

// ---------- static site ----------
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true, index: false, setHeaders: (r) => r.setHeader('Content-Security-Policy', "default-src 'none'") }))
const DIST = path.join(ROOT, 'dist')
app.use('/assets', express.static(path.join(DIST, 'assets'), { maxAge: '1y', immutable: true }))
app.use(express.static(DIST, { index: false, maxAge: '1h' }))

// index.html with the CMS content embedded so the first paint already shows the edited text.
app.get('*', (_req, res) => {
  let html
  try {
    html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  } catch {
    return res.status(503).send('Site not built yet. Run "npm run build".')
  }
  const json = JSON.stringify(publicContent()).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
  res.setHeader('Cache-Control', 'no-cache')
  res.type('html').send(html.replace('</head>', () => `<style id="cms-theme">${themeCss(get().theme)}</style><script>window.__CMS__=${json}</script></head>`))
})

const port = Number(process.env.PORT) || 3000
schedule()
app.listen(port, () => console.log(`[cms] Packup running on port ${port} (${isProd ? 'production' : 'development'}) — data in ${DATA_DIR}`))
