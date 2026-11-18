import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const KEY = 'pu-loaded'

/** Quick first-visit splash (about a second). Skipped on later visits in the same session. */
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
    }, 1000)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal" exit={{ opacity: 0 }} transition={{ duration: 0.4 }} aria-hidden="true">
          <motion.img
            src="/brand/logo-full-light.svg"
            alt=""
            className="w-[min(70vw,320px)]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
