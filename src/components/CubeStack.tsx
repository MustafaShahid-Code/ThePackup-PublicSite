import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/** Isometric stack of kraft cartons topped by the Packup cube. Pure SVG, flat colours. */
const S = 92 // cube edge
const W = S * 0.866
const H = S * 0.5
const iso = (i: number, j: number, k: number) => ({ x: 270 + (i - j) * W, y: 300 + (i + j) * H - k * S })
const pts = (p: [number, number][]) => p.map((q) => q.map((n) => n.toFixed(1)).join(',')).join(' ')

type Cube = { i: number; j: number; k: number; kind?: 'kraft' | 'brand' }
const cubes: Cube[] = ([
  { i: 0, j: 0, k: 0 },
  { i: 1, j: 0, k: 0 },
  { i: 0, j: 1, k: 0 },
  { i: 1, j: 1, k: 0 },
  { i: 0, j: 0, k: 1 },
  { i: 1, j: 0, k: 1 },
  { i: 0, j: 0, k: 2, kind: 'brand' },
] as Cube[]).sort((a, b) => a.i + a.j + a.k - (b.i + b.j + b.k))

function CubeShape({ c }: { c: Cube }) {
  const { x, y } = iso(c.i, c.j, c.k)
  // vertices of the cube's top face, centred on (x, y)
  const T: [number, number] = [x, y - S]
  const R: [number, number] = [x + W, y - S + H]
  const B: [number, number] = [x, y - S + 2 * H]
  const L: [number, number] = [x - W, y - S + H]
  const down = (p: [number, number]): [number, number] => [p[0], p[1] + S]
  const brand = c.kind === 'brand'
  const top = brand ? 'rgb(var(--c-gold))' : '#E0B27A'
  const left = brand ? '#16435A' : '#C99A60'
  const right = brand ? '#0A1F2B' : '#A97B45'
  const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  return (
    <g>
      <polygon points={pts([L, B, down(B), down(L)])} fill={left} />
      <polygon points={pts([B, R, down(R), down(B)])} fill={right} />
      <polygon points={pts([T, R, B, L])} fill={top} />
      {!brand && (
        <>
          {/* packing tape across the lid and down the left face */}
          <polygon points={pts([lerp(T, R, 0.42), lerp(T, R, 0.58), lerp(L, B, 0.58), lerp(L, B, 0.42)])} fill="rgb(var(--c-charcoal))" opacity="0.9" />
          <polygon
            points={pts([lerp(L, B, 0.42), lerp(L, B, 0.58), [lerp(L, B, 0.58)[0], lerp(L, B, 0.58)[1] + S * 0.42], [lerp(L, B, 0.42)[0], lerp(L, B, 0.42)[1] + S * 0.42]])}
            fill="rgb(var(--c-charcoal))"
            opacity="0.9"
          />
        </>
      )}
      <polygon points={pts([T, R, B, L])} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinejoin="round" />
    </g>
  )
}

export default function CubeStack({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="40 20 460 450" overflow="visible" className={className} role="img" aria-label="A stack of packaging cartons topped with the Packup cube">
      <defs>
        <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <ellipse cx="270" cy="398" rx="190" ry="40" fill="#000" opacity="0.35" filter={`url(#${id}b)`} />
      <motion.g animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        {cubes.map((c, n) => (
          <CubeShape key={n} c={c} />
        ))}
      </motion.g>
    </svg>
  )
}
