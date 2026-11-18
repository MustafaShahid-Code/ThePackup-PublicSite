import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Button from '../components/Button'
import BrandPreview from '../components/BrandPreview'
import CubeStack from '../components/CubeStack'
import ScrollStory from '../components/ScrollStory'
import { ArtTile, CtaBand, SectionHead } from '../components/shared'
import { Reveal, WordReveal } from '../components/motion'
import { usePageMeta } from '../components/usePageMeta'
import { useCategories, useCopy, useWhy } from '../cms/CmsContext'

function Hero() {
  const t = useCopy()
  const [photo, setPhoto] = useState(true)
  const words = t('home.heroTitle').split(' ')
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  // Gentle cinematic exit as the visitor scrolls into the story (transform/opacity only).
  const { scrollYProgress: h } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgScale = useTransform(h, [0, 1], [1, reduce ? 1 : 1.06])
  const textY = useTransform(h, [0, 1], [0, reduce ? 0 : -90])
  const textO = useTransform(h, [0, 0.75], [1, reduce ? 1 : 0])
  return (
    <section ref={ref} className="navy relative flex min-h-[100svh] items-end overflow-hidden pb-14 pt-32 sm:items-center sm:pb-20">
      {photo && (
        <>
          <motion.img src="/story/hero.webp" srcSet="/story/hero-1280.webp 1280w, /story/hero.webp 2560w" sizes="100vw" alt="" fetchPriority="high" draggable={false} onError={() => setPhoto(false)} style={{ scale: imgScale }} className="absolute inset-0 -z-[1] h-full w-full object-cover will-change-transform" />
          <div aria-hidden="true" className="absolute inset-0 -z-[1] bg-gradient-to-r from-charcoal via-charcoal/70 to-charcoal/10" />
          <div aria-hidden="true" className="absolute inset-0 -z-[1] bg-gradient-to-t from-charcoal/90 via-transparent to-charcoal/50" />
        </>
      )}
      <motion.div style={{ y: textY, opacity: textO }} className="container-x grid items-center gap-6 will-change-transform lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Reveal y={10}>
            <p className="eyebrow">{t('home.heroEyebrow')}</p>
          </Reveal>
          <h1 className="mt-5 font-condensed text-[clamp(4.2rem,15vw,12.5rem)] font-bold uppercase leading-[0.86] tracking-[-0.01em]" aria-label={t('home.heroTitle')}>
            {words.map((w, i) => (
              <span key={i} className={`block ${i === words.length - 1 ? 'text-gold' : ''}`}>
                {w}
              </span>
            ))}
          </h1>
          <Reveal delay={0.25}>
            <p className="lead mt-7 max-w-xl text-white/80">{t('home.heroText')}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/contact">Get a quote</Button>
              <Button to="/services" variant="outlineLight" arrow={false}>
                See our services
              </Button>
            </div>
          </Reveal>
        </div>
        {!photo && (
          <div className="relative lg:col-span-4">
            <CubeStack className="mx-auto w-full max-w-[460px]" />
          </div>
        )}
      </motion.div>
      <a href="#story" aria-label="Scroll to the story" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 sm:flex">
        Scroll
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </a>
    </section>
  )
}

function How() {
  const t = useCopy()
  return (
    <section className="ambient py-20 lg:py-28">
      <div className="container-x">
        <SectionHead eyebrow={t('home.howEyebrow')} title={t('home.howTitle')} text={t('home.howText')} />
        <ol className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div aria-hidden="true" className="absolute left-0 right-0 top-[27px] hidden h-px border-t-2 border-dashed border-charcoal/15 lg:block" />
          {[1, 2, 3, 4].map((n) => (
            <Reveal key={n} delay={n * 0.07}>
              <li className="relative">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold font-display text-[20px] font-bold text-charcoal ring-8 ring-ivory">{n}</span>
                <h3 className="mt-5 text-[19px] font-semibold leading-snug">{t(`how.s${n}t`)}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-charcoal/65">{t(`how.s${n}x`)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Range() {
  const t = useCopy()
  const categories = useCategories()
  return (
    <section className="ambient bg-cream py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow={t('home.catsEyebrow')} title={t('home.catsTitle')} />
          <Button to="/packaging" variant="outlineDark">
            Full packaging range
          </Button>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.07} className="h-full">
              <Link to={`/packaging#${c.slug}`} className="card card-hover group block h-full overflow-hidden">
                <ArtTile kind={c.kind} merchantId={c.merchantId} tone={c.tone} image={c.image} alt={c.title} className="aspect-[4/3] !rounded-none" pad="p-8" />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[19px] font-semibold leading-snug">{c.title}</h3>
                    <ArrowUpRight size={20} className="mt-0.5 shrink-0 text-charcoal/30 transition group-hover:text-gold" aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-charcoal/65">{c.short}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Why() {
  const t = useCopy()
  const why = useWhy()
  return (
    <section className="navy overflow-hidden py-20 lg:py-28">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal y={10}>
              <p className="eyebrow">{t('home.whyEyebrow')}</p>
            </Reveal>
            <WordReveal className="display-lg mt-4" text={t('home.whyTitle')} />
          </div>
          <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:col-span-8">
            {why.map((w, i) => (
              <Reveal key={w.title} delay={(i % 2) * 0.07}>
                <div className="border-t border-white/15 pt-5">
                  <h3 className="flex items-center gap-3 text-[19px] font-semibold">
                    <span className="font-display text-[14px] text-gold">{String(i + 1).padStart(2, '0')}</span>
                    {w.title}
                  </h3>
                  <p className="mt-2.5 text-[15.5px] leading-relaxed text-white/70">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function VendorStrip() {
  const t = useCopy()
  return (
    <section className="ambient py-16 lg:py-20">
      <div className="container-x">
        <div className="card flex flex-col items-start justify-between gap-6 p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="display-md">{t('home.vendorTitle')}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-charcoal/70">{t('home.vendorText')}</p>
          </div>
          <Button to="/vendors" variant="dark">
            Join as a vendor
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  usePageMeta('Packup', 'Packup connects restaurants and businesses with verified packaging vendors, then stores and delivers it for you. Pack, store, deliver.')
  return (
    <>
      <Hero />
      <div id="story">
        <ScrollStory />
      </div>
      <How />
      <Range />
      <BrandPreview />
      <Why />
      <VendorStrip />
      <CtaBand />
    </>
  )
}
