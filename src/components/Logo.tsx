import { useId } from 'react'

/**
 * The Pack Up logo mark — a gold arch bridge carrying a parcel — the link between
 * a parcel crossing the bridge between kitchen and vendor. Vector source files live in /public/brand.
 */
export function LogoMark({ size = 40, className = '' }: { size?: number; className?: string }) {
  const u = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
<defs>
  <linearGradient id={`${u}-gold`} x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor="#FBEBC0"/><stop offset="0.5" stopColor="#E3C688"/><stop offset="1" stopColor="#B38D4C"/>
  </linearGradient>
  <linearGradient id={`${u}-deep`} x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0" stopColor="#C9A25A"/><stop offset="1" stopColor="#7A5C2C"/>
  </linearGradient>
  <linearGradient id={`${u}-top`} x1="0.1" y1="0" x2="0.9" y2="1">
    <stop offset="0" stopColor="#FFF3CF"/><stop offset="1" stopColor="#E3C688"/>
  </linearGradient>
  <linearGradient id={`${u}-lft`} x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor="#DDBB77"/><stop offset="1" stopColor="#B08A4A"/>
  </linearGradient>
  <linearGradient id={`${u}-rgt`} x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor="#B58F50"/><stop offset="1" stopColor="#7C5E2D"/>
  </linearGradient>
  <radialGradient id={`${u}-glow`} cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stopColor="#FFF1C9" stopOpacity="0.55"/><stop offset="1" stopColor="#E3C688" stopOpacity="0"/>
  </radialGradient>
</defs>

<ellipse cx="60" cy="40" rx="34" ry="30" fill={`url(#${u}-glow)`}/>

<path d="M16 110Q60 30 104 110" fill="none" stroke={`url(#${u}-gold)`} strokeWidth="8"/>
<path d="M16 110Q60 30 104 110" fill="none" stroke="#150F0B" strokeOpacity="0.25" strokeWidth="1" transform="translate(0 4.5)"/>

<path d="M34 71V80M46 71V70.5M74 71V70.5M86 71V80" stroke="#E3C688" strokeOpacity="0.9" strokeWidth="2.2" strokeLinecap="round"/>

<path d="M8 104H26V113H8ZM94 104H112V113H94Z" fill={`url(#${u}-deep)`}/>

<rect x="2" y="63" width="116" height="8" rx="4" fill={`url(#${u}-gold)`}/>
<rect x="4" y="63" width="112" height="2" rx="1" fill="#FFF6DC" fillOpacity="0.6"/>

<path d="M40 40 60 51.5V63L40 51.5Z" fill={`url(#${u}-lft)`}/>
<path d="M60 51.5 80 40V51.5L60 63Z" fill={`url(#${u}-rgt)`}/>
<path d="M60 28.5 80 40 60 51.5 40 40Z" fill={`url(#${u}-top)`}/>
<path d="M48 35.6 53 32.8 72 43.8 67 46.6Z" fill="#241A13" fillOpacity="0.88"/>
<path d="M67 46.6 72 43.8V47.6L67 50.4Z" fill="#241A13" fillOpacity="0.6"/>
<path d="M60 28.5 80 40 60 51.5 40 40Z" fill="none" stroke="#FFF6DC" strokeOpacity="0.75" strokeWidth="0.7" strokeLinejoin="round"/>

<path d="M98 8 99.9 13.6 105.5 15.5 99.9 17.4 98 23 96.1 17.4 90.5 15.5 96.1 13.6Z" fill="#F6E2AE"/>
<path d="M108 27 108.8 29.2 111 30 108.8 30.8 108 33 107.2 30.8 105 30 107.2 29.2Z" fill="#E3C688" fillOpacity="0.85"/>
    </svg>
  )
}

export default function Logo({ className = '', tagline = false, markSize = 40 }: { className?: string; tagline?: boolean; markSize?: number }) {
  return (
    <span className={`inline-flex items-center gap-3.5 ${className}`}>
      <LogoMark size={markSize} />
      <span className="flex flex-col">
        <span className="font-display text-[19px] font-bold uppercase leading-none tracking-[0.26em]">The Pack Up</span>
        {tagline && (
          <span className="mt-1.5 hidden font-sans text-[8.5px] font-bold uppercase leading-none tracking-[0.42em] text-gold sm:block">Packaging Vendor Network</span>
        )}
      </span>
    </span>
  )
}
