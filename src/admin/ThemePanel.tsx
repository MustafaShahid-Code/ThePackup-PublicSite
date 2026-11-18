import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react'
import Button from '../components/Button'
import { THEME_DEFAULTS, contrast, isHex, mergeTheme, themeVars, type Theme } from '../../shared/theme.js'
import { api, type AdminContent } from './api'
import { Btn, Card, inputCls, useSaver } from './ui'

const COLOR_FIELDS: { key: keyof Theme['colors']; label: string; hint: string }[] = [
  { key: 'ink', label: 'Text & dark surfaces', hint: 'Main text colour and dark buttons/panels' },
  { key: 'paper', label: 'Page background', hint: 'Main background and light text on dark' },
  { key: 'cream', label: 'Alternate background', hint: 'Every second section band' },
  { key: 'accent', label: 'Accent', hint: 'Highlights, focus rings, glows' },
  { key: 'deep', label: 'Accent for text', hint: 'Small labels and numbers on light backgrounds (needs good contrast)' },
  { key: 'dark', label: 'Dark panel base', hint: 'Hero, footer and banner background' },
  { key: 'glow', label: 'Dark panel glow', hint: 'Second light inside dark panels' },
  { key: 'card', label: 'Card surface', hint: 'Cards and form panels' },
  { key: 'ember', label: 'Warm highlight', hint: 'Small hero glow' },
]
const BTN_FIELDS: { key: 'primaryFrom' | 'primaryTo' | 'primaryText' | 'darkBg' | 'darkText'; label: string }[] = [
  { key: 'primaryFrom', label: 'Main button — top colour' },
  { key: 'primaryTo', label: 'Main button — bottom colour' },
  { key: 'primaryText', label: 'Main button — text' },
  { key: 'darkBg', label: 'Dark button — background' },
  { key: 'darkText', label: 'Dark button — text' },
]

function ColorInput({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  const [text, setText] = useState(value)
  const typing = useRef(false)
  // keep the text box in step when the value changes from a preset / the picker (but not while typing)
  useEffect(() => {
    if (!typing.current) setText(value)
  }, [value])
  return (
    <div>
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-charcoal/60">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" aria-label={`${label} colour picker`} value={value} onChange={(e) => onChange(e.target.value.toUpperCase())} className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-charcoal/20 bg-white p-1" />
        <input
          onFocus={() => (typing.current = true)}
          onBlur={() => {
            typing.current = false
            setText(value)
          }}
          aria-label={`${label} hex value`}
          className={`${inputCls} font-mono uppercase`}
          value={text}
          maxLength={7}
          onChange={(e) => {
            const v = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
            setText(v)
            if (isHex(v)) onChange(v.toUpperCase())
          }}
        />
      </div>
      {hint && <span className="mt-1 block text-[12px] text-charcoal/50">{hint}</span>}
    </div>
  )
}

export default function ThemePanel({ data, reload }: { data: AdminContent; reload: () => Promise<void> }) {
  const [theme, setTheme] = useState<Theme>(() => mergeTheme(data.theme))
  const { run, saving, status } = useSaver()
  const setColor = (k: keyof Theme['colors'], v: string) => setTheme((t) => ({ ...t, colors: { ...t.colors, [k]: v } }))
  const setBtn = (k: string, v: string) => setTheme((t) => ({ ...t, buttons: { ...t.buttons, [k]: v } as Theme['buttons'] }))
  const vars = useMemo(() => themeVars(theme) as CSSProperties, [theme])

  const c = theme.colors
  const b = theme.buttons
  const checks = [
    { label: 'Body text on page background', ratio: contrast(c.ink, c.paper), need: 4.5 },
    { label: 'Small accent text on page background', ratio: contrast(c.deep, c.paper), need: 4.5 },
    { label: 'Small accent text on cards', ratio: contrast(c.deep, c.card), need: 4.5 },
    { label: 'Light text on dark panels', ratio: contrast(c.paper, c.dark), need: 4.5 },
    { label: 'Accent labels on dark panels', ratio: contrast(c.accent, c.dark), need: 4.5 },
    { label: 'Main button text (top)', ratio: contrast(b.primaryText, b.primaryFrom), need: 4.5 },
    { label: 'Main button text (bottom)', ratio: contrast(b.primaryText, b.primaryTo), need: 4.5 },
    { label: 'Dark button text', ratio: contrast(b.darkText, b.darkBg), need: 4.5 },
  ]
  const bad = checks.filter((x) => x.ratio < x.need)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <Card title="Ready-made themes">
          <div className="flex flex-wrap gap-3">
            {data.presets.map((p) => (
              <button key={p.id} type="button" onClick={() => setTheme(mergeTheme(p.theme))} className="group flex items-center gap-3 rounded-2xl border border-charcoal/15 bg-white px-4 py-3 text-left transition hover:border-gold">
                <span className="flex overflow-hidden rounded-full border border-charcoal/10">
                  {[p.theme.colors.dark, p.theme.colors.paper, p.theme.colors.accent, p.theme.buttons.primaryFrom].map((h, i) => (
                    <span key={i} className="h-7 w-5" style={{ background: h }} />
                  ))}
                </span>
                <span className="text-[13px] font-semibold">{p.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-charcoal/50">Pick one as a starting point, then adjust any colour below. Nothing changes on the live site until you save.</p>
        </Card>

        <Card title="Site colours">
          <div className="grid gap-5 sm:grid-cols-2">
            {COLOR_FIELDS.map((f) => (
              <ColorInput key={f.key} label={f.label} hint={f.hint} value={c[f.key]} onChange={(v) => setColor(f.key, v)} />
            ))}
          </div>
        </Card>

        <Card title="Buttons">
          <div className="grid gap-5 sm:grid-cols-2">
            {BTN_FIELDS.map((f) => (
              <ColorInput key={f.key} label={f.label} value={b[f.key]} onChange={(v) => setBtn(f.key, v)} />
            ))}
          </div>
          <fieldset className="mt-6">
            <legend className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-charcoal/60">Button shape</legend>
            <div className="flex flex-wrap gap-2">
              {(['pill', 'rounded', 'square'] as const).map((s) => (
                <button key={s} type="button" aria-pressed={b.shape === s} onClick={() => setBtn('shape', s)} className={`px-5 py-2.5 text-[13px] font-semibold capitalize transition ${s === 'pill' ? 'rounded-full' : s === 'rounded' ? 'rounded-xl' : 'rounded-sm'} ${b.shape === s ? 'bg-charcoal text-ivory' : 'border border-charcoal/25 bg-white hover:border-charcoal/60'}`}>
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
        </Card>

        <Card title="Readability check">
          <ul className="grid gap-2 sm:grid-cols-2">
            {checks.map((x) => {
              const ok = x.ratio >= x.need
              return (
                <li key={x.label} className={`flex items-start gap-2 rounded-xl px-3 py-2 text-[13px] ${ok ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>
                  {ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />}
                  <span>
                    {x.label} — <strong>{x.ratio.toFixed(1)}:1</strong> {ok ? '' : `(aim for ${x.need}:1 or more)`}
                  </span>
                </li>
              )
            })}
          </ul>
          {bad.length > 0 && <p className="mt-3 text-[13px] text-amber-900">Some text would be hard to read for visitors. You can still save, but consider adjusting the highlighted pairs.</p>}
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <Btn variant="gold" disabled={saving} onClick={() => run(async () => { await api.put('/api/admin/theme', { theme }); await reload() })}>
            {saving ? 'Saving…' : 'Save theme'}
          </Btn>
          <Btn variant="ghost" onClick={() => setTheme(mergeTheme(THEME_DEFAULTS))}>
            <RotateCcw size={14} /> Reset to original
          </Btn>
          {status}
        </div>
      </div>

      {/* Live preview — uses the real components, scoped to this box only */}
      <aside aria-label="Live preview" className="xl:sticky xl:top-40 xl:self-start">
        <div style={vars} className="overflow-hidden rounded-[20px] border border-charcoal/15 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.5)]">
          <div className="navy relative p-7 text-white">
            <p className="eyebrow">Preview</p>
            <p className="mt-3 font-display text-[34px] font-bold leading-[1.05]">Pack. Store. <span className="text-gold">Deliver.</span></p>
            <p className="mt-3 text-[14px] leading-relaxed text-white/70">Light text on the dark panel, with an accent glow behind it.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button arrow={false} size="sm">Main button</Button>
              <Button arrow={false} size="sm" variant="outlineLight">Outline</Button>
            </div>
          </div>
          <div className="bg-ivory p-7 text-charcoal">
            <p className="eyebrow">Section label</p>
            <p className="mt-2 font-display text-2xl">Heading on the page</p>
            <p className="mt-2 text-[14px] leading-relaxed text-charcoal/70">Body text sits on the page background colour.</p>
            <div className="card mt-4 p-5">
              <p className="font-display text-4xl font-bold text-gold">01</p>
              <p className="mt-1 text-[14px] text-charcoal/70">A card using the card surface colour.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button arrow={false} size="sm" variant="dark">Dark button</Button>
                <Button arrow={false} size="sm" variant="outlineDark">Outline</Button>
              </div>
            </div>
          </div>
          <div className="bg-cream p-5 text-center text-[13px] text-charcoal/70">Alternate background band</div>
        </div>
      </aside>
    </div>
  )
}
