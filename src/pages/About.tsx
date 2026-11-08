import { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'
import { ArtTile, CtaBand, DarkPanel, PageHero, Placeholder, SectionHead } from '../components/shared'
import { Parallax, Reveal, WordReveal } from '../components/motion'
import { usePageMeta } from '../components/usePageMeta'
import { useCopy } from '../cms/CmsContext'

const approach = [
  { t: 'Understand', d: 'We start with the menu: what’s being served, how it travels, and how many merchants or outlets need packaging.' },
  { t: 'Specify', d: 'Together we shape sizes, materials, print and finishes so the packaging fits both the food and the brand.' },
  { t: 'Match', d: 'We introduce you to vendors and manufacturers suited to the brief, instead of leaving you to search alone.' },
  { t: 'Coordinate', d: 'You compare quotes and samples directly with vendors, with The Pack Up helping keep requirements clear throughout.' },
]

export default function About() {
  const t = useCopy()
  usePageMeta('About', 'The Pack Up is the bridge between restaurants and food brands and the packaging vendors and manufacturers who make their packaging.')

  return (
    <>
      <PageHero
        eyebrow={t('about.heroEyebrow')}
        title={t('about.heroTitle')}
        text={t('about.heroText')}
      />

      {/* Story */}
      <section className="py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead eyebrow={t('about.storyEyebrow')} title={t('about.storyTitle')} />
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              {t('about.storyText').startsWith('Add the founding story') ? (
                <Placeholder note="Editable placeholder — Our Story">{t('about.storyText')}</Placeholder>
              ) : (
                <p className="lead max-w-2xl whitespace-pre-line text-charcoal/75">{t('about.storyText')}</p>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="container-x grid items-center gap-16 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <Parallax distance={30}>
              <ArtTile kind="container" merchantId="crust-ember" tone="charcoal" className="aspect-[4/5]" pad="p-4" />
            </Parallax>
          </div>
          <div className="lg:col-span-7">
            <Reveal y={12}>
              <p className="eyebrow">{t('about.whoEyebrow')}</p>
            </Reveal>
            <WordReveal className="display-lg mt-5 max-w-2xl" text={t('about.whoTitle')} />
            <Reveal delay={0.2}>
              <p className="lead mt-8 max-w-2xl text-charcoal/75">
                {t('about.whoP1')}
              </p>
              <p className="lead mt-5 max-w-2xl text-charcoal/75">
                {t('about.whoP2')}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <DarkPanel className="py-20 lg:py-28">
        <div className="container-x relative grid gap-5 lg:grid-cols-2">
          {[
            { k: 'Our vision', t: 'Packaging that carries every brand beautifully.', d: 'To be the trusted bridge between food businesses and the packaging makers who bring their brands to life — one box, one bag, one meal at a time.' },
            { k: 'Our mission', t: 'Make good packaging simple to source.', d: 'To help restaurants and merchants find, specify and source packaging that protects their food, represents their brand, and respects the planet where possible.' },
          ].map((b) => (
            <Reveal key={b.k}>
              <div className="glass-dark h-full rounded-[2rem] p-9 lg:p-14">
                <p className="eyebrow">{b.k}</p>
                <h2 className="display-md mt-5">{b.t}</h2>
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ivory/65">{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </DarkPanel>

      {/* Approach */}
      <section className="py-24 lg:py-32">
        <div className="container-x">
          <SectionHead eyebrow="Our approach" title="From first brief to finished box." className="mb-16" />
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {approach.map((a, i) => (
              <Reveal key={a.t} delay={i * 0.08} className="h-full">
                <li className="card h-full p-8 lg:p-10">
                  <span className="gold-text font-display text-6xl italic">0{i + 1}</span>
                  <h3 className="mt-6 font-display text-3xl">{a.t}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-charcoal/65">{a.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* How we connect */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="container-x">
          <SectionHead eyebrow="How we connect customers and vendors" title="One conversation. The right vendors." text="Instead of chasing quotes from dozens of suppliers, merchants brief The Pack Up once. We help shape the requirement and connect it with vendors who can deliver." className="mb-16" />
          <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {[
              { h: 'Restaurants & merchants', p: 'Pizzerias, cloud kitchens, cafés and food brands with packaging needs.', dark: false },
              { h: 'The Pack Up', p: 'We shape the brief, match it to suitable vendors and help keep the process moving.', dark: true },
              { h: 'Vendors & manufacturers', p: 'Packaging suppliers and makers who respond with specifications, samples and pricing.', dark: false },
            ].map((n, i) => (
              <Fragment key={n.h}>
                {i > 0 && (
                  <div className="hidden items-center justify-center text-gold lg:flex" aria-hidden="true">
                    <ArrowRight size={28} />
                  </div>
                )}
                <Reveal delay={i * 0.12} className={`flex flex-col justify-center rounded-[2rem] p-10 text-center ${n.dark ? 'aurora rounded-[2rem] text-ivory' : 'card'}`}>
                  <h3 className="font-display text-3xl">{n.h}</h3>
                  <p className={`mt-3 text-[15px] leading-relaxed ${n.dark ? 'text-ivory/65' : 'text-charcoal/65'}`}>{n.p}</p>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Let’s talk about your packaging." label="Contact Our Team" />
    </>
  )
}
