import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Loader from './components/Loader'
import Home from './pages/Home'
import About from './pages/About'
import Solutions from './pages/Solutions'
import OurWork from './pages/OurWork'
import Vendors from './pages/Vendors'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

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
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
    />
  )
}

export default function App() {
  const location = useLocation()

  // Scroll to a #section after navigation (e.g. /solutions#pizza-boxes)
  useEffect(() => {
    if (!location.hash) return
    const t = setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 700)
    return () => clearTimeout(t)
  }, [location.pathname, location.hash])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-gold focus:px-4 focus:py-2 focus:text-charcoal"
      >
        Skip to content
      </a>
      <Loader />
      <Header />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Curtain id={location.pathname} />
          <main id="main">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/our-work" element={<OurWork />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
