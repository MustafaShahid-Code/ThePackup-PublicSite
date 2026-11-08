import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'
import { nav, placeholder } from '../data/site'
import { useSite } from '../cms/CmsContext'


export default function Header() {
  const site = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 48)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const floating = scrolled && !open

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 text-ivory sm:px-5">
        {/* Transparent over the hero; condenses into a floating liquid-glass capsule on scroll */}
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-out ${
            floating ? 'glass-ink max-w-[1120px] rounded-full px-5 py-2.5 sm:px-7' : 'max-w-[1320px] rounded-full border border-transparent px-2 py-4 sm:px-5 lg:px-9'
          }`}
        >
          <Link to="/" aria-label="The Pack Up — home" className="relative z-[60]">
            <Logo className="text-ivory" markSize={46} />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `group relative text-[11.5px] font-semibold uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-gold' : 'hover:text-gold'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-500 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <Button to="/contact" variant={floating ? 'gold' : 'outlineLight'} size="sm">
                Get in Touch
              </Button>
            </div>
            <button
              type="button"
              className="relative z-[60] -mr-2 p-2 lg:hidden"
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
            className="aurora fixed inset-0 z-[55] flex flex-col justify-between px-6 pb-10 pt-28 text-ivory lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0 round 0 0 32px 32px)' }}
            animate={{ clipPath: 'inset(0 0 0% 0 round 0 0 0 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0 round 0 0 32px 32px)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {nav.map((n, i) => (
                  <motion.li
                    key={n.to}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={n.to}
                      end={n.to === '/'}
                      className={({ isActive }) => `flex items-baseline gap-4 py-2 font-display text-[44px] leading-none ${isActive ? 'text-gold' : ''}`}
                    >
                      <span className="font-sans text-[11px] tracking-widest text-ivory/40">0{i + 1}</span>
                      {n.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="space-y-6">
              <Button to="/contact" variant="gold">
                Get in Touch
              </Button>
              <p className="text-sm text-ivory/55">{site.email || placeholder.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
