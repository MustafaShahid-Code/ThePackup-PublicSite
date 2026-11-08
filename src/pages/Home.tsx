import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Button from '../components/Button'
import Box3D from '../components/Box3D'
import BrandStudio from '../components/BrandStudio'
import HowItBridges from '../components/HowItBridges'
import Marquee from '../components/Marquee'
import { Packaging, type PackKind } from '../components/Packaging'
import { ArtTile, CtaBand, DarkPanel, SectionHead } from '../components/shared'
import { Parallax, Reveal, WordReveal } from '../components/motion'
import { usePageMeta } from '../components/usePageMeta'
import { merchants, type Merchant } from '../data/merchants'
import { alsoAvailable } from '../data/content'
import { useCategories, useCopy, useWhy, useWork } from '../cms/CmsContext'

const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7', 'lg:col-span-6', 'lg:col-span-6']
const heights = { tall: 'h-[400px]', mid: 'h-[320px]', short: 'h-[250px]' }

/** Floating glass tiles around the hero box — shows the range isn't just pizza boxes. */
const satellites: { kind: PackKind; pos: string; delay: number; size: string; mobile?: boolean }[] = [
  { kind: 'bag', pos: 'left-0 top-[4%] sm:left-[2%]', delay: 0, size: 'w-[92px] sm:w-[128px]', mobile: true },
  { kind: 'cup', pos: 'right-0 top-[10%] sm:right-[2%]', delay: 0.8, size: 'w-[84px] sm:w-[116px]', mobile: true },
  { kind: 'burger', pos: 'left-[2%] bottom-[24%] sm:left-[4%]', delay: 1.4, size: 'w-[104px]' },
  { kind: 'container', pos: 'right-[2%] bottom-[22%] sm:right-[4%]', delay: 2.1, size: 'w-[110px]' },
]

function Satellite({ s, m, reduce }: { s: (typeof satellites)[number]; m: Merchant; reduce: boolean | null }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`glass-dark absolute z-10 rounded-[1.6rem] p-2 ${s.pos} ${s.size} ${s.mobile ? '' : 'hidden sm:block'}`}
      animate={reduce ? undefined : { y: [0, -12, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
    >
      <Packaging kind={s.kind} merchant={m} className="aspect-[1.09/1] w-full" />
    </motion.div>
  )
}

function Hero() {
  const t = useCopy()
  const [idx, setIdx] = useState(0)
  const [manual, setManual] = useState(false)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const wordY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 160])
  const boxY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 70])

  useEffect(() => {
    if (manual || reduce) return
    const t = setInterval(() => setIdx((i) => (i + 1) % merchants.length), 4800)
    return () => clearInterval(t)
  }, [manual, reduce])

  const m = merchants[idx]
  const stack = merchants.filter((x) => x.id !== m.id).slice(0, 2)

  return (
    <section ref={ref} className="aurora grain relative min-h-[100svh] overflow-hidden rounded-b-[2.5rem] text-ivory lg:rounded-b-[4rem]">
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(45% 55% at 76% 46%, rgba(198,165,106,0.22), transparent 65%), radial-gradient(30% 35% at 90% 85%, rgba(210,88,47,0.14), transparent 65%)' }} />
      <motion.div
        aria-hidden="true"
        style={{ y: wordY }}
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(8rem,30vw,28rem)] font-medium uppercase leading-none tracking-[0.04em] text-ivory/[0.035]"
      >
        Pack Up
      </motion.div>

      <div className="container-x relative grid min-h-[100svh] items-center gap-8 pb-24 pt-32 lg:grid-cols-12 lg:pt-28">
        <div className="lg:col-span-6">
          <Reveal y={10}>
            <p className="eyebrow glass-dark inline-flex rounded-full px-4 py-2">{t('home.heroEyebrow')}</p>
          </Reveal>
          <WordReveal as="h1" immediate delay={0.2} className="display-xl mt-7" text={t('home.heroTitle')} />
          <Reveal delay={0.9}>
            <p className="lead mt-8 max-w-xl text-ivory/70">
              {t('home.heroText')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button to="/solutions" variant="gold">
                Explore Solutions
              </Button>
              <Button to="/contact" variant="outlineLight">
                Let’s Talk
              </Button>
            </div>
          </Reveal>
        </div>

        <motion.div style={{ y: boxY }} className="relative flex flex-col items-center lg:col-span-6">
          {satellites.map((s) => (
            <Satellite key={s.kind} s={s} m={m} reduce={reduce} />
          ))}
          <Box3D merchant={m} stack={stack} />
          <div className="glass-dark relative z-10 -mt-2 flex flex-col items-center gap-3 rounded-[2rem] px-6 py-4 sm:flex-row sm:gap-6 sm:rounded-full">
            <div aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.p key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="font-display text-xl italic">
                  {m.name} <span className="text-ivory/50">· {m.cuisine}</span>
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex gap-2.5" role="group" aria-label="Preview a merchant’s packaging">
              {merchants.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  aria-label={`Show ${x.name}`}
                  aria-pressed={i === idx}
                  onClick={() => {
                    setManual(true)
                    setIdx(i)
                  }}
                  className={`h-3.5 rounded-full border transition-all duration-500 ${i === idx ? 'w-9 border-gold' : 'w-3.5 border-ivory/40 hover:border-gold'}`}
                  style={{ background: `linear-gradient(90deg, ${x.bg} 50%, ${x.accent} 50%)` }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <a href="#intro" aria-label="Scroll to introduction" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50 transition-colors hover:text-gold md:flex">
        Scroll
        <ChevronDown size={16} className="animate-bounce" />
      </a>
    </section>
  )
}

export default function Home() {
  const t = useCopy()
  const categories = useCategories()
  const whyItems = useWhy()
  const work = useWork()
  usePageMeta('The Pack Up', 'The Pack Up is the bridge between restaurants, pizzerias and food brands and the packaging vendors who produce boxes, takeaway packaging, bags and cups.')

  return (
    <>
      <Hero />

      <Marquee items={['Pizzerias', 'Burger joints', 'Cloud kitchens', 'Cafés', 'Bakeries', 'Caterers', 'Food courts', 'Multi-merchant brands']} />

      {/* Brand introduction */}
      <section id="intro" className="py-24 lg:py-36">
        <div className="container-x grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal y={12}>
              <p className="eyebrow">{t('home.introEyebrow')}</p>
            </Reveal>
            <WordReveal className="display-lg mt-5" text={t('home.introTitle')} />
            <Reveal delay={0.2}>
              <p className="lead mt-8 max-w-xl text-charcoal/75">
                {t('home.introP1')}
              </p>
              <p className="lead mt-5 max-w-xl text-charcoal/75">
                {t('home.introP2')}
              </p>
              <div className="mt-10">
                <Button to="/about" variant="outlineDark">
                  Our Approach
                </Button>
              </div>
            </Reveal>
          </div>
          <div className="relative lg:col-span-6">
            <Parallax distance={40} className="relative z-10 ml-auto w-[78%]">
              <ArtTile kind="lunch" merchantId="oven-lane" tone="kraft" className="aspect-[4/5]" pad="p-4" />
            </Parallax>
            <Parallax distance={-50} className="absolute -bottom-10 left-0 z-20 w-[48%]">
              <ArtTile kind="bag" merchantId="dough-theory" tone="ivory" className="aspect-square border-[8px] border-ivory shadow-2xl" />
            </Parallax>
          </div>
        </div>
      </section>

      <HowItBridges />

      {/* Brand Studio */}
      <DarkPanel className="py-20 lg:py-28">
        <div className="container-x relative">
          <SectionHead
            dark
            eyebrow={t('home.studioEyebrow')}
            title={t('home.studioTitle')}
            text={t('home.studioText')}
            className="mb-14"
          />
          <BrandStudio />
        </div>
      </DarkPanel>

      {/* Categories */}
      <section className="py-24 lg:py-36">
        <div className="container-x">
          <SectionHead eyebrow={t('home.catsEyebrow')} title={t('home.catsTitle')} className="mb-16" />
          <div className="grid gap-x-8 gap-y-16 lg:grid-cols-12">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 2) * 0.1} className={spans[i % spans.length]}>
                <Link to={`/solutions#${c.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-[28px]">
                    <div className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]">
                      <ArtTile kind={c.kind} merchantId={c.merchantId} tone={c.tone} image={c.image} alt={c.title} className="h-[320px] md:h-[400px]" />
                    </div>
                    <span className="glass-ink absolute bottom-4 left-4 translate-y-3 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      Explore
                    </span>
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-6 border-b border-charcoal/15 pb-6">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.22em] text-[#8F7038]">0{i + 1}</p>
                      <h3 className="mt-2 font-display text-3xl">{c.title}</h3>
                      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-charcoal/65">{c.short}</p>
                    </div>
                    <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-charcoal/25 transition-colors duration-500 group-hover:border-gold group-hover:bg-gold">
                      <ArrowUpRight size={18} aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      <span className="sr-only">Explore {c.title}</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20 grid gap-6 rounded-[2rem] bg-cream p-8 md:grid-cols-5 md:items-center lg:p-10">
            <p className="font-display text-2xl italic md:col-span-1">Beyond restaurants</p>
            <ul className="grid gap-4 sm:grid-cols-2 md:col-span-4 md:grid-cols-4">
              {alsoAvailable.map((a) => (
                <li key={a.title}>
                  <Link to={`/contact?category=${encodeURIComponent(a.category)}`} className="group block rounded-2xl bg-white/60 p-4 transition-colors hover:bg-white">
                    <span className="text-[14px] font-semibold group-hover:text-[#9A7C45]">{a.title}</span>
                    <span className="mt-1 block text-[13px] text-charcoal/60">{a.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Why */}
      <DarkPanel className="py-24 lg:py-32">
        <div className="container-x relative grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHead dark eyebrow={t('home.whyEyebrow')} title={t('home.whyTitle')} />
            </div>
          </div>
          <ol className="space-y-3 lg:col-span-7">
            {whyItems.map((w, i) => (
              <Reveal key={w.title}>
                <li className="group grid grid-cols-[auto_1fr] gap-6 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 transition-colors hover:border-gold/60 hover:bg-white/[0.07] sm:gap-9 sm:p-8">
                  <span className="gold-text font-display text-5xl italic">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-3xl">{w.title}</h3>
                    <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ivory/60">{w.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </DarkPanel>

      {/* Featured gallery */}
      <section className="py-24 lg:py-36">
        <div className="container-x">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow={t('home.featEyebrow')} title={t('home.featTitle')} />
            <Button to="/our-work" variant="outlineDark">
              View Showcase
            </Button>
          </div>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {[work[0], work[3], work[7], work[6], work[5], work[11]].filter(Boolean).map((w, i) => (
              <Reveal key={w.id} delay={(i % 3) * 0.08} className="break-inside-avoid">
                <Link to="/our-work" className="group relative block overflow-hidden rounded-[28px]">
                  <div className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]">
                    <ArtTile kind={w.kind} merchantId={w.merchantId} finish={w.finish} tone={w.tone} image={w.image} alt={w.title} className={heights[w.size]} />
                  </div>
                  <div className="glass-ink absolute inset-x-3 bottom-3 translate-y-[130%] rounded-2xl p-4 text-ivory transition-transform duration-500 group-hover:translate-y-0">
                    <p className="font-display text-xl">{w.title}</p>
                    <p className="text-[12px] text-ivory/70">{w.caption}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
