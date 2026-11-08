import { defaults } from './store.js'

const str = (v, max = 5000) => (typeof v === 'string' ? v.slice(0, max) : '')
const oneOf = (v, list, d) => (list.includes(v) ? v : d)
// image must be an uploaded file, an http(s) URL, or empty
export const cleanImage = (v) => {
  const s = str(v, 500).trim()
  if (!s) return ''
  return /^(\/uploads\/[\w.\-]+|https:\/\/[^\s"'<>]+)$/.test(s) ? s : ''
}
const lines = (v, n = 12) => (Array.isArray(v) ? v.map((x) => str(x, 200).trim()).filter(Boolean).slice(0, n) : [])

const COPY_KEYS = new Set(defaults.copy.map((f) => f.key))
export function cleanCopy(input) {
  const out = {}
  for (const [k, v] of Object.entries(input || {})) {
    if (!COPY_KEYS.has(k)) continue
    const s = str(v)
    if (s.trim()) out[k] = s
  }
  return out
}

export function cleanSite(i = {}) {
  const s = i.social || {}
  const url = (v) => {
    const t = str(v, 300).trim()
    return !t || /^https?:\/\/[^\s"'<>]+$/.test(t) ? t : ''
  }
  return {
    email: str(i.email, 200).trim(),
    phone: str(i.phone, 60).trim(),
    location: str(i.location, 300).trim(),
    social: { instagram: url(s.instagram), linkedin: url(s.linkedin), facebook: url(s.facebook) },
  }
}

const TONES = ['ivory', 'beige', 'charcoal', 'kraft']
const KINDS = ['pizza', 'burger', 'lunch', 'container', 'bag', 'cup', 'fries', 'bakery', 'eco']
const FILTERS = ['Pizza', 'Burgers & Fries', 'Meal Boxes', 'Cups & Bags', 'Bakery', 'Eco']
const FINISH = ['branded', 'kraft', 'white', 'black']
export const OPTIONS = { tones: TONES, kinds: KINDS, filters: FILTERS, finishes: FINISH, sizes: ['tall', 'mid', 'short'] }

// Categories: fixed set (matched by slug); only text, lists and image are editable.
export function cleanCategories(input, current) {
  if (!Array.isArray(input)) return current
  return current.map((c) => {
    const n = input.find((x) => x?.slug === c.slug)
    if (!n) return c
    return {
      ...c,
      title: str(n.title, 120) || c.title,
      short: str(n.short, 400) || c.short,
      description: str(n.description, 2000) || c.description,
      customisation: lines(n.customisation),
      applications: lines(n.applications),
      image: cleanImage(n.image) || undefined,
    }
  })
}

export function cleanWhy(input, current) {
  if (!Array.isArray(input)) return current
  const out = input.slice(0, 10).map((w) => ({ title: str(w?.title, 120).trim(), text: str(w?.text, 600).trim() })).filter((w) => w.title && w.text)
  return out.length ? out : current
}

export function cleanWork(input, current) {
  if (!Array.isArray(input)) return current
  const ids = new Set()
  const out = []
  for (const w of input.slice(0, 200)) {
    const title = str(w?.title, 140).trim()
    if (!title) continue
    let id = /^[\w-]{1,40}$/.test(w.id || '') ? w.id : 'w' + Math.random().toString(36).slice(2, 9)
    while (ids.has(id)) id += 'x'
    ids.add(id)
    const item = {
      id,
      title,
      caption: str(w.caption, 240).trim(),
      filter: oneOf(w.filter, FILTERS, 'Pizza'),
      kind: oneOf(w.kind, KINDS, 'pizza'),
      merchantId: oneOf(w.merchantId, ['casa-rosso', 'slice-society', 'oven-lane', 'crust-ember', 'dough-theory'], 'casa-rosso'),
      tone: oneOf(w.tone, TONES, 'beige'),
      size: oneOf(w.size, ['tall', 'mid', 'short'], 'mid'),
    }
    if (w.finish && FINISH.includes(w.finish)) item.finish = w.finish
    const img = cleanImage(w.image)
    if (img) item.image = img
    out.push(item)
  }
  return out
}
