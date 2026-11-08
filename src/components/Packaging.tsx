import { useId } from 'react'
import { luminance, type Merchant } from '../data/merchants'

export type PackKind = 'pizza' | 'burger' | 'lunch' | 'container' | 'bag' | 'cup' | 'fries' | 'bakery' | 'eco'
export type Finish = 'branded' | 'kraft' | 'white' | 'black'

export const kindLabel: Record<PackKind, string> = {
  pizza: 'pizza box',
  burger: 'burger clamshell',
  lunch: 'lunch box',
  container: 'takeaway container',
  bag: 'paper bag',
  cup: 'paper cup',
  fries: 'fry sleeve',
  bakery: 'bakery window box',
  eco: 'fibre bowl',
}

const KRAFT = '#C39A64'
const KRAFT_L = '#D9B987'
const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS = "Manrope, system-ui, sans-serif"

const fit = (text: string, maxW: number, base: number) => Math.min(base, Math.floor(maxW / (text.length * 0.5)))
const onColor = (hex: string) => (luminance(hex) > 0.35 ? '#171717' : '#FFF8EE')

/* ------------------------------------------------------------------ */
/* Pizza box top face                                                  */
/* ------------------------------------------------------------------ */

export function pizzaColors(m: Merchant, finish: Finish) {
  const oneColour = luminance(m.bg) > 0.6 ? m.accent : m.bg
  switch (finish) {
    case 'kraft':
      return { base: KRAFT, ink: oneColour, accent: oneColour, branded: false }
    case 'white':
      return { base: '#F7F3EA', ink: oneColour, accent: oneColour, branded: false }
    case 'black':
      return { base: '#1B1B1B', ink: '#F5F1E9', accent: m.accent, branded: false }
    default:
      return { base: m.bg, ink: m.ink, accent: m.accent, branded: true }
  }
}

export function PizzaFaceSvg({ merchant: m, finish = 'branded', className }: { merchant: Merchant; finish?: Finish; className?: string }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={`${m.name} pizza box lid`} preserveAspectRatio="xMidYMid meet">
      <PizzaFace uid={uid} m={m} finish={finish} />
    </svg>
  )
}

function PizzaFace({ uid, m, finish }: { uid: string; m: Merchant; finish: Finish }) {
  const c = pizzaColors(m, finish)
  const band = c.branded ? c.accent : c.ink
  const slices = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4 + Math.PI / 8)
  const peps = [
    [200, 130], [235, 160], [222, 200], [178, 200], [165, 160], [200, 168],
  ]
  const nameSize = fit(m.name, 300, 50)
  const bandPath = 'M0 0H400V400H0Z M32 32H368V368H32Z'
  return (
    <g>
      <defs>
        <pattern id={`${uid}-chk`} width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={band} />
          <rect x="16" y="16" width="16" height="16" fill={band} />
        </pattern>
        <pattern id={`${uid}-str`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="14" fill={band} />
        </pattern>
        <pattern id={`${uid}-dot`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="3.2" fill={band} />
        </pattern>
        <pattern id={`${uid}-ray`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="2" height="8" fill={band} />
        </pattern>
        <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={c.base} />
      {m.pattern === 'checker' && <path d={bandPath} fillRule="evenodd" fill={`url(#${uid}-chk)`} />}
      {m.pattern === 'stripe' && <path d={bandPath} fillRule="evenodd" fill={`url(#${uid}-str)`} />}
      {m.pattern === 'dots' && <path d={bandPath} fillRule="evenodd" fill={`url(#${uid}-dot)`} />}
      {m.pattern === 'rays' && <path d={bandPath} fillRule="evenodd" fill={`url(#${uid}-ray)`} />}
      {m.pattern === 'plain' && (
        <>
          <rect x="14" y="14" width="372" height="372" fill="none" stroke={band} strokeWidth="1.6" />
          <rect x="22" y="22" width="356" height="356" fill="none" stroke={band} strokeWidth="0.8" />
        </>
      )}
      <rect x="42" y="42" width="316" height="316" fill="none" stroke={c.ink} strokeOpacity="0.55" strokeWidth="1.4" />

      {/* pizza motif */}
      <circle cx="200" cy="168" r="88" fill="none" stroke={c.ink} strokeWidth="6" />
      <circle cx="200" cy="168" r="78" fill={c.branded ? c.accent : 'none'} fillOpacity={c.branded ? 0.95 : 0} />
      {slices.map((a, i) => (
        <line
          key={i}
          x1={200}
          y1={168}
          x2={200 + Math.cos(a) * 78}
          y2={168 + Math.sin(a) * 78}
          stroke={c.branded ? c.base : c.ink}
          strokeWidth="2.6"
          strokeOpacity={c.branded ? 0.9 : 0.8}
        />
      ))}
      {peps.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="9.5" fill={c.ink} fillOpacity={c.branded ? 0.9 : 1} />
      ))}

      {/* wordmark */}
      <text x="200" y="312" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize={nameSize} fill={c.ink}>
        {m.name}
      </text>
      <text x="200" y="338" textAnchor="middle" fontFamily={SANS} fontWeight="600" fontSize="11" letterSpacing="3.5" fill={c.branded ? c.accent : c.ink}>
        {m.tagline.toUpperCase()}
      </text>
      <rect width="400" height="400" fill={`url(#${uid}-sheen)`} />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Illustrations                                                       */
/* ------------------------------------------------------------------ */

function Pizza({ uid, m, finish }: { uid: string; m: Merchant; finish: Finish }) {
  const backFinish: Finish = finish === 'kraft' ? 'white' : 'kraft'
  return (
    <g>
      <g transform="translate(132 96) rotate(9) scale(0.6)">
        <rect x="8" y="14" width="400" height="400" rx="14" fill="#000" opacity="0.28" />
        <clipPath id={`${uid}-cb`}><rect width="400" height="400" rx="12" /></clipPath>
        <g clipPath={`url(#${uid}-cb)`}><PizzaFace uid={`${uid}b`} m={m} finish={backFinish} /></g>
      </g>
      <g transform="translate(60 110) rotate(-5) scale(0.66)">
        <rect x="10" y="18" width="400" height="400" rx="14" fill="#000" opacity="0.3" />
        <clipPath id={`${uid}-cf`}><rect width="400" height="400" rx="12" /></clipPath>
        <g clipPath={`url(#${uid}-cf)`}><PizzaFace uid={`${uid}f`} m={m} finish={finish} /></g>
      </g>
    </g>
  )
}

function Burger({ uid, m }: { uid: string; m: Merchant }) {
  const body = 'M62 200H338L318 296Q316 308 304 308H96Q84 308 82 296Z'
  return (
    <g>
      <clipPath id={`${uid}-bb`}><path d={body} /></clipPath>
      <path d={body} fill={m.bg} />
      <g clipPath={`url(#${uid}-bb)`}>
        <rect x="40" y="226" width="320" height="20" fill={m.accent} />
        <rect x="40" y="200" width="320" height="10" fill="#000" opacity="0.18" />
      </g>
      <text x="200" y="282" textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="11" letterSpacing="3" fill={m.ink}>
        {m.tagline.toUpperCase()}
      </text>
      <path d="M72 200Q72 112 200 108Q328 112 328 200Z" fill={m.bg} />
      <path d="M72 200Q72 112 200 108Q150 120 140 200Z" fill="#fff" opacity="0.12" />
      <line x1="62" y1="200" x2="338" y2="200" stroke="#000" strokeOpacity="0.3" strokeWidth="3" />
      <text x="200" y="172" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize={fit(m.name, 190, 30)} fill={m.ink}>
        {m.name}
      </text>
      <circle cx="200" cy="140" r="4" fill={m.accent} />
    </g>
  )
}

function Lunch({ m }: { m: Merchant }) {
  return (
    <g>
      <polygon points="70,176 330,176 300,128 100,128" fill={KRAFT_L} />
      <rect x="70" y="176" width="260" height="120" rx="4" fill={KRAFT} />
      <rect x="70" y="176" width="260" height="8" fill="#000" opacity="0.1" />
      <polygon points="140,176 260,176 246.2,128 153.8,128" fill={m.bg} />
      <rect x="140" y="176" width="120" height="120" fill={m.bg} />
      <rect x="160" y="240" width="80" height="3" fill={m.accent} />
      <text x="200" y="224" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize={fit(m.name, 104, 22)} fill={m.ink}>
        {m.name}
      </text>
      <text x="200" y="264" textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="8" letterSpacing="2" fill={m.ink} opacity="0.85">
        {m.tagline.toUpperCase().slice(0, 18)}
      </text>
      <polygon points="140,176 140,296 134,296 134,176" fill="#000" opacity="0.08" />
    </g>
  )
}

function Container({ m }: { m: Merchant }) {
  const bowl = 'M90 204H310L285 305Q283 315 273 315H127Q117 315 115 305Z'
  return (
    <g>
      <path d={bowl} fill={m.bg} />
      <circle cx="165" cy="190" r="22" fill="#C9603A" />
      <circle cx="212" cy="186" r="27" fill="#DC9A4E" />
      <circle cx="252" cy="192" r="19" fill="#8FA35A" />
      <path d="M85 204Q85 128 200 124Q315 128 315 204Z" fill="#fff" fillOpacity="0.32" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" />
      <path d="M110 190Q112 150 150 140" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />
      <rect x="82" y="200" width="236" height="12" rx="6" fill={m.bg} />
      <rect x="82" y="200" width="236" height="12" rx="6" fill="#000" opacity="0.15" />
      <text x="200" y="266" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize={fit(m.name, 170, 28)} fill={m.ink}>
        {m.name}
      </text>
      <text x="200" y="288" textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="9" letterSpacing="3" fill={m.ink} opacity="0.85">
        {m.tagline.toUpperCase().slice(0, 20)}
      </text>
    </g>
  )
}

function Bag({ m }: { m: Merchant }) {
  return (
    <g>
      <path d="M160 142V112Q160 90 200 90Q240 90 240 112V142" fill="none" stroke={KRAFT} strokeWidth="5" strokeLinecap="round" />
      <rect x="112" y="138" width="176" height="190" fill={m.bg} />
      <rect x="112" y="138" width="176" height="22" fill="#000" opacity="0.14" />
      <polygon points="288,138 318,152 318,322 288,328" fill="#000" opacity="0.24" />
      <circle cx="200" cy="226" r="40" fill={m.accent} />
      <text x="200" y="240" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="42" fill={onColor(m.accent)}>
        {m.name.charAt(0)}
      </text>
      <text x="200" y="298" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize={fit(m.name, 150, 24)} fill={m.ink}>
        {m.name}
      </text>
      <rect x="112" y="316" width="176" height="3" fill={m.accent} opacity="0.9" />
    </g>
  )
}

function Cup({ m }: { m: Merchant }) {
  return (
    <g>
      <path d="M122 138H278L258 326Q257 332 250 332H150Q143 332 142 326Z" fill="#FBF8F2" />
      <polygon points="128.2,196 271.8,196 263.7,272 136.3,272" fill={m.bg} />
      <path d="M122 138H150L160 332H150Q143 332 142 326Z" fill="#000" opacity="0.05" />
      <text x="200" y="238" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize={fit(m.name, 108, 24)} fill={m.ink}>
        {m.name}
      </text>
      <rect x="170" y="250" width="60" height="2.5" fill={m.accent} />
      <path d="M130 118Q130 98 160 96H240Q270 98 270 118Z" fill="#3A3A3A" />
      <rect x="108" y="116" width="184" height="24" rx="9" fill="#2B2B2B" />
      <rect x="108" y="116" width="184" height="6" rx="3" fill="#fff" opacity="0.12" />
    </g>
  )
}

function Fries({ m }: { m: Merchant }) {
  const sticks = [
    [148, 150, -6, 120], [160, 138, -3, 130], [172, 146, 2, 124], [184, 132, -2, 136], [196, 142, 4, 126],
    [208, 134, -4, 134], [220, 146, 3, 122], [232, 140, 6, 128], [244, 152, 8, 118],
  ]
  return (
    <g>
      {sticks.map(([x, y, r, h], i) => (
        <rect key={i} x={x} y={y} width="14" height={h} rx="3" fill={i % 3 === 0 ? '#EFBE4B' : '#F2C95E'} transform={`rotate(${r} ${x + 7} ${y + h})`} />
      ))}
      <path d="M126 214H170Q200 248 230 214H274L254 330H146Z" fill={m.bg} />
      <path d="M126 214H170Q200 248 230 214H274L270 236H130Z" fill="#000" opacity="0.1" />
      <text x="200" y="286" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize={fit(m.name, 96, 22)} fill={m.ink}>
        {m.name}
      </text>
      <rect x="168" y="298" width="64" height="3" fill={m.accent} />
    </g>
  )
}

function Bakery({ m }: { m: Merchant }) {
  return (
    <g>
      <rect x="84" y="176" width="232" height="128" rx="6" fill={m.bg} />
      <polygon points="84,176 316,176 292,146 108,146" fill={m.bg} />
      <polygon points="84,176 316,176 292,146 108,146" fill="#fff" opacity="0.16" />
      <rect x="110" y="194" width="180" height="68" rx="10" fill="#F5E9D3" />
      {[
        [148, 232, -14], [200, 228, 6], [252, 232, 16],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx="25" ry="14" fill={i === 1 ? '#C4813A' : '#D9A24E'} />
          <path d={`M${x - 14} ${y - 3}Q${x} ${y - 10} ${x + 14} ${y - 3}`} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
      <rect x="110" y="194" width="180" height="68" rx="10" fill="#fff" opacity="0.12" />
      <rect x="146" y="274" width="108" height="22" rx="3" fill={m.accent} />
      <text x="200" y="290" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize={fit(m.name, 96, 17)} fill={onColor(m.accent)}>
        {m.name}
      </text>
    </g>
  )
}

function Eco({ m }: { m: Merchant }) {
  const print = luminance(m.bg) > 0.6 ? '#3A2A18' : m.bg
  return (
    <g>
      <path d="M92 214H308L284 312Q282 322 270 322H130Q118 322 116 312Z" fill={KRAFT} />
      <path d="M92 214H308L304 232H96Z" fill="#000" opacity="0.08" />
      <path d="M84 214Q84 176 200 172Q316 176 316 214Z" fill={KRAFT_L} />
      <path d="M84 214H316" stroke="#000" strokeOpacity="0.18" strokeWidth="3" />
      <path d="M200 238C226 238 238 258 238 280C214 280 200 262 200 238Z" fill={print} />
      <path d="M200 242Q210 262 232 276" fill="none" stroke={KRAFT} strokeWidth="2" />
      <text x="200" y="305" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize={fit(m.name, 120, 18)} fill={print}>
        {m.name}
      </text>
    </g>
  )
}

/* ------------------------------------------------------------------ */

export function Packaging({
  kind,
  merchant,
  finish = 'branded',
  className = '',
}: {
  kind: PackKind
  merchant: Merchant
  finish?: Finish
  className?: string
}) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg
      viewBox="20 50 360 330"
      className={className}
      role="img"
      aria-label={`${merchant.name} ${kindLabel[kind]} (illustrative concept)`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id={`${uid}-blur`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <ellipse cx="200" cy={kind === 'pizza' ? 362 : 340} rx="128" ry="11" fill="#000" opacity="0.2" filter={`url(#${uid}-blur)`} />
      {kind === 'pizza' && <Pizza uid={uid} m={merchant} finish={finish} />}
      {kind === 'burger' && <Burger uid={uid} m={merchant} />}
      {kind === 'lunch' && <Lunch m={merchant} />}
      {kind === 'container' && <Container m={merchant} />}
      {kind === 'bag' && <Bag m={merchant} />}
      {kind === 'cup' && <Cup m={merchant} />}
      {kind === 'fries' && <Fries m={merchant} />}
      {kind === 'bakery' && <Bakery m={merchant} />}
      {kind === 'eco' && <Eco m={merchant} />}
    </svg>
  )
}

export type Tone = 'ivory' | 'beige' | 'charcoal' | 'kraft'

/** Studio-lit tile backgrounds: pearl, champagne, noir and bronze. */
export const toneStyles: Record<Tone, { bg: string; spot: string; vignette: string }> = {
  ivory: {
    bg: 'linear-gradient(160deg, #F8F1E4 0%, #E8DBC3 100%)',
    spot: 'radial-gradient(70% 58% at 50% 36%, rgba(255,255,255,0.7), transparent 72%)',
    vignette: 'radial-gradient(120% 100% at 50% 40%, transparent 60%, rgba(90,60,20,0.14))',
  },
  beige: {
    bg: 'linear-gradient(160deg, #ECDFC3 0%, #CBB285 100%)',
    spot: 'radial-gradient(70% 58% at 50% 36%, rgba(255,250,235,0.55), transparent 72%)',
    vignette: 'radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(70,45,10,0.2))',
  },
  charcoal: {
    bg: 'linear-gradient(160deg, #2C231B 0%, #110D0A 100%)',
    spot: 'radial-gradient(65% 55% at 50% 38%, rgba(201,169,110,0.26), transparent 72%)',
    vignette: 'radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(0,0,0,0.45))',
  },
  kraft: {
    bg: 'linear-gradient(160deg, #B58F5A 0%, #76542F 100%)',
    spot: 'radial-gradient(65% 55% at 50% 36%, rgba(255,232,185,0.38), transparent 72%)',
    vignette: 'radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(30,15,0,0.35))',
  },
}
