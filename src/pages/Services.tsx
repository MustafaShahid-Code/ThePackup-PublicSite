import { Check } from 'lucide-react'
import Button from '../components/Button'
import { DeliverIcon, PackIcon, StoreIcon } from '../components/icons'
import { CtaBand, PageHero } from '../components/shared'
import { Reveal } from '../components/motion'
import { usePageMeta } from '../components/usePageMeta'
import { useCopy } from '../cms/CmsContext'

const blocks = [
  { key: 'pack', Icon: PackIcon, n: '01' },
  { key: 'store', Icon: StoreIcon, n: '02' },
  { key: 'deliver', Icon: DeliverIcon, n: '03' },
] as const

export default function Services() {
  const t = useCopy()
  usePageMeta('Services', 'Packup services: packaging sourced from verified vendors, storage for your stock, and reliable delivery to your business.')
  return (
    <>
      <PageHero eyebrow={t('services.heroEyebrow')} title={t('services.heroTitle')} text={t('services.heroText')}>
        <nav aria-label="Services" className="flex flex-wrap gap-2">
          {blocks.map(({ key, Icon }) => (
            <a key={key} href={`#${key}`} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-[15px] font-medium transition-colors hover:border-gold hover:text-gold">
              <Icon width={18} height={18} /> {t(`${key}.title`)}
            </a>
          ))}
        </nav>
      </PageHero>

      {blocks.map(({ key, Icon, n }, i) => (
        <section key={key} id={key} className={`ambient scroll-mt-20 py-20 lg:py-28 ${i % 2 === 1 ? 'bg-cream' : ''}`}>
          <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
              <Reveal>
                <div className="navy flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[28px]">
                  <div className="text-center">
                    <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gold text-charcoal">
                      <Icon width={50} height={50} strokeWidth={1.6} />
                    </span>
                    <p className="mt-6 font-display text-[clamp(3rem,7vw,5rem)] font-bold leading-none">{t(`${key}.title`)}</p>
                    <p className="mt-3 font-display text-[18px] font-semibold text-white/40">{n} / 03</p>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
              <Reveal>
                <p className="eyebrow">Step {n}</p>
                <h2 className="display-lg mt-4">{t(`${key}.text`)}</h2>
                <p className="lead mt-6 max-w-2xl text-charcoal/75">{t(`${key}.detail`)}</p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((b) => (
                    <li key={b} className="card flex gap-3 p-4 text-[15px] leading-snug">
                      <Check size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                      {t(`${key}.b${b}`)}
                    </li>
                  ))}
                </ul>
                <div className="mt-9">
                  <Button to="/contact" variant="dark">
                    Get a quote
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section className="pb-6">
        <div className="container-x">
          <div className="card flex flex-col gap-2 border-l-4 !border-l-gold p-6 sm:p-8">
            <h2 className="text-[18px] font-semibold">{t('services.noteTitle')}</h2>
            <p className="max-w-3xl text-[15.5px] leading-relaxed text-charcoal/70">{t('services.note')}</p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
