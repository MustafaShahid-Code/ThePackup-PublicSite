import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import copySchema from '../../shared/defaults/copy.json'
import { site as siteDefaults } from '../data/site'
import { categories as categoryDefaults, whyItems as whyDefaults, type Category, type WhyItem } from '../data/content'
import { work as workDefaults, type WorkItem } from '../data/work'
import { mergeTheme, themeCss, type Theme } from '../../shared/theme.js'

type SiteInfo = typeof siteDefaults
export interface CmsData {
  copy: Record<string, string>
  site: Pick<SiteInfo, 'email' | 'phone' | 'location' | 'social' | 'marketplaceUrl' | 'marketplaceNewTab'>
  categories: Category[]
  why: WhyItem[]
  work: WorkItem[]
  theme: Theme
  settings: { cookieNotice: boolean }
  story: StoryImages
}

export type StorySlot = 'hero' | 'pack' | 'store' | 'deliver'
export type StoryImages = Record<StorySlot, string>
/** Photos that ship with the site; the admin can replace each one. */
export const STORY_DEFAULTS: StoryImages = { hero: '/story/hero.webp', pack: '/story/pack.webp', store: '/story/store.webp', deliver: '/story/deliver.webp' }

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
    theme: mergeTheme(d?.theme),
    settings: { cookieNotice: d?.settings?.cookieNotice === true },
    story: Object.fromEntries(
      (Object.keys(STORY_DEFAULTS) as StorySlot[]).map((k) => [k, d?.story?.[k] || STORY_DEFAULTS[k]]),
    ) as StoryImages,
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
  // Keep the theme <style> in sync. The server already embeds it for first paint; this covers dev and static fallbacks.
  useEffect(() => {
    const css = themeCss(data.theme)
    let el = document.getElementById('cms-theme')
    if (!el) {
      el = document.createElement('style')
      el.id = 'cms-theme'
      document.head.appendChild(el)
    }
    if (el.textContent !== css) el.textContent = css
  }, [data.theme])
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
export const useSettings = () => useCms().settings
export const useStory = () => useCms().story
