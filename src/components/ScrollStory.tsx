import { useRef, useState, type ReactNode } from 'react'
import { cubicBezier, motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import CubeStack from './CubeStack'
import { useCopy, useStory } from '../cms/CmsContext'

/**
 * Responsive sources for a full-screen story photo.
 * - built-in files (/story/x.webp) ship with a 1280px phone copy (/story/x-1280.webp)
 * - photos uploaded in the admin (/uploads/x.opt.webp) always have a 1200px copy
 */
export function storySrcSet(src: string): string | undefined {
  if (/^\/story\/[\w-]+\.webp$/.test(src)) return `${src.replace(/\.webp$/, '-1280.webp')} 1280w, ${src} 2560w`
  if (/^\/uploads\/[\w-]+\.opt\.webp$/.test(src)) return `${src.replace(/\.opt\.webp$/, '.opt-1200.webp')} 1200w, ${src} 2560w`
  return undefined
}

/** Full-bleed photo that quietly hides itself if the file is missing, so the illustrated scene shows instead. */
function Photo({ src }: { src: string }) {
  const [ok, setOk] = useState(true)
  if (!ok || !src) return null
  return (
    <img
      src={src}
      srcSet={storySrcSet(src)}
      sizes="100vw"
      alt=""
      decoding="async"
      loading="eager"
      draggable={false}
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setOk(false)}
    />
  )
}

/** Illustrated stand-in scene used when a step has no photo. */
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
  { key: 'c1', kind: 'pack' as const },
  { key: 'c2', kind: 'store' as const },
  { key: 'c3', kind: 'deliver' as const },
]

/** Scroll distance per step (in small-viewport heights). Higher = slower, more deliberate story. */
const PER_STEP = 160
/** Half-width of each photo crossfade, as a share of the whole story. */
const X = 0.075

/**
 * Where each step starts/ends on the 0→1 story timeline.
 * The middle steps get extra room: the first photo is already on screen while the hero scrolls away,
 * and the last one stays up as the page moves on, so equal slices made the middle step feel rushed.
 */
function stepBounds(n: number) {
  const w = Array.from({ length: n }, (_, i) => (i === 0 || i === n - 1 ? 1 : 1.35))
  const total = w.reduce((a, b) => a + b, 0)
  const b = [0]
  w.forEach((x) => b.push(b[b.length - 1] + x / total))
  b[n] = 1
  return b
}

const clamp = (xs: number[]) => xs.map((x) => Math.min(1, Math.max(0, x)))
/** Soft in-out curve, so fades and moves ease rather than track the wheel 1:1. */
const soft = cubicBezier(0.45, 0, 0.25, 1)
const out = cubicBezier(0.22, 1, 0.36, 1)
/** Keep fully-transparent layers out of the paint/composite work. */
const useVis = (o: MotionValue<number>) => useTransform(o, (v) => (v < 0.005 ? 'hidden' : 'visible'))

function Layer({ a, b, first, last, p, children }: { a: number; b: number; first: boolean; last: boolean; p: MotionValue<number>; children: ReactNode }) {
  const opacity = useTransform(p, clamp([a - X, a + X, b - X, b + X]), [first ? 1 : 0, 1, 1, last ? 1 : 0], { ease: soft })
  // Slow push-in plus a gentle drift for a cinematic feel (transform only, so it stays smooth).
  const scale = useTransform(p, clamp([a - X, b + X]), [1.16, 1.05])
  const y = useTransform(p, clamp([a - X, b + X]), ['2.2%', '-2.2%'])
  const visibility = useVis(opacity)
  return (
    <motion.div style={{ opacity, visibility }} className="absolute inset-0 will-change-[opacity]">
      <motion.div style={{ scale, y }} className="absolute inset-0 will-change-transform [backface-visibility:hidden]">
        {children}
      </motion.div>
    </motion.div>
  )
}

/** One headline word that rises out of a mask, then lifts away — staggered by its index. */
function Word({ word, j, a, b, first, last, p }: { word: string; j: number; a: number; b: number; first: boolean; last: boolean; p: MotionValue<number> }) {
  const d = j * 0.012
  const inA = a + 0.01 + d
  const inB = a + 0.075 + d
  const outA = b - 0.085 + d * 0.5
  const outB = b - 0.03 + d * 0.5
  const y = useTransform(p, clamp([inA, inB, outA, outB]), [first ? '0%' : '110%', '0%', '0%', last ? '0%' : '-110%'], { ease: out })
  return (
    <span className="mr-[0.18em] inline-block overflow-hidden pb-[0.06em] align-bottom last:mr-0">
      <motion.span style={{ y }} className="inline-block will-change-transform">
        {word}
      </motion.span>
    </span>
  )
}

function Words({ i, n, a, b, p, title, text }: { i: number; n: number; a: number; b: number; p: MotionValue<number>; title: string; text: string }) {
  const first = i === 0
  const last = i === n - 1
  const input = clamp([a + 0.02, a + 0.09, b - 0.09, b - 0.025])
  const opacity = useTransform(p, input, [first ? 1 : 0, 1, 1, last ? 1 : 0], { ease: soft })
  const y = useTransform(p, input, [first ? 0 : 36, 0, 0, last ? 0 : -36], { ease: soft })
  // the whole block hides between steps, so stale words never overlap the next ones
  const shown = useTransform(p, (v) => ((first || v >= a - 0.002) && (last || v <= b + 0.002) ? 'visible' : 'hidden'))
  return (
    <motion.div style={{ visibility: shown }} className="absolute inset-x-0 bottom-0 pb-20 sm:pb-24 lg:pb-28">
      <div className="container-x">
        <motion.p style={{ opacity, y }} className="eyebrow">
          Step {String(i + 1).padStart(2, '0')} of {String(n).padStart(2, '0')}
        </motion.p>
        <h2 className="mt-4 max-w-5xl font-condensed text-[clamp(3.4rem,12vw,10rem)] font-bold uppercase leading-[0.9] tracking-[-0.01em] text-white">
          {title.split(' ').map((w, j) => (
            <Word key={j} word={w} j={j} a={a} b={b} first={first} last={last} p={p} />
          ))}
        </h2>
        <motion.p style={{ opacity, y }} className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/80">
          {text}
        </motion.p>
      </div>
    </motion.div>
  )
}

function Ticks({ bounds, p }: { bounds: number[]; p: MotionValue<number> }) {
  const bar = useTransform(p, [0, 1], [0, 1])
  return (
    <div aria-hidden="true" className="absolute right-5 top-1/2 hidden h-48 w-[3px] -translate-y-1/2 rounded-full bg-white/20 sm:block lg:right-10">
      <motion.div style={{ scaleY: bar }} className="h-full w-full origin-top rounded-full bg-gold will-change-transform" />
      {bounds.slice(1, -1).map((v) => (
        <span key={v} className="absolute -left-[3px] h-[9px] w-[9px] -translate-y-1/2 rounded-full border-2 border-white/60 bg-charcoal" style={{ top: `${v * 100}%` }} />
      ))}
    </div>
  )
}

export default function ScrollStory() {
  const t = useCopy()
  const story = useStory()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const n = chapters.length
  const bounds = stepBounds(n)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // A soft spring on top of the scroll position, so every move eases in and settles instead of snapping.
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.7, restDelta: 0.0002 })
  const src = (k: 'pack' | 'store' | 'deliver') => story[k]

  if (reduce) {
    // No scroll effects: simple stacked steps.
    return (
      <div>
        {chapters.map((c, i) => (
          <section key={c.key} className="relative flex min-h-[80vh] items-end overflow-hidden bg-charcoal">
            <Scene kind={c.kind} />
            <Photo key={src(c.kind)} src={src(c.kind)} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="container-x relative pb-16 pt-40">
              <p className="eyebrow">
                Step 0{i + 1} of 0{n}
              </p>
              <h2 className="mt-4 font-condensed text-[clamp(3rem,10vw,7rem)] font-bold uppercase leading-[0.9] text-white">{t(`story.${c.key}t`)}</h2>
              <p className="mt-5 max-w-lg text-white/80">{t(`story.${c.key}x`)}</p>
            </div>
          </section>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} style={{ height: `${n * PER_STEP + 100}svh` }} className="relative bg-charcoal">
      <div className="sticky top-0 h-[100svh] overflow-hidden [contain:paint]">
        {chapters.map((c, i) => (
          <Layer key={c.key} a={bounds[i]} b={bounds[i + 1]} first={i === 0} last={i === n - 1} p={p}>
            <Scene kind={c.kind} />
            <Photo key={src(c.kind)} src={src(c.kind)} />
          </Layer>
        ))}
        {/* readability: darken the lower part where the words sit */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />
        {chapters.map((c, i) => (
          <Words key={c.key} i={i} n={n} a={bounds[i]} b={bounds[i + 1]} p={p} title={t(`story.${c.key}t`)} text={t(`story.${c.key}x`)} />
        ))}
        <Ticks bounds={bounds} p={p} />
      </div>
    </div>
  )
}
