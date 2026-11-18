import { useEffect, useState, type ReactNode } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { api, type MediaFile } from './api'

export const inputCls =
  'w-full rounded-xl border border-charcoal/20 bg-white px-3.5 py-2.5 text-[15px] text-charcoal outline-none transition focus:border-[#B8964F] focus:ring-2 focus:ring-gold/30'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-charcoal/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-charcoal/50">{hint}</span>}
    </label>
  )
}

export function Btn({ children, variant = 'dark', ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'dark' | 'gold' | 'ghost' | 'danger' }) {
  const v = {
    dark: 'bg-charcoal text-ivory hover:bg-black',
    gold: 'bg-gradient-to-b from-[#E3C688] to-[#C9A25A] text-charcoal hover:brightness-105',
    ghost: 'border border-charcoal/25 text-charcoal hover:border-charcoal/60 bg-white/60',
    danger: 'border border-red-300 text-red-700 hover:bg-red-50 bg-white/60',
  }[variant]
  return (
    <button type="button" {...p} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-50 ${v} ${p.className ?? ''}`}>
      {children}
    </button>
  )
}

export function Card({ title, children, actions }: { title?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-charcoal/10 bg-white/70 p-6 shadow-[0_8px_30px_-18px_rgba(22,17,14,0.35)]">
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {title && <h3 className="font-display text-2xl">{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}

export function Notice({ kind, children }: { kind: 'ok' | 'err'; children: ReactNode }) {
  return (
    <p role={kind === 'err' ? 'alert' : 'status'} className={`rounded-xl px-4 py-3 text-[14px] ${kind === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
      {children}
    </p>
  )
}

/** Save button + status line used by every editor. */
export function useSaver() {
  const [state, setState] = useState<{ kind: 'idle' | 'saving' | 'ok' | 'err'; msg?: string }>({ kind: 'idle' })
  useEffect(() => {
    if (state.kind !== 'ok') return
    const t = setTimeout(() => setState({ kind: 'idle' }), 3500)
    return () => clearTimeout(t)
  }, [state])
  const run = async (fn: () => Promise<void>) => {
    setState({ kind: 'saving' })
    try {
      await fn()
      setState({ kind: 'ok', msg: 'Saved — live on the site now.' })
    } catch (e) {
      setState({ kind: 'err', msg: e instanceof Error ? e.message : 'Could not save' })
    }
  }
  const status = state.kind === 'ok' || state.kind === 'err' ? <Notice kind={state.kind}>{state.msg}</Notice> : null
  return { saving: state.kind === 'saving', run, status }
}

export const fmtSize = (n: number) => (n > 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB')

/** Modal to choose (or upload) an image from the media library. */
export function ImagePicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [files, setFiles] = useState<MediaFile[] | null>(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const load = () => api.get<{ files: MediaFile[] }>('/api/admin/media').then((r) => setFiles(r.files)).catch((e) => setErr(e.message))
  useEffect(() => {
    load()
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const up = async (list: FileList | null) => {
    if (!list?.length) return
    setBusy(true)
    setErr('')
    try {
      const r = await api.upload<{ files: MediaFile[] }>('/api/admin/media', [...list])
      await load()
      if (r.files.length === 1) onPick(r.files[0].url)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed')
    }
    setBusy(false)
  }
  return (
    <div role="dialog" aria-modal="true" aria-label="Choose an image" className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/70 p-4" onClick={onClose}>
      <div className="max-h-[88vh] w-full max-w-4xl overflow-auto rounded-[1.75rem] bg-ivory p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl">Choose an image</h3>
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-[13px] font-semibold text-ivory hover:bg-black">
              <ImagePlus size={16} aria-hidden="true" /> {busy ? 'Uploading…' : 'Upload new'}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" multiple className="sr-only" onChange={(e) => up(e.target.files)} />
            </label>
            <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-charcoal/10">
              <X size={20} />
            </button>
          </div>
        </div>
        {err && <Notice kind="err">{err}</Notice>}
        {files === null ? (
          <p className="text-charcoal/60">Loading…</p>
        ) : files.length === 0 ? (
          <p className="rounded-xl border border-dashed border-charcoal/25 p-8 text-center text-charcoal/60">No images yet — upload your first one.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {files.map((f) => (
              <li key={f.name}>
                <button type="button" onClick={() => onPick(f.url)} className="group block w-full overflow-hidden rounded-2xl border border-charcoal/15 bg-white text-left transition hover:border-gold">
                  <img src={f.url} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                  <span className="block truncate px-3 py-2 text-[12px] text-charcoal/60">{f.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/** Image field: preview + choose/remove. */
export function ImageField({ value, onChange, label = 'Photo' }: { value?: string; onChange: (v: string) => void; label?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-charcoal/60">{label}</span>
      <div className="flex items-center gap-4">
        {value ? <img src={value} alt="" className="h-20 w-20 rounded-2xl border border-charcoal/15 object-cover" /> : <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-charcoal/30 text-[11px] text-charcoal/50">None</span>}
        <div className="flex flex-wrap gap-2">
          <Btn variant="ghost" onClick={() => setOpen(true)}>
            {value ? 'Change' : 'Choose image'}
          </Btn>
          {value && (
            <Btn variant="ghost" onClick={() => onChange('')}>
              Remove
            </Btn>
          )}
        </div>
      </div>
      <p className="mt-1 text-[12px] text-charcoal/50">Without a photo, the site shows the illustrated concept.</p>
      {open && (
        <ImagePicker
          onClose={() => setOpen(false)}
          onPick={(u) => {
            onChange(u)
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}
