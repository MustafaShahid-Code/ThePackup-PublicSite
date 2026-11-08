import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { PizzaFaceSvg, pizzaColors, type Finish } from './Packaging'
import type { Merchant } from '../data/merchants'

function useAutoSize() {
  const [w, setW] = useState(() => (typeof window === 'undefined' ? 1200 : window.innerWidth))
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w < 480 ? 210 : w < 768 ? 250 : w < 1100 ? 290 : 340
}

function Mesh({
  merchant,
  finish,
  size,
  h,
  z,
  rot,
}: {
  merchant: Merchant
  finish: Finish
  size: number
  h: number
  z: number
  rot: number
}) {
  const c = pizzaColors(merchant, finish)
  const side = (extra: string, w: number, ht: number, left: number, top: number, shade: number) => ({
    position: 'absolute' as const,
    width: w,
    height: ht,
    left,
    top,
    background: c.base,
    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0) 45%, rgba(0,0,0,${0.18 + shade}))`,
    transform: extra,
    backfaceVisibility: 'hidden' as const,
  })
  const seam = <span className="absolute left-0 right-0" style={{ top: '58%', height: 2, background: 'rgba(0,0,0,0.32)' }} />
  const half = size / 2
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transform: `translateZ(${z + h / 2}px) rotateZ(${rot}deg)`,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: `translateZ(${h / 2}px)`, borderRadius: 6, overflow: 'hidden', backfaceVisibility: 'hidden' }}>
        <PizzaFaceSvg merchant={merchant} finish={finish} className="block h-full w-full" />
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `rotateY(180deg) translateZ(${h / 2}px)`, background: '#8f7040', backfaceVisibility: 'hidden' }} />
      <div style={side(`rotateX(-90deg) translateZ(${half}px)`, size, h, 0, (size - h) / 2, 0)}>{seam}</div>
      <div style={side(`rotateX(90deg) translateZ(${half}px)`, size, h, 0, (size - h) / 2, 0.1)}>{seam}</div>
      <div style={side(`rotateY(-90deg) translateZ(${half}px)`, h, size, (size - h) / 2, 0, 0.05)} />
      <div style={side(`rotateY(90deg) translateZ(${half}px)`, h, size, (size - h) / 2, 0, 0.12)} />
    </div>
  )
}

/**
 * Interactive CSS-3D pizza box. Sways on its own and follows the pointer.
 * `stack` renders extra boxes underneath (bottom → top) for multi-merchant compositions.
 */
export default function Box3D({
  merchant,
  finish = 'branded',
  stack = [],
  size: sizeProp,
  className = '',
}: {
  merchant: Merchant
  finish?: Finish
  stack?: Merchant[]
  size?: number
  className?: string
}) {
  const auto = useAutoSize()
  const size = sizeProp ?? auto
  const h = Math.round(size * 0.13)
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 70, damping: 16 })
  const sy = useSpring(py, { stiffness: 70, damping: 16 })
  const rotZ = useTransform(sx, [-0.5, 0.5], [-36, 36])
  const rotX = useTransform(sy, [-0.5, 0.5], [64, 48])
  const hovering = useRef(false)

  useEffect(() => {
    if (reduce) return
    let raf = 0
    const loop = (t: number) => {
      if (!hovering.current) {
        px.set(Math.sin(t / 2300) * 0.3)
        py.set(Math.cos(t / 3300) * 0.15)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [px, py, reduce])

  const boxes = [...stack, merchant]
  const offsets = [-7, 5, -3]

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: size * 1.45, height: size * 1.25, perspective: 1500 }}
      onPointerMove={(e) => {
        if (reduce) return
        const r = e.currentTarget.getBoundingClientRect()
        hovering.current = true
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        hovering.current = false
      }}
      role="img"
      aria-label={`Interactive 3D preview of a ${merchant.name} pizza box`}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 rounded-[50%] bg-black/50 blur-2xl"
        style={{ width: size * 1.05, height: size * 0.34, bottom: '4%', transform: 'translateX(-50%)' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          transformStyle: 'preserve-3d',
          rotateX: reduce ? 58 : rotX,
          rotateZ: reduce ? -12 : rotZ,
        }}
      >
        {boxes.map((m, i) => (
          <Mesh
            key={`${m.id}-${i}`}
            merchant={m}
            finish={i === boxes.length - 1 ? finish : 'branded'}
            size={size}
            h={h}
            z={i * (h + 1)}
            rot={i === boxes.length - 1 ? 0 : offsets[i % offsets.length]}
          />
        ))}
      </motion.div>
    </div>
  )
}
