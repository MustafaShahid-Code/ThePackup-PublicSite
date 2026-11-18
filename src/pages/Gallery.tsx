import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import { ArtTile, CtaBand, PageHero } from '../components/shared'
import { usePageMeta } from '../components/usePageMeta'
import { workFilters, type WorkFilter, type WorkItem } from '../data/work'
import { useCopy, useWork } from '../cms/CmsContext'

const heights = { tall: 'h-[420px]', mid: 'h-[320px]', short: 'h-[250px]' }

function Lightbox({ items, index, onClose, onIndex }: { items: WorkItem[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const item = items[index]
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const closeRef = useRef<HTMLButtonElement>(null)
  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex])
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex])

  useEffect(() => setZoom(false), [index])

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, prev, next])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[80] flex flex-col bg-charcoal/90 text-ivory backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <p className="text-[12px] tracking-[0.2em] text-ivory/60">
          {index + 1} / {items.length}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setZoom((z) => !z)} aria-label={zoom ? 'Zoom out' : 'Zoom in'} className="rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20 hover:text-gold">
            {zoom ? <ZoomOut size={22} /> : <ZoomIn size={22} />}
          </button>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20 hover:text-gold">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
        <button
          type="button"
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation()
            prev()
          }}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-3 transition-colors hover:text-gold sm:left-6"
        >
          <ChevronLeft size={34} />
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            className={`aspect-square w-full max-w-[min(78vh,760px)] overflow-hidden rounded-[20px] ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation()
              setZoom((z) => !z)
            }}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
            }}
          >
            <div className="h-full w-full transition-transform duration-500 ease-out" style={{ transform: zoom ? 'scale(1.9)' : 'scale(1)', transformOrigin: origin }}>
              <ArtTile kind={item.kind} merchantId={item.merchantId} finish={item.finish} tone={item.tone} image={item.image} alt={item.title} className="h-full w-full" pad="p-10" />
            </div>
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation()
            next()
          }}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-3 transition-colors hover:text-gold sm:right-6"
        >
          <ChevronRight size={34} />
        </button>
      </div>

      <div className="mx-auto mb-6 mt-2 max-w-[90vw] rounded-2xl bg-white/10 px-8 py-4 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-2xl">{item.title}</p>
        <p className="mt-1 text-[13px] text-ivory/55">
          {item.caption} · Illustrative concept
        </p>
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const t = useCopy()
  const work = useWork()
  usePageMeta('Gallery', 'A gallery of packaging concepts — pizza boxes, burger boxes, meal boxes, bags, cups and eco packaging — of the kind vendors in our network can produce.')
  const [filter, setFilter] = useState<WorkFilter>('All')
  const [open, setOpen] = useState<number | null>(null)
  const items = useMemo(() => (filter === 'All' ? work : work.filter((w) => w.filter === filter)), [filter])
  const close = useCallback(() => setOpen(null), [])

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={t('gallery.heroTitle')}
        text={t('gallery.heroText')}
      />

      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div role="group" aria-label="Filter gallery by category" className="flex flex-wrap gap-2">
              {workFilters.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-5 py-2 text-[14px] font-medium transition-colors ${
                    filter === f ? 'border-charcoal bg-charcoal text-white' : 'border-charcoal/20 bg-white hover:border-gold hover:text-deep'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="text-[13px] text-charcoal/55" aria-live="polite">
              {items.length} concept{items.length === 1 ? '' : 's'}
            </p>
          </div>

          <p className="mt-6 max-w-2xl rounded-2xl bg-cream p-4 text-[13.5px] leading-relaxed text-charcoal/65">
            These are illustrated concepts using fictional sample merchants, shown to demonstrate what’s possible. Real project photography can be added from the admin panel.
          </p>

          <motion.ul key={filter} className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5" initial="hidden" animate="show" transition={{ staggerChildren: 0.05 }}>
            {items.map((w, i) => (
              <motion.li key={w.id} className="break-inside-avoid" variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-[20px] text-left" aria-label={`View ${w.title} full size`}>
                  <div className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]">
                    <ArtTile kind={w.kind} merchantId={w.merchantId} finish={w.finish} tone={w.tone} image={w.image} alt="" className={heights[w.size]} />
                  </div>
                  <div className="absolute inset-x-3 bottom-3 translate-y-[130%] transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    <div className="rounded-2xl bg-charcoal/95 p-4 text-white shadow-lg">
                      <p className="font-display text-[18px] font-semibold leading-tight">{w.title}</p>
                      <p className="mt-1 text-[12.5px] text-white/70">{w.caption}</p>
                    </div>
                  </div>
                  <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true">
                    <ZoomIn size={18} />
                  </span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      <AnimatePresence>{open !== null && <Lightbox items={items} index={open} onClose={close} onIndex={setOpen} />}</AnimatePresence>

      <CtaBand title="Want packaging like this? We’ll find the vendor." label="Get a quote" />
    </>
  )
}
