import type { ReactNode } from 'react'
import { Packaging, toneStyles, type Finish, type PackKind, type Tone } from './Packaging'
import { getMerchant } from '../data/merchants'
import { useCopy } from '../cms/CmsContext'
import { WordReveal, Reveal } from './motion'
import Button from './Button'

/** Navy hero used at the top of every inner page. */
export function PageHero({ eyebrow, title, text, children }: { eyebrow: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <section className="navy overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-44">
      <div className="container-x relative">
        <Reveal y={10}>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <WordReveal as="h1" immediate delay={0.1} className="display-xl mt-5 max-w-4xl text-[clamp(2.3rem,5.6vw,4.4rem)]" text={title} />
        {text && (
          <Reveal delay={0.35}>
            <p className="lead mt-7 max-w-2xl text-white/75">{text}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.5} className="mt-9">{children}</Reveal>}
      </div>
    </section>
  )
}

/** Navy section wrapper for mid-page dark sections. */
export function DarkPanel({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`navy overflow-hidden ${className}`}>
      {children}
    </section>
  )
}

/** Closing call-to-action band — the brand orange. */
export function CtaBand({ title: titleProp, text: textProp, label = 'Get in touch', to = '/contact' }: { title?: string; text?: string; label?: string; to?: string }) {
  const t = useCopy()
  const title = titleProp ?? t('cta.title')
  const text = textProp ?? t('cta.text')
  return (
    <section className="py-14 lg:py-20">
      <div className="container-x">
      <div className="relative overflow-hidden rounded-[28px] bg-gold px-6 py-14 text-charcoal sm:px-12 lg:py-20">
        <svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute -right-10 -top-10 h-[360px] w-[360px] opacity-[0.13] sm:h-[460px] sm:w-[460px]" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M100 10 178 55V145L100 190 22 145V55ZM100 100V190M100 100 22 55M100 100 178 55" />
        </svg>
        <div className="relative max-w-2xl">
          <Reveal>
            <h2 className="display-lg">{title}</h2>
            <p className="lead mt-5 max-w-xl text-charcoal/80">{text}</p>
            <div className="mt-8">
              <Button to={to} variant="dark">
                {label}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
      </div>
    </section>
  )
}

/** Visibly marks content that needs real information before launch. */
export function Placeholder({ children, note = 'Editable placeholder' }: { children: ReactNode; note?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gold bg-gold/[0.08] p-6">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-deep">{note}</p>
      <div className="text-[15px] leading-relaxed text-charcoal/70">{children}</div>
    </div>
  )
}

/** Images optimised by the server (`*.opt.webp`) come with 640/1200px variants — let the browser pick. */
export function responsiveSrcSet(src: string): string | undefined {
  if (!/^\/uploads\/[\w-]+\.opt\.webp$/.test(src)) return undefined
  const b = src.replace(/\.opt\.webp$/, '')
  return `${b}.opt-640.webp 640w, ${b}.opt-1200.webp 1200w, ${src} 2560w`
}

/** A toned, rounded tile showing a packaging illustration — or a real photo when `image` is set. */
export function ArtTile({
  kind,
  merchantId,
  finish,
  tone,
  image,
  alt,
  className = '',
  pad = 'p-6',
}: {
  kind: PackKind
  merchantId: string
  finish?: Finish
  tone: Tone
  image?: string
  alt?: string
  className?: string
  pad?: string
}) {
  const t = toneStyles[tone]
  return (
    <div className={`relative overflow-hidden rounded-[20px] ${className}`} style={{ background: t.bg }}>
      <div aria-hidden="true" className="absolute inset-0" style={{ background: t.spot }} />
      {image ? (
        <img
          src={image}
          srcSet={responsiveSrcSet(image)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={alt ?? ''}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Packaging kind={kind} merchant={getMerchant(merchantId)} finish={finish} className={`relative h-full w-full ${pad}`} />
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[20px]" style={{ background: t.vignette }} />
    </div>
  )
}

export function SectionHead({ eyebrow, title, text, dark = false, center = false, className = '' }: { eyebrow: string; title: string; text?: string; dark?: boolean; center?: boolean; className?: string }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} ${className}`}>
      <Reveal y={10}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <WordReveal className={`display-lg mt-4 max-w-3xl ${center ? 'mx-auto' : ''}`} text={title} />
      {text && (
        <Reveal delay={0.15}>
          <p className={`lead mt-5 max-w-2xl ${center ? 'mx-auto' : ''} ${dark ? 'text-white/70' : 'text-charcoal/70'}`}>{text}</p>
        </Reveal>
      )}
    </div>
  )
}
