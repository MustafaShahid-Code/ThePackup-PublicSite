import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogoMark } from './Logo'

const KEY = 'tpu-loaded'

/** First-visit splash. Skipped on later visits in the same session. */
export default function Loader() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem(KEY)
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (!show) return
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      setShow(false)
      document.body.style.overflow = ''
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* storage unavailable — fine */
      }
    }, 1900)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal text-ivory"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="text-gold">
            <LogoMark size={88} />
          </motion.div>
          <motion.p
            className="mt-7 font-display text-2xl uppercase tracking-[0.5em]"
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.3, delay: 0.2 }}
          >
            The Pack Up
          </motion.p>
          <div className="mt-10 h-px w-40 overflow-hidden bg-ivory/15">
            <motion.div className="h-full bg-gold" initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.5, delay: 0.2, ease: 'easeInOut' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
