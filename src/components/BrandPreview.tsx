import { useState } from 'react'
import { Packaging, type PackKind } from './Packaging'
import { merchants } from '../data/merchants'
import { useCopy } from '../cms/CmsContext'
import { Reveal } from './motion'

const formats: { kind: PackKind; label: string }[] = [
  { kind: 'pizza', label: 'Pizza box' },
  { kind: 'burger', label: 'Burger clamshell' },
  { kind: 'bag', label: 'Paper bag' },
  { kind: 'cup', label: 'Paper cup' },
]

/** Interactive preview: one sample brand, four packaging formats. Illustrative only. */
export default function BrandPreview() {
  const t = useCopy()
  const [id, setId] = useState(merchants[0].id)
  const m = merchants.find((x) => x.id === id) ?? merchants[0]
  return (
    <section className="ambient py-20 lg:py-28">
      <div className="container-x">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal y={10}>
              <p className="eyebrow">{t('home.studioEyebrow')}</p>
              <h2 className="display-lg mt-4 max-w-2xl">{t('home.studioTitle')}</h2>
              <p className="lead mt-5 max-w-xl text-charcoal/70">{t('home.studioText')}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">Sample brand</p>
            <div role="radiogroup" aria-label="Sample brand" className="mt-3 flex flex-wrap gap-2">
              {merchants.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={x.id === id}
                  onClick={() => setId(x.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium transition ${x.id === id ? 'border-charcoal bg-charcoal text-white' : 'border-charcoal/15 bg-white hover:border-gold'}`}
                >
                  <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ background: x.bg }} />
                  {x.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {formats.map((f) => (
            <div key={f.kind} className="card overflow-hidden">
              <div className="bg-gradient-to-b from-cream to-ivory px-3 pt-4">
                <Packaging kind={f.kind} merchant={m} className="aspect-[1.09/1] w-full" />
              </div>
              <p className="px-5 py-4 text-[15px] font-semibold">{f.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-charcoal/50">Illustrative concepts with fictional sample brands. Final packaging depends on the vendor.</p>
      </div>
    </section>
  )
}
