import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCopy, useSettings } from '../cms/CmsContext'

const KEY = 'pu-notice-dismissed'

/** Optional notice, switched on from the admin (System tab). Only essential storage is used, so there is nothing to opt in to. */
export default function CookieNotice() {
  const { cookieNotice } = useSettings()
  const t = useCopy()
  const [dismissed, setDismissed] = useState(true)
  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])
  if (!cookieNotice || dismissed) return null
  const close = () => {
    setDismissed(true)
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* storage unavailable — fine */
    }
  }
  return (
    <div role="region" aria-label="Cookie notice" className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-xl rounded-2xl border border-white/15 bg-charcoal p-5 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] sm:left-auto sm:right-6">
      <p className="text-[14px] leading-relaxed text-white/80">
        {t('cookie.text')}{' '}
        <Link to="/privacy" className="underline decoration-gold underline-offset-4 hover:text-gold">
          Privacy policy
        </Link>
      </p>
      <button type="button" onClick={close} className="btn-shape btn-primary mt-4 px-6 py-2.5 text-[14px] font-semibold transition hover:brightness-105">
        Got it
      </button>
    </div>
  )
}
