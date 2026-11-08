import { Eye, FileText, Handshake, Layers, MessagesSquare, Route } from 'lucide-react'
import EnquiryForm from '../components/EnquiryForm'
import { DarkPanel, PageHero, SectionHead } from '../components/shared'
import { Reveal, WordReveal } from '../components/motion'
import { usePageMeta } from '../components/usePageMeta'
import { useCopy } from '../cms/CmsContext'

const steps = [
  { t: 'A merchant sends a brief', d: 'A restaurant or food brand tells us what it needs to package — items, quantities, branding and timelines.' },
  { t: 'We shape the requirement', d: 'The Pack Up turns the brief into a clear specification that vendors can respond to quickly.' },
  { t: 'Suitable vendors are introduced', d: 'We connect the requirement with vendors and manufacturers whose products and capabilities fit.' },
  { t: 'Vendors respond directly', d: 'Vendors share specifications, samples and pricing with the merchant, with The Pack Up helping keep things on track.' },
]

const benefits = [
  { Icon: MessagesSquare, t: 'Qualified conversations', d: 'Enquiries arrive with sizes, materials and branding already thought through.' },
  { Icon: Layers, t: 'A place for your range', d: 'Showcase the formats you make — from corrugated boxes to cups and containers.' },
  { Icon: Handshake, t: 'One relationship, many merchants', d: 'Work with The Pack Up as a single point of contact for multiple restaurants and brands.' },
  { Icon: FileText, t: 'Clear briefs', d: 'We help merchants specify what they need so quotes are faster and more accurate.' },
  { Icon: Route, t: 'Straightforward onboarding', d: 'Tell us about your products and capabilities, and we’ll discuss how best to work together.' },
  { Icon: Eye, t: 'Visibility with food brands', d: 'Be considered when restaurants and merchants look for packaging partners.' },
]

export default function Vendors() {
  const t = useCopy()
  usePageMeta('Vendor Network', 'Become part of The Pack Up vendor network — packaging manufacturers and suppliers connected with restaurants and food merchants.')

  return (
    <>
      <PageHero
        eyebrow="Vendor network"
        title={t('vendors.heroTitle')}
        text={t('vendors.heroText')}
      >
        <a href="#vendor-form" className="inline-block border-b border-gold pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">
          Become a vendor ↓
        </a>
      </PageHero>

      {/* How it works */}
      <section className="py-24 lg:py-32">
        <div className="container-x">
          <SectionHead eyebrow="How our network works" title="From merchant brief to vendor quote." className="mb-16" />
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08} className="h-full">
                <li className="card h-full p-8 lg:p-10">
                  <span className="gold-text font-display text-6xl italic">0{i + 1}</span>
                  <h3 className="mt-6 font-display text-[28px] leading-tight">{s.t}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-charcoal/65">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-8 max-w-3xl rounded-2xl bg-cream p-5 text-[14px] leading-relaxed text-charcoal/65">
            The Pack Up connects businesses with packaging suppliers and helps facilitate packaging requirements. It is not a self-serve marketplace, and
            joining the network does not imply any certification or endorsement — product details, pricing and terms are agreed directly between vendor and
            merchant.
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <DarkPanel className="py-24 lg:py-32">
        <div className="container-x relative">
          <SectionHead dark eyebrow="Vendor partnership benefits" title="Why vendors partner with us." className="mb-16" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ Icon, t, d }, i) => (
              <Reveal key={t} delay={(i % 3) * 0.08} className="h-full">
                <li className="group h-full rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-9 transition-colors hover:border-gold/60 hover:bg-white/[0.07]">
                  <Icon className="text-gold" size={30} strokeWidth={1.3} aria-hidden="true" />
                  <h3 className="mt-6 font-display text-3xl">{t}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ivory/60">{d}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </DarkPanel>

      {/* Form */}
      <section id="vendor-form" className="scroll-mt-20 py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal y={12}>
              <p className="eyebrow">Become a vendor</p>
            </Reveal>
            <WordReveal className="display-lg mt-5" text={t('vendors.formTitle')} />
            <Reveal delay={0.2}>
              <p className="lead mt-6 max-w-md text-charcoal/70">
                {t('vendors.formText')}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <EnquiryForm mode="vendor" />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
