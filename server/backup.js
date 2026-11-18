// Automatic + manual backups of the CMS content (content.json). Uploaded images are mirrored once, never overwritten.
import fs from 'node:fs'
import path from 'node:path'
import { DATA_DIR, UPLOAD_DIR, get } from './store.js'

export const BACKUP_DIR = path.join(DATA_DIR, 'backups', 'daily')
const MIRROR_DIR = path.join(DATA_DIR, 'backups', 'uploads')
const KEEP = 30
fs.mkdirSync(BACKUP_DIR, { recursive: true })

const stamp = () => new Date().toISOString().replace(/[:.]/g, '-')
const day = () => new Date().toISOString().slice(0, 10)
export const isBackupName = (n) => /^(auto|manual|pre-restore)-[\w-]+\.json$/.test(n)

function prune(kind) {
  const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.startsWith(kind + '-')).sort()
  files.slice(0, Math.max(0, files.length - KEEP)).forEach((f) => fs.rmSync(path.join(BACKUP_DIR, f), { force: true }))
}

/** Copy any uploaded image that is not in the mirror yet. */
export function mirrorUploads() {
  fs.mkdirSync(MIRROR_DIR, { recursive: true })
  let copied = 0
  for (const f of fs.readdirSync(UPLOAD_DIR)) {
    const dst = path.join(MIRROR_DIR, f)
    if (!fs.existsSync(dst)) {
      fs.copyFileSync(path.join(UPLOAD_DIR, f), dst)
      copied++
    }
  }
  return copied
}

export function snapshot(kind = 'manual') {
  const name = kind === 'auto' ? `auto-${day()}.json` : `${kind}-${stamp()}.json`
  fs.writeFileSync(path.join(BACKUP_DIR, name), JSON.stringify(get(), null, 2))
  prune(kind)
  return name
}

export function list() {
  return fs
    .readdirSync(BACKUP_DIR)
    .filter(isBackupName)
    .map((name) => {
      const st = fs.statSync(path.join(BACKUP_DIR, name))
      return { name, kind: name.split('-')[0], size: st.size, mtime: st.mtimeMs }
    })
    .sort((a, b) => b.mtime - a.mtime)
}

export const lastAuto = () => list().find((b) => b.kind === 'auto')?.mtime ?? null

/** Make sure today's automatic backup exists. */
export function runDaily() {
  try {
    if (!fs.existsSync(path.join(BACKUP_DIR, `auto-${day()}.json`))) snapshot('auto')
    mirrorUploads()
  } catch (e) {
    console.warn('[cms] daily backup failed:', e.message)
  }
}

export function schedule() {
  setTimeout(runDaily, 5000).unref()
  setInterval(runDaily, 6 * 60 * 60 * 1000).unref() // checks every 6h, writes at most one automatic backup per day
}

export function uploadStats() {
  let count = 0
  let bytes = 0
  for (const f of fs.readdirSync(UPLOAD_DIR)) {
    const st = fs.statSync(path.join(UPLOAD_DIR, f))
    if (st.isFile()) {
      count++
      bytes += st.size
    }
  }
  return { count, bytes }
}

export function dataDirWritable() {
  try {
    const p = path.join(DATA_DIR, '.write-test')
    fs.writeFileSync(p, 'ok')
    fs.rmSync(p)
    return true
  } catch {
    return false
  }
}
