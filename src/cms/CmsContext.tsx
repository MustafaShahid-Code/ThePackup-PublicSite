import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import copySchema from '../../shared/defaults/copy.json'
import { site as siteDefaults } from '../data/site'
import { categories as categoryDefaults, whyItems as whyDefaults, type Category, type WhyItem } from '../data/content'
import { work as workDefaults, type WorkItem } from '../data/work'

type SiteInfo = typeof siteDefaults
export interface CmsData {
  copy: Record<string, string>
  site: Pick<SiteInfo, 'email' | 'phone' | 'location' | 'social'>
  categories: Category[]
  why: WhyItem[]
  work: WorkItem[]
}

const copyDefaults: Record<string, string> = Object.fromEntries((copySchema as { key: string; default: string }[]).map((f) => [f.key, f.default]))

declare global {
  interface Window {
    __CMS__?: Partial<CmsData>
  }
}

/** Merge whatever the server sent over the built-in defaults, so the site always renders. */
function merge(d?: Partial<CmsData>): CmsData {
  return {
    copy: { ...copyDefaults, ...(d?.copy ?? {}) },
    site: { ...siteDefaults, ...(d?.site ?? {}), social: { ...siteDefaults.social, ...(d?.site?.social ?? {}) } },
    categories: d?.categories?.length ? d.categories : categoryDefaults,
    why: d?.why?.length ? d.why : whyDefaults,
    work: d?.work ?? workDefaults,
  }
}

const Ctx = createContext<CmsData>(merge())

export function CmsProvider({ children }: { children: ReactNode }) {
  // The server embeds the content in index.html (window.__CMS__). Without a server (static hosting or `vite dev`),
  // try the API once, and otherwise keep the built-in defaults.
  const [data, setData] = useState<CmsData>(() => merge(window.__CMS__))
  useEffect(() => {
    if (window.__CMS__) return
    const ctl = new AbortController()
    fetch('/api/content', { signal: ctl.signal })
      .then((r) => (r.ok && r.headers.get('content-type')?.includes('json') ? r.json() : null))
      .then((j) => j && setData(merge(j)))
      .catch(() => {})
    return () => ctl.abort()
  }, [])
  const value = useMemo(() => data, [data])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useCms = () => useContext(Ctx)
/** Editable text. `key` must exist in shared/defaults/copy.json. */
export const useCopy = () => {
  const { copy } = useCms()
  return (key: string) => copy[key] ?? copyDefaults[key] ?? ''
}
export const useSite = () => useCms().site
export const useCategories = () => useCms().categories
export const useWhy = () => useCms().why
export const useWork = () => useCms().work
