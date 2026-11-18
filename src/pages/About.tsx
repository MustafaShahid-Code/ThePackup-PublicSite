import { Briefcase, Handshake, Truck } from 'lucide-react'
import { CtaBand, PageHero, Placeholder, SectionHead } from '../components/shared'
import { Reveal } from '../components/motion'
import { usePageMeta } from '../components/usePageMeta'
import { useCopy } from '../cms/CmsContext'

const roles = [
  { Icon: Briefcase, t: 'Businesses', d: 'Restaurants, cloud kitchens, cafés and brands tell us what they need once, and we do the chasing.' },
  { Icon: Handshake, t: 'Verified vendors', d: 'Manufacturers and suppliers receive clear briefs and respond with specifications and pricing.' },
  { Icon: Truck, t: 'Packup in the middle', d: 'We match the two sides, hold stock when needed and coordinate delivery to your door.' },
]

export default function About() {
  const t = useCopy()
  usePageMeta('About', 'Packup connects businesses with verified packaging vendors, then stores and delivers packaging for them.')
  return (
    <>
      <PageHero eyebrow={t('about.heroEyebrow')} title={t('about.heroTitle')} text={t('about.heroText')} />

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead eyebrow={t('about.whoEyebrow')} title={t('about.whoTitle')} />
          </div>
          <Reveal className="space-y-6 lg:col-span-7">
            <p className="lead text-charcoal/80">{t('about.whoP1')}</p>
            <p className="lead text-charcoal/70">{t('about.whoP2')}</p>
          </Reveal>
        </div>
      </section>

      <section className="ambient bg-cream py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="How the pieces fit" title="Three sides of one simple process." className="mb-12" />
          <ul className="grid gap-5 md:grid-cols-3">
            {roles.map(({ Icon, t: title, d }, i) => (
              <Reveal key={title} delay={i * 0.08} className="h-full">
                <li className={`h-full rounded-[20px] p-8 ${i === 1 ? 'navy text-white' : 'card'}`}>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${i === 1 ? 'bg-gold text-charcoal' : 'bg-charcoal text-gold'}`}>
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-[21px] font-semibold">{title}</h3>
                  <p className={`mt-2.5 text-[15.5px] leading-relaxed ${i === 1 ? 'text-white/75' : 'text-charcoal/65'}`}>{d}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead eyebrow={t('about.storyEyebrow')} title={t('about.storyTitle')} />
          </div>
          <Reveal className="lg:col-span-7">
            <Placeholder note="Add your story">
              <p>{t('about.storyText')}</p>
            </Placeholder>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
