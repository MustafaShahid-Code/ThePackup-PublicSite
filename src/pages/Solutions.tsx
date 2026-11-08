import { Check } from 'lucide-react'
import Button from '../components/Button'
import { ArtTile, CtaBand, PageHero, SectionHead } from '../components/shared'
import { Parallax, Reveal, WordReveal } from '../components/motion'
import { usePageMeta } from '../components/usePageMeta'
import { alsoAvailable } from '../data/content'
import { useCategories, useCopy } from '../cms/CmsContext'
import { merchants } from '../data/merchants'
import type { Finish } from '../components/Packaging'

const pizzaVariants: { merchantId: string; finish: Finish; tone: 'ivory' | 'beige' | 'charcoal' | 'kraft' }[] = [
  { merchantId: 'casa-rosso', finish: 'branded', tone: 'beige' },
  { merchantId: 'slice-society', finish: 'black', tone: 'ivory' },
  { merchantId: 'oven-lane', finish: 'branded', tone: 'kraft' },
  { merchantId: 'crust-ember', finish: 'kraft', tone: 'charcoal' },
  { merchantId: 'dough-theory', finish: 'white', tone: 'beige' },
]

export default function Solutions() {
  const t = useCopy()
  const categories = useCategories()
  usePageMeta('Solutions', 'Restaurant packaging solutions: pizza boxes, burger and sandwich packaging, meal boxes, takeaway containers, paper bags and cups, and eco-friendly food packaging.')

  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={t('solutions.heroTitle')}
        text={t('solutions.heroText')}
      >
        <nav aria-label="Packaging categories" className="-mx-1 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="glass-dark rounded-full px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-gold">
              {c.title}
            </a>
          ))}
        </nav>
      </PageHero>

      {categories.map((c, i) => {
        const flip = i % 2 === 1
        return (
          <section key={c.slug} id={c.slug} className={`scroll-mt-20 py-20 lg:py-28 ${i % 2 === 0 ? 'bg-ivory' : 'bg-cream'}`}>
            <div className="container-x">
              <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
                <div className={`lg:col-span-6 ${flip ? 'lg:order-2' : ''}`}>
                  <Parallax distance={28}>
                    <ArtTile kind={c.kind} merchantId={c.merchantId} tone={c.tone} image={c.image} alt={c.title} className="h-[360px] sm:h-[480px] lg:h-[600px]" pad="p-8" />
                  </Parallax>
                </div>
                <div className={`lg:col-span-6 ${flip ? 'lg:order-1' : ''}`}>
                  <Reveal y={12}>
                    <p className="eyebrow">0{i + 1} · Restaurant packaging · via our vendors</p>
                  </Reveal>
                  <WordReveal className="display-lg mt-4" text={c.title} />
                  <Reveal delay={0.15}>
                    <p className="lead mt-6 text-charcoal/75">{c.description}</p>

                    <h3 className="mt-9 text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal/50">What vendors can offer</h3>
                    <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {c.customisation.map((x) => (
                        <li key={x} className="flex gap-3 text-[15px]">
                          <Check size={17} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                          {x}
                        </li>
                      ))}
                    </ul>

                    <h3 className="mt-9 text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal/50">Industry applications</h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {c.applications.map((x) => (
                        <li key={x} className="rounded-full border border-charcoal/20 bg-white/50 px-3.5 py-1.5 text-[13px]">
                          {x}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-10">
                      <Button to={`/contact?category=${encodeURIComponent(c.title)}`} variant="dark">
                        Enquire Now
                      </Button>
                    </div>
                  </Reveal>
                </div>
              </div>

              {c.slug === 'pizza-boxes' && (
                <Reveal className="mt-20">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="eyebrow">Different merchants, different boxes</p>
                      <h3 className="display-md mt-3">The same box, five identities.</h3>
                    </div>
                    <p className="max-w-xs text-[13px] text-charcoal/55">Illustrative concepts with fictional sample brands — {merchants.length} merchants, each with their own artwork and finish.</p>
                  </div>
                  <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
                    {pizzaVariants.map((v) => (
                      <li key={v.merchantId} className="group overflow-hidden rounded-[28px]">
                        <div className="transition-transform duration-[1200ms] group-hover:scale-[1.06]">
                          <ArtTile kind="pizza" merchantId={v.merchantId} finish={v.finish} tone={v.tone} className="aspect-square" pad="p-2" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>
          </section>
        )
      })}

      <section className="py-24 lg:py-32">
        <div className="container-x">
          <SectionHead eyebrow="One brand, every format" title="One brief can cover the whole range." text="Boxes, containers, bags, cups and sleeves — a vendor can carry one merchant’s brand across every touchpoint. Concepts shown are illustrative." className="mb-12" />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {([
              ['pizza', 'kraft'],
              ['burger', 'beige'],
              ['fries', 'ivory'],
              ['container', 'beige'],
              ['bag', 'kraft'],
              ['cup', 'charcoal'],
            ] as const).map(([kind, tone], i) => (
              <Reveal key={kind} delay={i * 0.06}>
                <li className="group overflow-hidden rounded-[28px]">
                  <div className="transition-transform duration-[1200ms] group-hover:scale-[1.06]">
                    <ArtTile kind={kind} merchantId="casa-rosso" tone={tone} className="aspect-square" pad="p-2" />
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="container-x">
          <SectionHead eyebrow="Also available" title="Beyond the restaurant counter." text="The same vendor network covers other packaging categories. Tell us what you need." className="mb-14" />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {alsoAvailable.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.07} className="h-full">
                <li className="card flex h-full flex-col justify-between p-8">
                  <div>
                    <h3 className="font-display text-3xl">{a.title}</h3>
                    <p className="mt-3 text-[15px] text-charcoal/65">{a.text}</p>
                  </div>
                  <div className="mt-8">
                    <Button to={`/contact?category=${encodeURIComponent(a.category)}`} variant="outlineDark" size="sm">
                      Enquire
                    </Button>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Not sure what you need? Let’s work it out." label="Let’s Talk" />
    </>
  )
}
