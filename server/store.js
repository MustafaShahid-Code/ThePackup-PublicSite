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
function pickDataDir() {
  const wanted = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'))
  try {
    fs.mkdirSync(path.join(wanted, 'uploads'), { recursive: true })
    fs.accessSync(wanted, fs.constants.W_OK)
    return wanted
  } catch (e) {
    // Don't take the site down: fall back to a folder inside the app (NOT kept across redeploys).
    const fallback = path.join(ROOT, 'data')
    console.error(`\n[cms] Can't use DATA_DIR "${wanted}" (${e.code || e.message}). Using "${fallback}" for now — content saved there is lost on redeploy. Fix DATA_DIR and restart.\n`)
    fs.mkdirSync(path.join(fallback, 'uploads'), { recursive: true })
    return fallback
  }
}
export const DATA_DIR = pickDataDir()
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')

import { THEME_DEFAULTS } from '../shared/theme.js'

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
export const defaults = {
  copy: readJson(path.join(ROOT, 'shared/defaults/copy.json')),
  site: readJson(path.join(ROOT, 'shared/defaults/site.json')),
  categories: readJson(path.join(ROOT, 'shared/defaults/categories.json')),
  why: readJson(path.join(ROOT, 'shared/defaults/why.json')),
  work: readJson(path.join(ROOT, 'shared/defaults/work.json')),
  theme: THEME_DEFAULTS,
}

const FILE = path.join(DATA_DIR, 'content.json')

function seed() {
  return {
    copy: {}, // overrides only: { key: string }
    site: structuredClone(defaults.site),
    categories: structuredClone(defaults.categories),
    why: structuredClone(defaults.why),
    work: structuredClone(defaults.work),
    theme: structuredClone(defaults.theme),
    settings: { cookieNotice: false },
    story: {},
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
  }
}

let state
export function load() {
  try {
    state = readJson(FILE)
    // older content files predate these sections
    state.theme ??= structuredClone(defaults.theme)
    state.settings ??= { cookieNotice: false }
    state.story ??= {}
    // Rebrand (v2): the old "The Pack Up" text, colours and "why" points no longer fit the Packup site.
    // Keep a copy of the old file, then reset only those three; contact details, images, gallery and settings stay.
    if ((state.schemaVersion ?? 1) < 2) {
      try {
        const dir = path.join(DATA_DIR, 'backups')
        fs.mkdirSync(dir, { recursive: true })
        fs.copyFileSync(FILE, path.join(dir, `content-v1-before-packup-rebrand-${Date.now()}.json`))
      } catch {}
      state.copy = {}
      state.theme = structuredClone(defaults.theme)
      state.why = structuredClone(defaults.why)
      state.schemaVersion = 2
      save()
    }
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
