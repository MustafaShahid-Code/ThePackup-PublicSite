import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import EnquiryForm from '../components/EnquiryForm'
import { CtaBand, PageHero } from '../components/shared'
import { Reveal } from '../components/motion'
import { InstagramIcon, LinkedInIcon, FacebookIcon } from '../components/icons'
import { usePageMeta } from '../components/usePageMeta'
import { placeholder } from '../data/site'
import { useCopy, useSite } from '../cms/CmsContext'

function Row({ Icon, label, value, fallback, href }: { Icon: typeof Mail; label: string; value: string; fallback: string; href?: string }) {
  return (
    <li className="flex gap-5 border-t border-charcoal/12 py-6">
      <Icon size={22} strokeWidth={1.4} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/50">{label}</p>
        {value ? (
          href ? (
            <a href={href} className="mt-1 block text-[17px] hover:text-gold">
              {value}
            </a>
          ) : (
            <p className="mt-1 text-[17px]">{value}</p>
          )
        ) : (
          <p className="mt-1 text-[16px] italic text-charcoal/45">{fallback}</p>
        )}
      </div>
    </li>
  )
}

export default function Contact() {
  const site = useSite()
  const t = useCopy()
  usePageMeta('Contact', 'Contact The Pack Up about restaurant packaging — pizza boxes, takeaway containers, bags and cups. Send an enquiry and we’ll connect you with suitable vendors.')
  const [params] = useSearchParams()
  const category = params.get('category') ?? ''

  const social = [
    { k: 'instagram', label: 'Instagram', Icon: InstagramIcon },
    { k: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
    { k: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  ] as const

  return (
    <>
      <PageHero eyebrow="Contact us" title={t('contact.heroTitle')} text={t('contact.heroText')} />

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="display-md">Contact details</h2>
              <ul className="mt-8 border-b border-charcoal/12">
                <Row Icon={Mail} label="Business email" value={site.email} fallback={placeholder.email} href={site.email ? `mailto:${site.email}` : undefined} />
                <Row Icon={Phone} label="Phone" value={site.phone} fallback={placeholder.phone} href={site.phone ? `tel:${site.phone.replace(/\s/g, '')}` : undefined} />
                <Row Icon={MapPin} label="Office location" value={site.location} fallback={placeholder.location} />
                <Row Icon={Clock} label="Response time" value="" fallback="[ Add typical response time ]" />
              </ul>
              <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/50">Follow</p>
                <div className="mt-4 flex gap-3">
                  {social.map(({ k, label, Icon }) =>
                    site.social[k] ? (
                      <a key={k} href={site.social[k]} target="_blank" rel="noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/25 transition-colors hover:border-gold hover:text-[#9A7C45]">
                        <Icon />
                      </a>
                    ) : (
                      <span key={k} aria-label={`${label} (link not set yet)`} title="Add this link in src/data/site.ts" className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-full border border-dashed border-gold/70 text-charcoal/40">
                        <Icon />
                      </span>
                    ),
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="card p-7 sm:p-10">
                <h2 className="display-md">Send an enquiry</h2>
                <p className="mb-9 mt-3 text-[15px] text-charcoal/60">Fields marked <span className="text-gold">*</span> are required.</p>
                <EnquiryForm mode="contact" defaultCategory={category} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand title="Prefer to see some ideas first?" text="Browse packaging concepts for pizzerias, burger joints, cafés and more." label="Browse the Showcase" to="/our-work" />
    </>
  )
}
