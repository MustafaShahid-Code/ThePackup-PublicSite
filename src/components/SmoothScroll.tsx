import { useEffect } from 'react'
import Lenis from 'lenis'

let instance: Lenis | null = null

/** The active smooth-scroll engine, or null (reduced motion, touch-only, or not started yet). */
export const getLenis = () => instance

/**
 * Inertia ("buttery") scrolling for mouse wheels and trackpads, like the cinematic reference.
 * Touch devices keep their native scrolling, which is already smooth.
 * Skipped completely for visitors who ask for reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.07, wheelMultiplier: 0.85, smoothWheel: true, syncTouch: false, anchors: { offset: 0 } })
    instance = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      instance = null
    }
  }, [])
  return null
}
