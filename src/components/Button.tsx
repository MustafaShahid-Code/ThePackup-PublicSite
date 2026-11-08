import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

type Variant = 'gold' | 'dark' | 'outlineLight' | 'outlineDark'

const styles: Record<Variant, { base: string; sweep: string; hover: string }> = {
  gold: {
    base: 'bg-gradient-to-b from-[#DDBF85] to-[#B8955A] text-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_26px_-12px_rgba(198,165,106,0.8)]',
    sweep: 'bg-ivory',
    hover: '',
  },
  dark: {
    base: 'bg-charcoal text-ivory shadow-[0_12px_26px_-14px_rgba(22,17,14,0.8)]',
    sweep: 'bg-gold',
    hover: 'group-hover:text-charcoal',
  },
  outlineLight: {
    base: 'border border-white/25 bg-white/[0.07] text-ivory shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-md',
    sweep: 'bg-ivory',
    hover: 'group-hover:text-charcoal',
  },
  outlineDark: { base: 'border border-charcoal/25 text-charcoal', sweep: 'bg-charcoal', hover: 'group-hover:text-ivory' },
}

interface Props {
  children: ReactNode
  variant?: Variant
  to?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  arrow?: boolean
  size?: 'md' | 'sm'
  className?: string
}

export default function Button({
  children,
  variant = 'gold',
  to,
  href,
  onClick,
  type = 'button',
  disabled,
  arrow = true,
  size = 'md',
  className = '',
}: Props) {
  const s = styles[variant]
  const cls = `group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-sans font-semibold uppercase tracking-[0.16em] transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-60 ${
    size === 'md' ? 'px-8 py-4 text-[11.5px]' : 'px-5 py-3 text-[10.5px]'
  } ${s.base} ${className}`
  const inner = (
    <>
      <span aria-hidden="true" className={`absolute inset-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 ${s.sweep}`} />
      <span className={`relative z-10 inline-flex items-center gap-3 transition-colors duration-500 ${s.hover}`}>
        {children}
        {arrow && <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />}
      </span>
    </>
  )
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  if (href) return <a href={href} className={cls}>{inner}</a>
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  )
}
