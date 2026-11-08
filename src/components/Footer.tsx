import { Link } from 'react-router-dom'
import Logo from './Logo'
import { InstagramIcon, LinkedInIcon, FacebookIcon } from './icons'
import { nav, placeholder } from '../data/site'
import { useCategories, useSite } from '../cms/CmsContext'


const socials = [
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
] as const

function Slot({ value, fallback }: { value: string; fallback: string }) {
  return value ? <span>{value}</span> : <span className="text-ivory/45">{fallback}</span>
}

export default function Footer() {
  const site = useSite()
  const categories = useCategories()
  return (
    <footer className="aurora relative overflow-hidden rounded-t-[2.5rem] text-ivory lg:rounded-t-[4rem]">
      <div className="container-x pb-10 pt-20 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo className="text-ivory" tagline markSize={46} />
            <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-ivory/65">
              The Pack Up connects restaurants and food brands with packaging vendors and manufacturers — so every merchant gets packaging that looks like
              theirs.
            </p>
            <div className="mt-8 flex gap-3">
              {socials.map(({ key, label, Icon }) => {
                const url = site.social[key]
                const cls = 'flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 bg-white/[0.04] transition-colors'
                return url ? (
                  <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={label} className={`${cls} hover:border-gold hover:text-gold`}>
                    <Icon />
                  </a>
                ) : (
                  <span key={key} aria-label={`${label} (link not set yet)`} title="Add this link in src/data/site.ts" className={`${cls} cursor-not-allowed text-ivory/35`}>
                    <Icon />
                  </span>
                )
              })}
            </div>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h3 className="eyebrow !font-sans">Explore</h3>
            <ul className="mt-6 space-y-3 text-[15px]">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-ivory/70 transition-colors hover:text-gold">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="eyebrow !font-sans">Packaging</h3>
            <ul className="mt-6 space-y-3 text-[15px]">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/solutions#${c.slug}`} className="text-ivory/70 transition-colors hover:text-gold">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="eyebrow !font-sans">Contact</h3>
            <ul className="mt-6 space-y-3 text-[15px] text-ivory/70">
              <li>
                <Slot value={site.email} fallback={placeholder.email} />
              </li>
              <li>
                <Slot value={site.phone} fallback={placeholder.phone} />
              </li>
              <li>
                <Slot value={site.location} fallback={placeholder.location} />
              </li>
            </ul>
            <Link to="/contact" className="mt-6 inline-block border-b border-gold pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">
              Send an enquiry
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none mt-20 select-none font-display text-[clamp(3rem,15vw,13rem)] font-medium uppercase leading-none tracking-[0.04em] text-ivory/[0.05]">
          The Pack Up
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-ivory/10 pt-6 text-[12px] text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The Pack Up. All rights reserved.</p>
          <p>Brand names shown in packaging concepts are fictional samples.</p>
        </div>
      </div>
    </footer>
  )
}
