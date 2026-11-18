import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Download, History, RotateCcw, XCircle } from 'lucide-react'
import { api, type AdminContent } from './api'
import { Btn, Card, Notice, fmtSize, useSaver } from './ui'

interface Status {
  node: string
  uptimeSeconds: number
  dataDir: string
  dataDirWritable: boolean
  imageOptimisation: boolean
  uploads: { count: number; bytes: number }
  contentUpdatedAt: string
  lastAutoBackup: number | null
}
interface Backup {
  name: string
  kind: string
  size: number
  mtime: number
}

const when = (t: number | string | null) => (t ? new Date(t).toLocaleString() : 'Never')
const uptime = (s: number) => (s > 86400 ? `${Math.floor(s / 86400)} d ${Math.floor((s % 86400) / 3600)} h` : s > 3600 ? `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min` : `${Math.max(1, Math.floor(s / 60))} min`)
const kindLabel = (k: string) => (k === 'auto' ? 'Automatic (daily)' : k === 'manual' ? 'Manual' : 'Before a restore')

function Row({ ok, label, value }: { ok?: boolean; label: string; value: string }) {
  return (
    <li className="flex items-start justify-between gap-4 border-b border-charcoal/10 py-2.5 text-[14px] last:border-0">
      <span className="flex items-center gap-2 text-charcoal/65">
        {ok === undefined ? null : ok ? <CheckCircle2 size={16} className="text-emerald-600" aria-hidden="true" /> : <XCircle size={16} className="text-red-600" aria-hidden="true" />}
        {label}
      </span>
      <span className="text-right font-medium">{value}</span>
    </li>
  )
}

export default function SystemPanel({ data, reload }: { data: AdminContent; reload: () => Promise<void> }) {
  const [status, setStatus] = useState<Status | null>(null)
  const [backups, setBackups] = useState<Backup[] | null>(null)
  const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [cookie, setCookie] = useState(data.settings.cookieNotice)
  const saver = useSaver()

  const load = useCallback(async () => {
    try {
      const [s, b] = await Promise.all([api.get<Status>('/api/admin/status'), api.get<{ backups: Backup[] }>('/api/admin/backups')])
      setStatus(s)
      setBackups(b.backups)
    } catch (e) {
      setMsg({ k: 'err', t: e instanceof Error ? e.message : 'Could not load' })
    }
  }, [])
  useEffect(() => {
    load()
  }, [load])

  const backupNow = async () => {
    setBusy(true)
    setMsg(null)
    try {
      const r = await api.post<{ imagesCopied: number }>('/api/admin/backups/run')
      setMsg({ k: 'ok', t: `Backup created${r.imagesCopied ? ` and ${r.imagesCopied} new image(s) copied` : ''}.` })
      await load()
    } catch (e) {
      setMsg({ k: 'err', t: e instanceof Error ? e.message : 'Backup failed' })
    }
    setBusy(false)
  }
  const restore = async (b: Backup) => {
    if (!confirm(`Restore the content from ${when(b.mtime)}?\n\nYour current content is saved first, so you can undo this.`)) return
    setBusy(true)
    setMsg(null)
    try {
      await api.post(`/api/admin/backups/${encodeURIComponent(b.name)}/restore`)
      await reload()
      await load()
      setMsg({ k: 'ok', t: 'Content restored. The live site now shows it.' })
    } catch (e) {
      setMsg({ k: 'err', t: e instanceof Error ? e.message : 'Restore failed' })
    }
    setBusy(false)
  }

  return (
    <div className="space-y-6">
      {msg && <Notice kind={msg.k}>{msg.t}</Notice>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Site health">
          {!status ? (
            <p className="text-charcoal/60">Checking…</p>
          ) : (
            <ul>
              <Row ok={status.dataDirWritable} label="Content & photos can be saved" value={status.dataDirWritable ? 'Yes' : 'No — check DATA_DIR permissions'} />
              <Row ok={status.imageOptimisation} label="Automatic photo compression" value={status.imageOptimisation ? 'On' : 'Off (photos stored as uploaded)'} />
              <Row ok={!!status.lastAutoBackup} label="Last automatic backup" value={when(status.lastAutoBackup)} />
              <Row label="Content last changed" value={when(status.contentUpdatedAt)} />
              <Row label="Photos stored" value={`${status.uploads.count} files · ${fmtSize(status.uploads.bytes)}`} />
              <Row label="Server running for" value={uptime(status.uptimeSeconds)} />
              <Row label="Node version" value={status.node} />
              <Row label="Data folder" value={status.dataDir} />
            </ul>
          )}
          <p className="mt-4 text-[12px] text-charcoal/50">
            A simple public check is available at <code>/api/health</code> — handy for uptime monitors.
          </p>
        </Card>

        <Card title="Cookie notice">
          <p className="mb-4 text-[14px] text-charcoal/65">
            The site currently uses no advertising or analytics cookies, so a banner is optional. Turn it on if you want visitors to see a notice with a link to your privacy page. Edit the wording under Page text → Privacy & cookies.
          </p>
          <label className="flex cursor-pointer items-center gap-3 text-[14px] font-semibold">
            <input type="checkbox" className="h-5 w-5 accent-[#B8964F]" checked={cookie} onChange={(e) => setCookie(e.target.checked)} />
            Show cookie notice on the site
          </label>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Btn variant="gold" disabled={saver.saving} onClick={() => saver.run(async () => { await api.put('/api/admin/settings', { settings: { cookieNotice: cookie } }); await reload() })}>
              {saver.saving ? 'Saving…' : 'Save'}
            </Btn>
            {saver.status}
          </div>
          <p className="mt-4 text-[12px] text-charcoal/50">If you add analytics or advertising tools later, update the privacy text and use a notice that asks for consent first.</p>
        </Card>
      </div>

      <Card
        title="Backups"
        actions={
          <div className="flex flex-wrap gap-2">
            <Btn variant="ghost" disabled={busy} onClick={backupNow}>
              <History size={15} /> Back up now
            </Btn>
            <a href="/api/admin/export-all" className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-[13px] font-semibold text-ivory hover:bg-black">
              <Download size={15} aria-hidden="true" /> Download everything (zip)
            </a>
          </div>
        }
      >
        <p className="mb-4 max-w-2xl text-[14px] text-charcoal/65">
          Content (text, colours, gallery) is backed up automatically once a day and the last 30 are kept. New photos are copied to a backup folder at the same time. “Download everything” gives you one zip with the content and all photos to keep somewhere safe.
        </p>
        {!backups ? (
          <p className="text-charcoal/60">Loading…</p>
        ) : backups.length === 0 ? (
          <p className="rounded-xl border border-dashed border-charcoal/25 p-8 text-center text-charcoal/60">No backups yet. The first automatic one is created shortly after the server starts.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-charcoal/15 text-[12px] uppercase tracking-[0.1em] text-charcoal/55">
                  <th className="py-2 pr-4 font-semibold">When</th>
                  <th className="py-2 pr-4 font-semibold">Type</th>
                  <th className="py-2 pr-4 font-semibold">Size</th>
                  <th className="py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.slice(0, 15).map((b) => (
                  <tr key={b.name} className="border-b border-charcoal/10 last:border-0">
                    <td className="py-2.5 pr-4">{when(b.mtime)}</td>
                    <td className="py-2.5 pr-4 text-charcoal/65">{kindLabel(b.kind)}</td>
                    <td className="py-2.5 pr-4 text-charcoal/65">{fmtSize(b.size)}</td>
                    <td className="py-2.5">
                      <div className="flex gap-4">
                        <a className="font-semibold underline" href={`/api/admin/backups/${encodeURIComponent(b.name)}`}>
                          Download
                        </a>
                        <button type="button" disabled={busy} onClick={() => restore(b)} className="inline-flex items-center gap-1 font-semibold text-[#8F7038] underline disabled:opacity-50">
                          <RotateCcw size={13} aria-hidden="true" /> Restore
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-[12px] text-charcoal/50">Backups live in the same data folder as your content. Keep an off-server copy too (the zip above) in case the hosting account itself is lost.</p>
      </Card>
    </div>
  )
}
