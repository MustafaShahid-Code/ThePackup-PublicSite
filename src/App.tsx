import { Suspense, lazy, useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Loader from './components/Loader'
import CookieNotice from './components/CookieNotice'
import SmoothScroll, { getLenis } from './components/SmoothScroll'
import Home from './pages/Home'
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const PackagingPage = lazy(() => import('./pages/Packaging'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Vendors = lazy(() => import('./pages/Vendors'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Curtain({ id }: { id: string }) {
  const first = useRef(true)
  useEffect(() => {
    first.current = false
  }, [])
  return (
    <motion.div
      key={id}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] origin-top bg-charcoal"
      initial={{ scaleY: first.current ? 0 : 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
    />
  )
}

export default function App() {
  const location = useLocation()

  // Scroll to a #section after navigation (e.g. /packaging#pizza-boxes)
  useEffect(() => {
    if (!location.hash) return
    // The page is lazy-loaded, so wait (up to ~4s) for the target to exist before scrolling.
    let tries = 0
    let t: ReturnType<typeof setTimeout>
    const go = () => {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        const lenis = getLenis()
        if (lenis) {
          // The lazy page may still be growing: re-measure first, and correct once if images shifted the layout.
          lenis.resize()
          const gap = parseFloat(getComputedStyle(el).scrollMarginTop) || 0 // sections carry scroll-mt for the header
          lenis.scrollTo(el, {
            duration: 1.2,
            onComplete: () => {
              lenis.resize()
              if (Math.abs(el.getBoundingClientRect().top - gap) > 24) lenis.scrollTo(el, { duration: 0.6 })
            },
          })
        }
        else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      else if (tries++ < 20) t = setTimeout(go, 200)
    }
    t = setTimeout(go, 500)
    return () => clearTimeout(t)
  }, [location.pathname, location.hash])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-charcoal"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <Loader />
      <CookieNotice />
      <Header />
      <AnimatePresence mode="wait" onExitComplete={() => {
        const lenis = getLenis()
        if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
        else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      }}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Curtain id={location.pathname} />
          <main id="main">
            <Suspense fallback={<div className="min-h-[70vh]" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/packaging" element={<PackagingPage />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/solutions" element={<Navigate to="/packaging" replace />} />
              <Route path="/our-work" element={<Navigate to="/gallery" replace />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
