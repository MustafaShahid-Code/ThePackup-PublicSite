import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

type Variant = 'gold' | 'dark' | 'outlineLight' | 'outlineDark'

const styles: Record<Variant, string> = {
  gold: 'btn-primary hover:-translate-y-0.5 hover:brightness-105',
  dark: 'btn-dark hover:-translate-y-0.5 hover:opacity-90',
  outlineLight: 'border border-white/35 text-white hover:border-white hover:bg-white/10',
  outlineDark: 'border-2 border-charcoal/80 text-charcoal hover:bg-charcoal hover:text-white',
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

export default function Button({ children, variant = 'gold', to, href, onClick, type = 'button', disabled, arrow = true, size = 'md', className = '' }: Props) {
  const cls = `btn-shape group inline-flex items-center justify-center gap-2.5 font-sans font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
    size === 'md' ? 'px-7 py-3.5 text-[15px]' : 'px-5 py-2.5 text-[14px]'
  } ${styles[variant]} ${className}`
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />}
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
