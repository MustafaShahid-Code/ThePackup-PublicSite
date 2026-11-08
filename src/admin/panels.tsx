import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from 'lucide-react'
import { ArtTile } from '../components/shared'
import { merchants } from '../data/merchants'
import type { Category } from '../data/content'
import type { WorkItem } from '../data/work'
import { api, type AdminContent, type MediaFile } from './api'
import { Btn, Card, Field, ImageField, fmtSize, inputCls, Notice, useSaver } from './ui'

type PanelProps = { data: AdminContent; reload: () => Promise<void> }

/* ------------------------------------------------ Site details */
export function SitePanel({ data, reload }: PanelProps) {
  const [s, setS] = useState(data.site)
  const { run, saving, status } = useSaver()
  const set = (k: 'email' | 'phone' | 'location', v: string) => setS({ ...s, [k]: v })
  const soc = (k: 'instagram' | 'linkedin' | 'facebook', v: string) => setS({ ...s, social: { ...s.social, [k]: v } })
  return (
    <Card title="Contact details & social links">
      <p className="mb-5 max-w-xl text-[14px] text-charcoal/60">Shown in the footer, the header menu and the Contact page. Leave a field empty to keep the “add this” placeholder visible.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Business email">
          <input className={inputCls} type="email" value={s.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className={inputCls} value={s.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Office location">
            <input className={inputCls} value={s.location} onChange={(e) => set('location', e.target.value)} />
          </Field>
        </div>
        {(['instagram', 'linkedin', 'facebook'] as const).map((k) => (
          <Field key={k} label={`${k[0].toUpperCase()}${k.slice(1)} URL`} hint="Full address starting with https://">
            <input className={inputCls} type="url" placeholder="https://" value={s.social[k]} onChange={(e) => soc(k, e.target.value)} />
          </Field>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Btn variant="gold" disabled={saving} onClick={() => run(async () => { await api.put('/api/admin/site', { site: s }); await reload() })}>
          {saving ? 'Saving…' : 'Save changes'}
        </Btn>
        {status}
      </div>
    </Card>
  )
}

/* ------------------------------------------------ Page text */
export function CopyPanel({ data, reload }: PanelProps) {
  const [vals, setVals] = useState<Record<string, string>>(() => Object.fromEntries(data.schema.map((f) => [f.key, data.copy[f.key] ?? f.default])))
  const groups = useMemo(() => [...new Set(data.schema.map((f) => f.group))], [data.schema])
  const [group, setGroup] = useState(groups[0])
  const { run, saving, status } = useSaver()
  const save = () =>
    run(async () => {
      const copy: Record<string, string> = {}
      data.schema.forEach((f) => {
        if (vals[f.key] !== f.default && vals[f.key].trim()) copy[f.key] = vals[f.key]
      })
      await api.put('/api/admin/copy', { copy })
      await reload()
    })
  return (
    <Card
      title="Page text"
      actions={
        <div role="tablist" aria-label="Page" className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <button key={g} role="tab" aria-selected={g === group} type="button" onClick={() => setGroup(g)} className={`rounded-full px-4 py-1.5 text-[13px] font-semibold ${g === group ? 'bg-charcoal text-ivory' : 'border border-charcoal/20 hover:border-charcoal/50'}`}>
              {g}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-5">
        {data.schema
          .filter((f) => f.group === group)
          .map((f) => (
            <div key={f.key}>
              <Field label={f.label}>
                {f.type === 'textarea' ? (
                  <textarea rows={4} className={`${inputCls} resize-y`} value={vals[f.key]} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} />
                ) : (
                  <input className={inputCls} value={vals[f.key]} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} />
                )}
              </Field>
              {vals[f.key] !== f.default && (
                <button type="button" className="mt-1 text-[12px] text-[#8F7038] underline" onClick={() => setVals({ ...vals, [f.key]: f.default })}>
                  Reset to original wording
                </button>
              )}
            </div>
          ))}
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Btn variant="gold" disabled={saving} onClick={save}>
          {saving ? 'Saving…' : 'Save all page text'}
        </Btn>
        {status}
      </div>
      <p className="mt-3 text-[12px] text-charcoal/50">Saves every page, not just the visible tab.</p>
    </Card>
  )
}

/* ------------------------------------------------ Categories */
export function CategoriesPanel({ data, reload }: PanelProps) {
  const [cats, setCats] = useState<Category[]>(data.categories)
  const [i, setI] = useState(0)
  const c = cats[i]
  const { run, saving, status } = useSaver()
  const upd = (patch: Partial<Category>) => setCats(cats.map((x, n) => (n === i ? { ...x, ...patch } : x)))
  const lines = (v: string) => v.split('\n')
  return (
    <Card title="Packaging categories">
      <div role="tablist" aria-label="Category" className="mb-6 flex flex-wrap gap-2">
        {cats.map((x, n) => (
          <button key={x.slug} role="tab" aria-selected={n === i} type="button" onClick={() => setI(n)} className={`rounded-full px-4 py-1.5 text-[13px] font-semibold ${n === i ? 'bg-charcoal text-ivory' : 'border border-charcoal/20 hover:border-charcoal/50'}`}>
            {x.title}
          </button>
        ))}
      </div>
      <div className="grid gap-5">
        <Field label="Title">
          <input className={inputCls} value={c.title} onChange={(e) => upd({ title: e.target.value })} />
        </Field>
        <Field label="Short line (cards)">
          <textarea rows={2} className={`${inputCls} resize-y`} value={c.short} onChange={(e) => upd({ short: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea rows={5} className={`${inputCls} resize-y`} value={c.description} onChange={(e) => upd({ description: e.target.value })} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="What vendors can offer" hint="One per line">
            <textarea rows={6} className={`${inputCls} resize-y`} value={c.customisation.join('\n')} onChange={(e) => upd({ customisation: lines(e.target.value) })} />
          </Field>
          <Field label="Typical customers" hint="One per line">
            <textarea rows={6} className={`${inputCls} resize-y`} value={c.applications.join('\n')} onChange={(e) => upd({ applications: lines(e.target.value) })} />
          </Field>
        </div>
        <ImageField label="Category photo" value={c.image} onChange={(v) => upd({ image: v || undefined })} />
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Btn variant="gold" disabled={saving} onClick={() => run(async () => { await api.put('/api/admin/categories', { categories: cats }); await reload() })}>
          {saving ? 'Saving…' : 'Save categories'}
        </Btn>
        {status}
      </div>
    </Card>
  )
}

/* ------------------------------------------------ Why us */
export function WhyPanel({ data, reload }: PanelProps) {
  const [items, setItems] = useState(data.why)
  const { run, saving, status } = useSaver()
  const upd = (n: number, patch: Partial<{ title: string; text: string }>) => setItems(items.map((x, k) => (k === n ? { ...x, ...patch } : x)))
  const move = (n: number, d: number) => {
    const a = [...items]
    ;[a[n], a[n + d]] = [a[n + d], a[n]]
    setItems(a)
  }
  return (
    <Card title="“Why The Pack Up” points">
      <ul className="space-y-4">
        {items.map((w, n) => (
          <li key={n} className="rounded-2xl border border-charcoal/10 bg-white p-4">
            <div className="grid gap-3">
              <Field label={`Point ${n + 1} — title`}>
                <input className={inputCls} value={w.title} onChange={(e) => upd(n, { title: e.target.value })} />
              </Field>
              <Field label="Text">
                <textarea rows={3} className={`${inputCls} resize-y`} value={w.text} onChange={(e) => upd(n, { text: e.target.value })} />
              </Field>
            </div>
            <div className="mt-3 flex gap-2">
              <Btn variant="ghost" disabled={n === 0} onClick={() => move(n, -1)} aria-label="Move up"><ArrowUp size={15} /></Btn>
              <Btn variant="ghost" disabled={n === items.length - 1} onClick={() => move(n, 1)} aria-label="Move down"><ArrowDown size={15} /></Btn>
              <Btn variant="danger" disabled={items.length <= 1} onClick={() => setItems(items.filter((_, k) => k !== n))} aria-label="Delete point"><Trash2 size={15} /></Btn>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Btn variant="ghost" disabled={items.length >= 10} onClick={() => setItems([...items, { title: 'New point', text: 'Describe it here.' }])}><Plus size={15} /> Add point</Btn>
        <Btn variant="gold" disabled={saving} onClick={() => run(async () => { await api.put('/api/admin/why', { why: items }); await reload() })}>
          {saving ? 'Saving…' : 'Save points'}
        </Btn>
        {status}
      </div>
    </Card>
  )
}

/* ------------------------------------------------ Showcase */
export function ShowcasePanel({ data, reload }: PanelProps) {
  const [items, setItems] = useState<WorkItem[]>(data.work)
  const [sel, setSel] = useState(0)
  const { run, saving, status } = useSaver()
  const o = data.options
  const it = items[sel]
  const upd = (patch: Partial<WorkItem>) => setItems(items.map((x, n) => (n === sel ? { ...x, ...patch } : x)))
  const move = (d: number) => {
    const n = sel + d
    if (n < 0 || n >= items.length) return
    const a = [...items]
    ;[a[sel], a[n]] = [a[n], a[sel]]
    setItems(a)
    setSel(n)
  }
  const add = () => {
    setItems([...items, { id: 'new' + Date.now().toString(36), title: 'New concept', caption: '', filter: 'Pizza', kind: 'pizza', merchantId: 'casa-rosso', tone: 'beige', size: 'mid' } as WorkItem])
    setSel(items.length)
  }
  const del = () => {
    if (!confirm(`Delete “${it.title}”?`)) return
    setItems(items.filter((_, n) => n !== sel))
    setSel(Math.max(0, sel - 1))
  }
  const sel_ = (v: string | undefined, f: (x: string) => void, list: string[]) => (
    <select className={inputCls} value={v ?? ''} onChange={(e) => f(e.target.value)}>
      {list.map((x) => (
        <option key={x} value={x}>{x}</option>
      ))}
    </select>
  )
  return (
    <Card
      title="Showcase gallery"
      actions={
        <div className="flex flex-wrap items-center gap-3">
          {status}
          <Btn variant="ghost" onClick={add}><Plus size={15} /> Add item</Btn>
          <Btn variant="gold" disabled={saving} onClick={() => run(async () => { await api.put('/api/admin/work', { work: items }); await reload() })}>
            {saving ? 'Saving…' : 'Save gallery'}
          </Btn>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <ol className="max-h-[560px] space-y-2 overflow-auto pr-1" aria-label="Gallery items">
          {items.map((w, n) => (
            <li key={w.id}>
              <button type="button" onClick={() => setSel(n)} aria-current={n === sel} className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-left transition ${n === sel ? 'border-gold bg-gold/10' : 'border-charcoal/10 bg-white hover:border-charcoal/30'}`}>
                <span className="w-14 shrink-0 overflow-hidden rounded-xl">
                  <ArtTile kind={w.kind} merchantId={w.merchantId} finish={w.finish} tone={w.tone} image={w.image} alt="" className="aspect-square" pad="p-1" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold">{w.title}</span>
                  <span className="block text-[12px] text-charcoal/55">{w.filter}{w.image ? ' · photo' : ''}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        {it ? (
          <div className="grid content-start gap-5">
            <Field label="Title">
              <input className={inputCls} value={it.title} onChange={(e) => upd({ title: e.target.value })} />
            </Field>
            <Field label="Caption">
              <input className={inputCls} value={it.caption} onChange={(e) => upd({ caption: e.target.value })} />
            </Field>
            <ImageField value={it.image} onChange={(v) => upd({ image: v || undefined })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Gallery filter">{sel_(it.filter, (v) => upd({ filter: v as WorkItem['filter'] }), o.filters)}</Field>
              <Field label="Tile height">{sel_(it.size, (v) => upd({ size: v as WorkItem['size'] }), o.sizes)}</Field>
            </div>
            <details className="rounded-2xl border border-charcoal/10 bg-white/60 p-4">
              <summary className="cursor-pointer text-[13px] font-semibold">Illustration settings (used when there is no photo)</summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Packaging type">{sel_(it.kind, (v) => upd({ kind: v as WorkItem['kind'] }), o.kinds)}</Field>
                <Field label="Sample brand">
                  <select className={inputCls} value={it.merchantId} onChange={(e) => upd({ merchantId: e.target.value })}>
                    {merchants.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Background tone">{sel_(it.tone, (v) => upd({ tone: v as WorkItem['tone'] }), o.tones)}</Field>
                <Field label="Pizza box finish">{sel_(it.finish ?? '', (v) => upd({ finish: (v || undefined) as WorkItem['finish'] }), ['', ...o.finishes])}</Field>
              </div>
            </details>
            <div className="flex flex-wrap gap-2">
              <Btn variant="ghost" disabled={sel === 0} onClick={() => move(-1)}><ArrowUp size={15} /> Move up</Btn>
              <Btn variant="ghost" disabled={sel === items.length - 1} onClick={() => move(1)}><ArrowDown size={15} /> Move down</Btn>
              <Btn variant="danger" onClick={del}><Trash2 size={15} /> Delete</Btn>
            </div>
            <p className="text-[12px] text-charcoal/50">Order here is the order on the site. The first six items featured on the Home page are items 1, 4, 8, 7, 6 and 12.</p>
          </div>
        ) : (
          <p className="text-charcoal/60">No items. Add one to get started.</p>
        )}
      </div>
    </Card>
  )
}

/* ------------------------------------------------ Media */
export function MediaPanel() {
  const [files, setFiles] = useState<MediaFile[] | null>(null)
  const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const load = () => api.get<{ files: MediaFile[] }>('/api/admin/media').then((r) => setFiles(r.files)).catch((e) => setMsg({ k: 'err', t: e.message }))
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const up = async (l: FileList | null) => {
    if (!l?.length) return
    setBusy(true)
    setMsg(null)
    try {
      const r = await api.upload<{ files: MediaFile[] }>('/api/admin/media', [...l])
      setMsg({ k: 'ok', t: `${r.files.length} image${r.files.length === 1 ? '' : 's'} uploaded.` })
      await load()
    } catch (e) {
      setMsg({ k: 'err', t: e instanceof Error ? e.message : 'Upload failed' })
    }
    setBusy(false)
  }
  const del = async (f: MediaFile) => {
    if (!confirm(`Delete ${f.name}?`)) return
    try {
      await api.del(`/api/admin/media/${encodeURIComponent(f.name)}`)
      await load()
    } catch (e) {
      setMsg({ k: 'err', t: e instanceof Error ? e.message : 'Could not delete' })
    }
  }
  return (
    <Card
      title="Media library"
      actions={
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-[13px] font-semibold text-ivory hover:bg-black">
          <Upload size={15} aria-hidden="true" /> {busy ? 'Uploading…' : 'Upload images'}
          <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="sr-only" onChange={(e) => up(e.target.files)} />
        </label>
      }
    >
      <p className="mb-4 text-[13px] text-charcoal/55">JPG, PNG, WebP, AVIF or GIF · up to 8 MB each. Optimise large photos (about 1600 px wide) before uploading for a faster site. Use images you own or are licensed to use.</p>
      {msg && <div className="mb-4"><Notice kind={msg.k}>{msg.t}</Notice></div>}
      {files === null ? (
        <p className="text-charcoal/60">Loading…</p>
      ) : files.length === 0 ? (
        <p className="rounded-xl border border-dashed border-charcoal/25 p-10 text-center text-charcoal/60">No images uploaded yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {files.map((f) => (
            <li key={f.name} className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
              <img src={f.url} alt="" className="aspect-square w-full object-cover" loading="lazy" />
              <div className="p-3">
                <p className="truncate text-[12px] text-charcoal/70">{f.name}</p>
                <p className="text-[11px] text-charcoal/45">{fmtSize(f.size)}</p>
                <button type="button" onClick={() => del(f)} className="mt-2 text-[12px] font-semibold text-red-700 underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

/* ------------------------------------------------ Account */
export function AccountPanel({ email }: { email: string }) {
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const { run, saving, status } = useSaver()
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Change password">
        <p className="mb-4 text-[14px] text-charcoal/60">Signed in as {email}.</p>
        <div className="grid gap-4">
          <Field label="Current password"><input className={inputCls} type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
          <Field label="New password" hint="At least 10 characters"><input className={inputCls} type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Btn variant="gold" disabled={saving || !cur || next.length < 10} onClick={() => run(async () => { await api.post('/api/admin/password', { current: cur, next }); setCur(''); setNext('') })}>Update password</Btn>
          {status}
        </div>
      </Card>
      <Card title="Backup">
        <p className="mb-4 text-[14px] text-charcoal/60">Download all site content as a JSON file. Uploaded images live in the server’s data folder (see HOSTING.md) — back that folder up too.</p>
        <a href="/api/admin/export" className="inline-flex rounded-full border border-charcoal/25 bg-white/60 px-5 py-2.5 text-[13px] font-semibold hover:border-charcoal/60">Download content backup</a>
      </Card>
    </div>
  )
}
