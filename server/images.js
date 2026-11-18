// Optional image optimisation. Uses `sharp` when it is installed (it is an optional dependency);
// otherwise uploads are stored exactly as received and everything still works.
import fs from 'node:fs'
import path from 'node:path'

let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  /* not available on this host — fine */
}
export const hasSharp = Boolean(sharp)

export const VARIANT_WIDTHS = [640, 1200]
export const MAX_WIDTH = 1800
const isVariant = (f) => /\.opt-\d+\.webp$/.test(f)
export const isListable = (f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f) && !isVariant(f)
export const variantsOf = (name) => (name.endsWith('.opt.webp') ? VARIANT_WIDTHS.map((w) => name.replace(/\.opt\.webp$/, `.opt-${w}.webp`)) : [])

/**
 * Convert an uploaded raster image to a compressed WebP (max 1800px wide, EXIF rotation applied, metadata stripped)
 * plus 640px / 1200px variants for responsive loading. Returns the final filename.
 * Animated GIFs and failures keep the original.
 */
export async function optimise(dir, filename) {
  if (!sharp || /\.gif$/i.test(filename)) return { name: filename, optimised: false }
  const src = path.join(dir, filename)
  const base = filename.replace(/\.[^.]+$/, '')
  const out = `${base}.opt.webp`
  try {
    const before = fs.statSync(src).size
    const img = sharp(src, { failOn: 'none' }).rotate()
    await img.clone().resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toFile(path.join(dir, out))
    for (const w of VARIANT_WIDTHS) {
      await img.clone().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78, effort: 4 }).toFile(path.join(dir, `${base}.opt-${w}.webp`))
    }
    fs.unlinkSync(src)
    return { name: out, optimised: true, before, after: fs.statSync(path.join(dir, out)).size }
  } catch (e) {
    console.warn('[cms] image optimisation skipped:', e.message)
    return { name: filename, optimised: false }
  }
}
