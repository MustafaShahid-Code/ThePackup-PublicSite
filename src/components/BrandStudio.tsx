import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Box3D from './Box3D'
import Button from './Button'
import { Packaging, kindLabel, type Finish, type PackKind } from './Packaging'
import { ArtTile } from './shared'
import { merchants } from '../data/merchants'

type Format = 'range' | PackKind

const formats: { id: Format; label: string; category: string }[] = [
  { id: 'range', label: 'Full range', category: 'Custom-Branded' },
  { id: 'pizza', label: 'Pizza box', category: 'Pizza Boxes' },
  { id: 'burger', label: 'Burger box', category: 'Burger, Sandwich & Fries' },
  { id: 'fries', label: 'Fry sleeve', category: 'Burger, Sandwich & Fries' },
  { id: 'lunch', label: 'Lunch box', category: 'Lunch & Meal Boxes' },
  { id: 'container', label: 'Takeaway container', category: 'Takeaway Containers' },
  { id: 'bag', label: 'Paper bag', category: 'Paper Bags & Cups' },
  { id: 'cup', label: 'Paper cup', category: 'Paper Bags & Cups' },
  { id: 'bakery', label: 'Bakery box', category: 'Bakery & Confectionery' },
  { id: 'eco', label: 'Fibre bowl', category: 'Eco-Friendly Food Packaging' },
]

const finishes: { id: Finish; label: string }[] = [
  { id: 'branded', label: 'Full colour' },
  { id: 'kraft', label: 'Kraft' },
  { id: 'white', label: 'White' },
  { id: 'black', label: 'Black' },
]

const rangeSet: { kind: PackKind; tone: 'ivory' | 'beige' | 'charcoal' | 'kraft' }[] = [
  { kind: 'pizza', tone: 'kraft' },
  { kind: 'burger', tone: 'beige' },
  { kind: 'bag', tone: 'ivory' },
  { kind: 'cup', tone: 'charcoal' },
  { kind: 'container', tone: 'beige' },
  { kind: 'lunch', tone: 'kraft' },
]

const chip = (on: boolean) =>
  `rounded-full border px-4 py-2.5 text-[12.5px] font-semibold transition-colors ${on ? 'border-ivory bg-ivory text-charcoal' : 'border-white/20 bg-white/[0.05] text-ivory hover:border-gold'}`

/** Interactive "one brand, every format" preview. */
export default function BrandStudio() {
  const [mid, setMid] = useState(merchants[0].id)
  const [format, setFormat] = useState<Format>('range')
  const [finish, setFinish] = useState<Finish>('branded')
  const m = merchants.find((x) => x.id === mid)!
  const others = merchants.filter((x) => x.id !== mid).slice(0, 2)
  const fmt = formats.find((f) => f.id === format)!
  const summary = format === 'range' ? 'Full packaging range' : format === 'pizza' ? `${finishes.find((f) => f.id === finish)!.label.toLowerCase()} pizza box` : kindLabel[format]

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12">
      <div className="glass-dark rounded-[2rem] p-6 sm:p-8 lg:col-span-5">
        <fieldset>
          <legend className="eyebrow">1 · Choose a merchant</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {merchants.map((x) => (
              <button key={x.id} type="button" aria-pressed={x.id === mid} onClick={() => setMid(x.id)} className={`flex items-center gap-2.5 ${chip(x.id === mid)}`}>
                <span className="h-3.5 w-3.5 rounded-full border border-black/20" style={{ background: `linear-gradient(135deg, ${x.bg} 50%, ${x.accent} 50%)` }} aria-hidden="true" />
                {x.name}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="eyebrow">2 · Choose a format</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {formats.map((f) => (
              <button key={f.id} type="button" aria-pressed={f.id === format} onClick={() => setFormat(f.id)} className={chip(f.id === format)}>
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>

        {format === 'pizza' && (
          <fieldset className="mt-8">
            <legend className="eyebrow">3 · Choose a finish</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {finishes.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={f.id === finish}
                  onClick={() => setFinish(f.id)}
                  className={`rounded-full border px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    f.id === finish ? 'border-gold bg-gold text-charcoal' : 'border-white/20 bg-white/[0.05] hover:border-gold'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-9 border-t border-white/15 pt-6" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={mid + format + finish} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <p className="font-display text-3xl">{m.name}</p>
              <p className="mt-1 text-[14px] text-ivory/60">
                {m.cuisine} · {summary}
              </p>
            </motion.div>
          </AnimatePresence>
          <p className="mt-4 text-[12.5px] leading-relaxed text-ivory/45">
            Illustrative concept using a fictional sample brand. The Pack Up doesn’t manufacture — real artwork, sizes and finishes depend on the vendor you’re matched with.
          </p>
          <div className="mt-6">
            <Button to={`/contact?category=${encodeURIComponent(fmt.category)}`} variant="gold">
              {format === 'range' ? 'Enquire about packaging' : `Enquire about ${fmt.label.toLowerCase()}s`}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-[380px] items-center justify-center lg:col-span-7">
        <AnimatePresence mode="wait">
          {format === 'pizza' ? (
            <motion.div key="pizza" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <Box3D merchant={m} finish={finish} stack={others} />
            </motion.div>
          ) : format === 'range' ? (
            <motion.ul
              key="range"
              className="grid w-full max-w-[640px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              transition={{ staggerChildren: 0.07 }}
            >
              {rangeSet.map((r) => (
                <motion.li key={r.kind} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <ArtTile kind={r.kind} merchantId={mid} tone={r.tone} className="aspect-square" pad="p-3" />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div key={format} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="glass-dark w-full max-w-[520px] rounded-[2.5rem] p-6">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                <Packaging kind={format} merchant={m} className="aspect-[1.09/1] w-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
