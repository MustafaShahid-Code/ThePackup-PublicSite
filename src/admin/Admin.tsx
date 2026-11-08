import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ExternalLink, FileText, Folder, Image as ImageIcon, LayoutGrid, ListChecks, LogOut, Settings, UserCog } from 'lucide-react'
import { LogoMark } from '../components/Logo'
import { api, ApiError, type AdminContent } from './api'
import { AccountPanel, CategoriesPanel, CopyPanel, MediaPanel, ShowcasePanel, SitePanel, WhyPanel } from './panels'
import { Btn, Field, inputCls, Notice } from './ui'

const tabs = [
  { id: 'text', label: 'Page text', Icon: FileText },
  { id: 'showcase', label: 'Showcase gallery', Icon: ImageIcon },
  { id: 'categories', label: 'Categories', Icon: LayoutGrid },
  { id: 'why', label: 'Why us', Icon: ListChecks },
  { id: 'site', label: 'Contact & social', Icon: Settings },
  { id: 'media', label: 'Media library', Icon: Folder },
  { id: 'account', label: 'Account', Icon: UserCog },
] as const
type Tab = (typeof tabs)[number]['id']

function Login({ onDone }: { onDone: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const r = await api.post<{ email: string }>('/api/admin/login', { email, password: pw })
      onDone(r.email)
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Could not sign in')
    }
    setBusy(false)
  }
  return (
    <div className="aurora grain flex min-h-screen items-center justify-center p-4 text-ivory">
      <form onSubmit={submit} className="glass-dark relative w-full max-w-md rounded-[2rem] p-9" aria-label="Admin sign in">
        <div className="mb-7 flex items-center gap-3">
          <LogoMark size={48} />
          <div>
            <p className="font-display text-2xl font-bold uppercase tracking-[0.2em]">The Pack Up</p>
            <p className="text-[12px] uppercase tracking-[0.3em] text-gold">Content admin</p>
          </div>
        </div>
        <div className="space-y-4 text-charcoal">
          <Field label="Email"><input className={inputCls} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Password"><input className={inputCls} type="password" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
          {err && <Notice kind="err">{err}</Notice>}
          <Btn variant="gold" type="submit" disabled={busy} className="w-full">{busy ? 'Signing in…' : 'Sign in'}</Btn>
        </div>
      </form>
    </div>
  )
}

export default function Admin() {
  const [email, setEmail] = useState<string | null | undefined>(undefined)
  const [data, setData] = useState<AdminContent | null>(null)
  const [tab, setTab] = useState<Tab>('text')
  const [fatal, setFatal] = useState('')

  useEffect(() => {
    document.title = 'Admin — The Pack Up'
    let m = document.querySelector('meta[name=robots]') as HTMLMetaElement | null
    if (!m) {
      m = document.createElement('meta')
      m.name = 'robots'
      document.head.appendChild(m)
    }
    m.content = 'noindex,nofollow'
    api
      .get<{ email: string }>('/api/admin/me')
      .then((r) => setEmail(r.email))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 0) setFatal(e.message)
        setEmail(null)
      })
  }, [])

  const reload = useCallback(async () => {
    setData(await api.get<AdminContent>('/api/admin/content'))
  }, [])
  useEffect(() => {
    if (email) reload().catch((e) => setFatal(e.message))
  }, [email, reload])

  if (email === undefined) return <p className="p-10">Loading…</p>
  if (fatal && !email) return <p className="m-10 max-w-lg rounded-xl bg-red-50 p-6 text-red-800">{fatal}</p>
  if (!email) return <Login onDone={setEmail} />

  const logout = async () => {
    await api.post('/api/admin/logout')
    setEmail(null)
    setData(null)
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <LogoMark size={38} />
            <span className="font-display text-xl font-bold uppercase tracking-[0.18em]">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-charcoal/25 px-4 py-2 text-[13px] font-semibold hover:border-charcoal/60">
              View site <ExternalLink size={14} aria-hidden="true" />
            </a>
            <Btn variant="dark" onClick={logout}><LogOut size={14} /> Sign out</Btn>
          </div>
        </div>
        <nav aria-label="Admin sections" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} type="button" aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition ${tab === id ? 'bg-charcoal text-ivory' : 'hover:bg-charcoal/10'}`}>
              <Icon size={15} aria-hidden="true" /> {label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {fatal && <Notice kind="err">{fatal}</Notice>}
        {!data ? (
          <p>Loading content…</p>
        ) : (
          <>
            {tab === 'text' && <CopyPanel data={data} reload={reload} />}
            {tab === 'showcase' && <ShowcasePanel data={data} reload={reload} />}
            {tab === 'categories' && <CategoriesPanel data={data} reload={reload} />}
            {tab === 'why' && <WhyPanel data={data} reload={reload} />}
            {tab === 'site' && <SitePanel data={data} reload={reload} />}
            {tab === 'media' && <MediaPanel />}
            {tab === 'account' && <AccountPanel email={email} />}
          </>
        )}
      </main>
    </div>
  )
}
