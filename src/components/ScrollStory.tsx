import { useRef, useState, type ReactNode } from 'react'
import { cubicBezier, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import CubeStack from './CubeStack'
import { DeliverIcon, PackIcon, StoreIcon } from './icons'
import { useCopy } from '../cms/CmsContext'

/** Full-bleed photo that quietly hides itself if the file is missing, so a fallback scene shows instead. */
function Photo({ src, className = '', onMissing }: { src: string; className?: string; onMissing?: () => void }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return (
    <img
      src={src}
      srcSet={`${src.replace(/\.webp$/, '-1280.webp')} 1280w, ${src} 2560w`}
      sizes="100vw"
      alt=""
      decoding="async"
      loading="eager"
      draggable={false}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      onError={() => {
        setOk(false)
        onMissing?.()
      }}
    />
  )
}

/** Illustrated stand-in scene used when a chapter has no photo yet. */
function Scene({ kind }: { kind: 'pack' | 'store' | 'deliver' }) {
  return (
    <div className="navy absolute inset-0 flex items-center justify-center">
      {kind === 'deliver' ? (
        <svg viewBox="0 0 800 300" className="absolute left-1/2 top-[14vh] w-[min(92vw,820px)] -translate-x-1/2 opacity-95" fill="none" aria-hidden="true">
          <path d="M0 252H800" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeDasharray="10 14" />
          <rect x="120" y="60" width="300" height="146" rx="10" fill="#E0B27A" />
          <rect x="250" y="60" width="34" height="146" fill="#0F2D3D" opacity="0.85" />
          <path d="M420 104h82l56 54v48H420Z" fill="rgb(255 122 0)" />
          <path d="M470 118h30l30 30h-60Z" fill="#0A1F2B" opacity="0.7" />
          <circle cx="200" cy="214" r="30" fill="#0A1F2B" stroke="#fff" strokeWidth="5" />
          <circle cx="492" cy="214" r="30" fill="#0A1F2B" stroke="#fff" strokeWidth="5" />
          <path d="M30 150h64M10 176h74M44 124h46" stroke="rgba(255,255,255,0.35)" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ) : (
        <CubeStack className="w-[min(70vw,520px)]" />
      )}
    </div>
  )
}

const chapters = [
  { key: 'c1', kind: 'pack' as const, src: '/story/pack.webp', Icon: PackIcon },
  { key: 'c2', kind: 'store' as const, src: '/story/store.webp', Icon: StoreIcon },
  { key: 'c3', kind: 'deliver' as const, src: '/story/deliver.webp', Icon: DeliverIcon },
]

const clamp = (xs: number[]) => xs.map((x) => Math.min(1, Math.max(0, x)))
/** Soft in-out curve, so fades and moves ease rather than track the wheel 1:1. */
const soft = cubicBezier(0.45, 0, 0.25, 1)
/** Keep fully-transparent layers out of the paint/composite work. */
const useVis = (o: MotionValue<number>) => useTransform(o, (v) => (v < 0.005 ? 'hidden' : 'visible'))

function Layer({ i, n, p, children }: { i: number; n: number; p: MotionValue<number>; children: ReactNode }) {
  const a = i / n
  const b = (i + 1) / n
  const fade = 0.085
  const opacity = useTransform(p, clamp([a - fade, a + fade, b - fade, b + fade]), [i === 0 ? 1 : 0, 1, 1, i === n - 1 ? 1 : 0], { ease: soft })
  const scale = useTransform(p, clamp([a - fade, b + fade]), [1.12, 1.0])
  const visibility = useVis(opacity)
  return (
    <motion.div style={{ opacity, visibility }} className="absolute inset-0 will-change-[opacity]">
      <motion.div style={{ scale }} className="absolute inset-0 will-change-transform [backface-visibility:hidden]">
        {children}
      </motion.div>
    </motion.div>
  )
}

function Words({ i, n, p, title, text, num }: { i: number; n: number; p: MotionValue<number>; title: string; text: string; num: string }) {
  const a = i / n
  const b = (i + 1) / n
  const f = 0.11
  const input = clamp([a - 0.02, a + f, b - f, b + 0.02])
  const opacity = useTransform(p, input, [i === 0 ? 1 : 0, 1, 1, i === n - 1 ? 1 : 0], { ease: soft })
  const y = useTransform(p, input, [i === 0 ? 0 : 70, 0, 0, i === n - 1 ? 0 : -70], { ease: soft })
  const visibility = useVis(opacity)
  return (
    <motion.div style={{ opacity, y, visibility }} className="absolute inset-x-0 bottom-0 pb-20 will-change-transform sm:pb-24 lg:pb-28">
      <div className="container-x">
        <p className="eyebrow">Step {num} of 0{n}</p>
        <h2 className="mt-4 max-w-4xl font-condensed text-[clamp(3.4rem,12vw,10rem)] font-bold uppercase leading-[0.88] tracking-[-0.01em] text-white">{title}</h2>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/80">{text}</p>
      </div>
    </motion.div>
  )
}

export default function ScrollStory() {
  const t = useCopy()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const n = chapters.length
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const bar = useTransform(p, [0, 1], [0, 1])

  if (reduce) {
    // No scroll effects: simple stacked chapters.
    return (
      <div>
        {chapters.map((c, i) => (
          <section key={c.key} className="relative flex min-h-[80vh] items-end overflow-hidden bg-charcoal">
            <Photo src={c.src} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="container-x relative pb-16 pt-40">
              <p className="eyebrow">Step 0{i + 1} of 0{n}</p>
              <h2 className="mt-4 font-condensed text-[clamp(3rem,10vw,7rem)] font-bold uppercase leading-[0.9] text-white">{t(`story.${c.key}t`)}</h2>
              <p className="mt-5 max-w-lg text-white/80">{t(`story.${c.key}x`)}</p>
            </div>
          </section>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} style={{ height: `${n * 120}svh` }} className="relative bg-charcoal">
      <div className="sticky top-0 h-[100svh] overflow-hidden [contain:paint]">
        {chapters.map((c, i) => (
          <Layer key={c.key} i={i} n={n} p={p}>
            <Scene kind={c.kind} />
            <Photo src={c.src} />
          </Layer>
        ))}
        {/* readability: darken the lower-left where the words sit */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />
        {chapters.map((c, i) => (
          <Words key={c.key} i={i} n={n} p={p} num={String(i + 1).padStart(2, '0')} title={t(`story.${c.key}t`)} text={t(`story.${c.key}x`)} />
        ))}
        <div aria-hidden="true" className="absolute right-5 top-1/2 hidden h-40 w-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/20 sm:block lg:right-10">
          <motion.div style={{ scaleY: bar }} className="h-full w-full origin-top bg-gold will-change-transform" />
        </div>
      </div>
    </div>
  )
}
