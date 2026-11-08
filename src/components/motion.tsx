import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

/** Fade + rise when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/** Masked word-by-word headline reveal. */
export function WordReveal({
  text,
  className = '',
  delay = 0,
  as: Tag = 'h2',
  immediate = false,
}: {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
  immediate?: boolean
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const MotionTag = motion[Tag]
  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } })}
      transition={{ staggerChildren: reduce ? 0 : 0.07, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: reduce ? 0 : '110%' }, show: { y: 0 } }}
            transition={{ duration: 0.95, ease }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

/** Vertical parallax drift tied to scroll position. */
export function Parallax({
  children,
  distance = 60,
  className = '',
}: {
  children: ReactNode
  distance?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [distance, -distance])
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
