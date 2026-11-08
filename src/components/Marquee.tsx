export default function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-12 whitespace-nowrap font-display text-3xl italic text-charcoal/80 sm:text-4xl">
          {t}
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="overflow-hidden border-y border-charcoal/10 bg-ivory py-7" role="presentation">
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
