import type { SVGProps } from 'react'

const base = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const

export const InstagramIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
)
export const LinkedInIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v6M8 7.5v.01M12 17v-6m0 2.5c0-1.4 1-2.5 2.4-2.5S17 12 17 13.5V17" /></svg>
)
export const FacebookIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M14 8h2.5V4.5H14C11.8 4.5 10.5 5.9 10.5 8v2H8v3.5h2.5V20H14v-6.5h2.3l.5-3.5H14V8.4c0-.3.2-.4.5-.4Z" /></svg>
)

/* ---- Packup service icons (match the brand: box / warehouse / delivery truck) ---- */
export const PackIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M12 2.8 20 7v10l-8 4.2L4 17V7Z" /><path d="m4 7 8 4.2L20 7M12 11.2v10" /><path d="m8 4.9 8 4.2" /></svg>
)
export const StoreIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M3 10.5 12 4l9 6.5V20H3Z" /><path d="M7.5 20v-6h9v6M7.5 17h9" /></svg>
)
export const DeliverIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M2.5 6.5h11V16h-11zM13.5 9.5h4l3 3V16h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /><path d="M1 9.5h3M0 12.5h3" /></svg>
)
