/** Packup logo — vector files live in /public/brand (logo-full-*.svg, logo-mark*.svg, logo-icon.svg). */
export function LogoMark({ size = 40, className = '', light = false }: { size?: number; className?: string; light?: boolean }) {
  return <img src={light ? '/brand/logo-mark-light.svg' : '/brand/logo-mark.svg'} width={size} height={size} alt="" aria-hidden="true" className={className} />
}

/** `onDark` swaps to the white wordmark. `tagline` adds "PACK • STORE • DELIVER". `height` is the rendered height in px. */
export default function Logo({ onDark = false, tagline = false, height = 34, className = '' }: { onDark?: boolean; tagline?: boolean; height?: number; className?: string }) {
  const src = `/brand/logo-full-${tagline ? 'tagline' : onDark ? 'light' : 'dark'}${tagline && onDark ? '-light' : ''}.svg`
  return <img src={src} alt="Packup" style={{ height }} className={`w-auto ${className}`} />
}
