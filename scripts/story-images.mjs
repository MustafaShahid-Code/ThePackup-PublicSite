// Turns high-resolution photos into the Home page story images.
//   1. Put your originals in  story-src/  named hero, pack, store, deliver (.jpg / .jpeg / .png / .webp)
//   2. Run:  npm run story-images
// Output: public/story/<name>.webp (2560px wide, for large/retina screens)
//         public/story/<name>-1280.webp (for phones and small laptops)
import { readdirSync, mkdirSync, existsSync } from 'node:fs'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SRC = 'story-src'
const OUT = 'public/story'
const NAMES = ['hero', 'pack', 'store', 'deliver']
mkdirSync(OUT, { recursive: true })

const files = existsSync(SRC) ? readdirSync(SRC) : []
let done = 0
for (const file of files) {
  const { name, ext } = parse(file)
  if (!NAMES.includes(name) || !/\.(jpe?g|png|webp|avif|tiff?)$/i.test(ext)) continue
  const input = sharp(join(SRC, file)).rotate()
  const { width = 0, height = 0 } = await input.metadata()
  if (width < 1920) console.warn(`! ${file} is only ${width}px wide — it will look soft full-screen. 2400px+ is recommended.`)
  // Crop to 16:9 around the centre so every chapter frames the same way.
  const base = sharp(join(SRC, file)).rotate().resize({ width: 2560, height: 1440, fit: 'cover', position: 'attention', withoutEnlargement: false })
  await base.clone().webp({ quality: 84, effort: 6, smartSubsample: true }).toFile(join(OUT, `${name}.webp`))
  await base.clone().resize({ width: 1280, height: 720 }).webp({ quality: 80, effort: 6 }).toFile(join(OUT, `${name}-1280.webp`))
  console.log(`✓ ${file} (${width}×${height}) → ${name}.webp + ${name}-1280.webp`)
  done++
}
if (!done) console.log(`No images found. Put hero/pack/store/deliver photos in ${SRC}/ and run again.`)
