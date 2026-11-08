import { ChefHat, Factory, ClipboardList } from 'lucide-react'
import { Reveal, WordReveal } from './motion'
import { LogoMark } from './Logo'

const nodes = [
  { Icon: ChefHat, k: 'The customer', t: 'Restaurants & merchants', d: 'Pizzerias, cloud kitchens, cafés and food brands tell us what they need to package.' },
  { Icon: ClipboardList, k: 'The bridge', t: 'The Pack Up', d: 'We shape the brief, match it with suitable vendors and keep both sides clear on requirements.', bridge: true },
  { Icon: Factory, k: 'The vendor', t: 'Packaging vendors', d: 'Manufacturers and suppliers who actually make, price and deliver the boxes, bags and cups.' },
]

/** Explains the platform model: The Pack Up connects customers and vendors — it does not manufacture. */
export default function HowItBridges() {
  return (
    <section className="bg-cream py-24 lg:py-32" aria-labelledby="bridge-title">
      <div className="container-x">
        <Reveal y={12}>
          <p className="eyebrow">How it works</p>
        </Reveal>
        <WordReveal className="display-lg mt-5 max-w-3xl" text="Customer on one side. Vendor on the other. We’re the bridge." />
        <h2 id="bridge-title" className="sr-only">How The Pack Up connects customers and packaging vendors</h2>

        <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {nodes.map((n, i) => (
            <div key={n.t} className="contents">
              {i > 0 && (
                <div aria-hidden="true" className="flex items-center justify-center lg:px-1">
                  <svg viewBox="0 0 80 40" className="h-8 w-16 rotate-90 text-gold lg:h-10 lg:w-20 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 32Q40 -8 76 32" />
                    <path d="M4 32H76" strokeOpacity="0.5" />
                  </svg>
                </div>
              )}
              <Reveal delay={i * 0.12} className={`flex flex-col rounded-[2rem] p-9 text-center ${n.bridge ? 'aurora text-ivory' : 'card'}`}>
                <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${n.bridge ? 'bg-white/10' : 'bg-charcoal/[0.05]'}`}>
                  {n.bridge ? <LogoMark size={44} /> : <n.Icon size={28} strokeWidth={1.3} className="text-[#8F7038]" aria-hidden="true" />}
                </span>
                <p className="eyebrow mt-6">{n.k}</p>
                <h3 className="mt-2 font-display text-3xl">{n.t}</h3>
                <p className={`mt-3 text-[15px] leading-relaxed ${n.bridge ? 'text-ivory/65' : 'text-charcoal/65'}`}>{n.d}</p>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="mx-auto max-w-2xl text-center text-[14px] leading-relaxed text-charcoal/60">
            The Pack Up does not manufacture, print or ship packaging. Specifications, samples, pricing and delivery are agreed directly between you and the vendor.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
