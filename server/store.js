// Tiny JSON-file store (no native modules, works on any Node host).
// Everything lives in DATA_DIR so it survives redeploys when DATA_DIR is outside the app folder.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.resolve(here, '..')

// Load ROOT/.env (if present) without overriding variables already set by the host. Never reads .env.example.
try {
  for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (!m || line.trim().startsWith('#')) continue
    let v = m[2]
    if (/^(".*"|'.*')$/.test(v)) v = v.slice(1, -1)
    if (process.env[m[1]] === undefined && v !== '') process.env[m[1]] = v
  }
} catch {}
export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'))
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
export const defaults = {
  copy: readJson(path.join(ROOT, 'shared/defaults/copy.json')),
  site: readJson(path.join(ROOT, 'shared/defaults/site.json')),
  categories: readJson(path.join(ROOT, 'shared/defaults/categories.json')),
  why: readJson(path.join(ROOT, 'shared/defaults/why.json')),
  work: readJson(path.join(ROOT, 'shared/defaults/work.json')),
}

const FILE = path.join(DATA_DIR, 'content.json')

function seed() {
  return {
    copy: {}, // overrides only: { key: string }
    site: structuredClone(defaults.site),
    categories: structuredClone(defaults.categories),
    why: structuredClone(defaults.why),
    work: structuredClone(defaults.work),
    updatedAt: new Date().toISOString(),
  }
}

let state
export function load() {
  try {
    state = readJson(FILE)
  } catch {
    state = seed()
    save()
  }
  return state
}
export const get = () => state ?? load()

export function save() {
  state.updatedAt = new Date().toISOString()
  const tmp = FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2))
  fs.renameSync(tmp, FILE) // atomic replace
  // keep a rolling backup (last 20 saves)
  try {
    const dir = path.join(DATA_DIR, 'backups')
    fs.mkdirSync(dir, { recursive: true })
    fs.copyFileSync(FILE, path.join(dir, `content-${Date.now()}.json`))
    const files = fs.readdirSync(dir).sort()
    files.slice(0, Math.max(0, files.length - 20)).forEach((f) => fs.unlinkSync(path.join(dir, f)))
  } catch {}
}

export const readSecretFile = (name) => {
  try {
    return readJson(path.join(DATA_DIR, name))
  } catch {
    return null
  }
}
export const writeSecretFile = (name, obj) => fs.writeFileSync(path.join(DATA_DIR, name), JSON.stringify(obj), { mode: 0o600 })
