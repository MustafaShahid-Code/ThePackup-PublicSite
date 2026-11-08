import type { ReactNode } from 'react'
import { Packaging, toneStyles, type Finish, type PackKind, type Tone } from './Packaging'
import { getMerchant } from '../data/merchants'
import { useCopy } from '../cms/CmsContext'
import { WordReveal, Reveal } from './motion'
import Button from './Button'

/** Dark editorial hero used at the top of every inner page. */
export function PageHero({ eyebrow, title, text, children }: { eyebrow: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <section className="aurora grain relative overflow-hidden rounded-b-[2.5rem] pb-20 pt-40 text-ivory lg:rounded-b-[4rem] lg:pb-28 lg:pt-52">
      <div className="container-x relative">
        <Reveal y={12}>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <WordReveal as="h1" immediate delay={0.15} className="display-xl mt-6 max-w-5xl" text={title} />
        {text && (
          <Reveal delay={0.5}>
            <p className="lead mt-8 max-w-2xl text-ivory/70">{text}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.65} className="mt-10">{children}</Reveal>}
      </div>
    </section>
  )
}

/** Inset, rounded dark panel (aurora background) used for mid-page dark sections. */
export function DarkPanel({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className="px-3 py-3 sm:px-5">
      <div className={`aurora grain relative overflow-hidden rounded-[2rem] text-ivory sm:rounded-[3rem] ${className}`}>{children}</div>
    </section>
  )
}

/** Closing call-to-action panel. */
export function CtaBand({
  title: titleProp,
  text: textProp,
  label = 'Contact Our Team',
  to = '/contact',
}: {
  title?: string
  text?: string
  label?: string
  to?: string
}) {
  const t = useCopy()
  const title = titleProp ?? t('cta.title')
  const text = textProp ?? t('cta.text')
  return (
    <DarkPanel className="py-24 lg:py-36">
      <div className="container-x relative text-center">
        <Reveal y={12}>
          <p className="eyebrow">Start a conversation</p>
        </Reveal>
        <WordReveal className="display-lg mx-auto mt-6 max-w-4xl" text={title} />
        <Reveal delay={0.3}>
          <p className="lead mx-auto mt-6 max-w-xl text-ivory/65">{text}</p>
          <div className="mt-10">
            <Button to={to} variant="gold">
              {label}
            </Button>
          </div>
        </Reveal>
      </div>
    </DarkPanel>
  )
}

/** Visibly marks content that needs real information before launch. */
export function Placeholder({ children, note = 'Editable placeholder' }: { children: ReactNode; note?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-gold/80 bg-gold/[0.08] p-6">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9A7C45]">{note}</p>
      <div className="text-[15px] leading-relaxed text-charcoal/70">{children}</div>
    </div>
  )
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
    <div className={`grain relative overflow-hidden rounded-[28px] ${className}`} style={{ background: t.bg }}>
      <div aria-hidden="true" className="absolute inset-0" style={{ background: t.spot }} />
      {image ? (
        <img src={image} alt={alt ?? ''} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <Packaging kind={kind} merchant={getMerchant(merchantId)} finish={finish} className={`relative h-full w-full ${pad}`} />
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px]" style={{ background: t.vignette, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14), inset 0 1px 0 rgba(255,255,255,0.3)' }} />
    </div>
  )
}

export function SectionHead({ eyebrow, title, text, dark = false, className = '' }: { eyebrow: string; title: string; text?: string; dark?: boolean; className?: string }) {
  return (
    <div className={className}>
      <Reveal y={12}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <WordReveal className="display-lg mt-5 max-w-3xl" text={title} />
      {text && (
        <Reveal delay={0.2}>
          <p className={`lead mt-6 max-w-2xl ${dark ? 'text-ivory/65' : 'text-charcoal/70'}`}>{text}</p>
        </Reveal>
      )}
    </div>
  )
}
