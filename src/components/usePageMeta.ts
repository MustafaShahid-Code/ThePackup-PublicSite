import { useEffect } from 'react'

const BRAND = 'Packup'

/** Sets the document title and meta description for the current page. */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title === BRAND ? `${BRAND} — Pack, Store, Deliver` : `${title} — ${BRAND}`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
  }, [title, description])
}
