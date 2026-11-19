import { Link } from 'react-router-dom'
import Logo from './Logo'
import { InstagramIcon, LinkedInIcon, FacebookIcon } from './icons'
import { navFlat, placeholder, EXPLORE_LABEL } from '../data/site'
import { useMarketplace } from './ExploreButton'
import { useCategories, useSite } from '../cms/CmsContext'

const socials = [
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
] as const

function Slot({ value, fallback }: { value: string; fallback: string }) {
  return value ? <span>{value}</span> : <span className="text-white/40">{fallback}</span>
}

export default function Footer() {
  const site = useSite()
  const market = useMarketplace()
  const categories = useCategories()
  return (
    <footer className="navy overflow-hidden">
      <div className="container-x pb-8 pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tagline onDark height={78} />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/65">Simple solutions for a bigger tomorrow. Packaging from verified vendors, stored and delivered for your business.</p>
            <div className="mt-7 flex gap-3">
              {socials.map(({ key, label, Icon }) => {
                const url = site.social[key]
                const cls = 'flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 transition-colors'
                return url ? (
                  <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={label} className={`${cls} hover:border-gold hover:text-gold`}>
                    <Icon />
                  </a>
                ) : (
                  <span key={key} aria-label={`${label} (link not set yet)`} title="Add this link in the admin → Contact & links" className={`${cls} cursor-not-allowed text-white/35`}>
                    <Icon />
                  </span>
                )
              })}
            </div>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h3 className="eyebrow !text-[11px]">Explore</h3>
            <ul className="mt-5 space-y-3 text-[15px]">
              {navFlat.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-white/70 transition-colors hover:text-gold">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="eyebrow !text-[11px]">Packaging</h3>
            <ul className="mt-5 space-y-3 text-[15px]">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/packaging#${c.slug}`} className="text-white/70 transition-colors hover:text-gold">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="eyebrow !text-[11px]">Contact</h3>
            <ul className="mt-5 space-y-3 text-[15px] text-white/70">
              <li><Slot value={site.email} fallback={placeholder.email} /></li>
              <li><Slot value={site.phone} fallback={placeholder.phone} /></li>
              <li><Slot value={site.location} fallback={placeholder.location} /></li>
            </ul>
            {market.external ? (
              <a href={market.href} {...(market.newTab ? { target: '_blank', rel: 'noopener' } : {})} className="mt-6 inline-flex rounded-xl bg-gold px-5 py-2.5 text-[14px] font-semibold text-charcoal transition hover:brightness-105">
                {EXPLORE_LABEL}
              </a>
            ) : (
              <Link to={market.to} className="mt-6 inline-flex rounded-xl bg-gold px-5 py-2.5 text-[14px] font-semibold text-charcoal transition hover:brightness-105">
                {EXPLORE_LABEL}
              </Link>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Packup. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link to="/privacy" className="underline-offset-4 hover:text-gold hover:underline">Privacy</Link>
            <span>Brand names shown in packaging concepts are fictional samples.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
