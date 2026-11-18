import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'
import { nav, placeholder } from '../data/site'
import { useSite } from '../cms/CmsContext'
import { getLenis } from './SmoothScroll'

export default function Header() {
  const site = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) getLenis()?.stop()
    else getLenis()?.start()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      getLenis()?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Transparent over the navy hero; solid white once scrolled.
  const solid = scrolled && !open

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${solid ? 'bg-white shadow-[0_1px_0_rgb(var(--c-charcoal)/0.08)]' : 'bg-transparent'}`}>
        <div className={`container-x flex items-center justify-between transition-all duration-300 ${solid ? 'py-3' : 'py-5'}`}>
          <Link to="/" aria-label="Packup — home" className="relative z-[60]">
            <Logo onDark={!solid} height={solid ? 30 : 34} />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `relative py-1 text-[15px] font-medium transition-colors ${solid ? 'text-charcoal hover:text-deep' : 'text-white/85 hover:text-white'} ${isActive ? (solid ? '!text-deep' : '!text-white') : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span aria-hidden="true" className={`absolute -bottom-0.5 left-0 h-[3px] w-full origin-left rounded-full bg-gold transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Button to="/contact" size="sm">
                Get a quote
              </Button>
            </div>
            <button
              type="button"
              className={`relative z-[60] -mr-2 p-2 lg:hidden ${open ? 'text-white' : solid ? 'text-charcoal' : 'text-white'}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="navy fixed inset-0 z-[55] flex flex-col justify-between overflow-y-auto px-6 pb-10 pt-28 text-white lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label="Mobile">
              <ul>
                {nav.map((n, i) => (
                  <motion.li key={n.to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }} className="border-b border-white/10">
                    <NavLink to={n.to} end={n.to === '/'} className={({ isActive }) => `flex items-center justify-between py-4 font-display text-[28px] font-semibold ${isActive ? 'text-gold' : ''}`}>
                      {n.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-10 space-y-5">
              <Button to="/contact">Get a quote</Button>
              <p className="text-sm text-white/60">{site.email || placeholder.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
