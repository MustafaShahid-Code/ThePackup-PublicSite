import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import Logo from './Logo'
import ExploreButton from './ExploreButton'
import { nav, placeholder, type NavItem } from '../data/site'
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
              <DesktopItem key={n.to} item={n} solid={solid} pathname={pathname} />
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <ExploreButton size="sm" />
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
                    {n.children && (
                      <ul className="-mt-1 mb-4 space-y-1 border-l-2 border-gold/60 pl-4">
                        {n.children.map((c) => (
                          <li key={c.to}>
                            <NavLink to={c.to} className={({ isActive }) => `block py-1.5 font-display text-[20px] font-medium ${isActive ? 'text-gold' : 'text-white/80'}`}>
                              {c.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-10 space-y-5">
              <ExploreButton />
              <p className="text-sm text-white/60">{site.email || placeholder.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** Desktop menu item. Items with children open a small dropdown on hover, on keyboard focus, or by clicking the arrow. */
function DesktopItem({ item, solid, pathname }: { item: NavItem; solid: boolean; pathname: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])
  const inSection = item.children ? [item.to, ...item.children.map((c) => c.to)].some((t) => pathname === t || pathname.startsWith(t + '/')) : false
  const linkCls = (active: boolean) =>
    `relative py-1 text-[15px] font-medium transition-colors ${solid ? 'text-charcoal hover:text-deep' : 'text-white/85 hover:text-white'} ${active ? (solid ? '!text-deep' : '!text-white') : ''}`
  const underline = (active: boolean) => (
    <span aria-hidden="true" className={`absolute -bottom-0.5 left-0 h-[3px] w-full origin-left rounded-full bg-gold transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0'}`} />
  )

  if (!item.children)
    return (
      <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => linkCls(isActive)}>
        {({ isActive }) => (
          <>
            {item.label}
            {underline(isActive)}
          </>
        )}
      </NavLink>
    )

  const id = `menu-${item.to.replace(/\W/g, '')}`
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <div className="flex items-center gap-1">
        <NavLink to={item.to} className={linkCls(inSection)}>
          {item.label}
          {underline(inSection)}
        </NavLink>
        <button
          type="button"
          aria-label={`${item.label} submenu`}
          aria-expanded={open}
          aria-controls={id}
          // a mouse has already opened it on hover, so a click keeps it open; touch and keyboard toggle it
          onClick={(e) => ((e.nativeEvent as PointerEvent).pointerType === 'mouse' ? setOpen(true) : setOpen((o) => !o))}
          className={`rounded p-0.5 transition-colors ${solid ? 'text-charcoal/70 hover:text-deep' : 'text-white/75 hover:text-white'}`}
        >
          <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {/* pt-3 bridges the gap so the menu stays open while the pointer moves down to it */}
      <div id={id} className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition duration-200 ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}>
        <ul className="min-w-[200px] overflow-hidden rounded-xl border border-charcoal/10 bg-white p-1.5 shadow-[0_18px_40px_-12px_rgb(var(--c-charcoal)/0.35)]">
          {item.children.map((c) => (
            <li key={c.to}>
              <NavLink
                to={c.to}
                className={({ isActive }) => `block rounded-lg px-4 py-2.5 text-[15px] font-medium transition-colors ${isActive ? 'bg-gold/10 text-deep' : 'text-charcoal hover:bg-charcoal/5 hover:text-deep'}`}
              >
                {c.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
