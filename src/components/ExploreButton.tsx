import type { ComponentProps } from 'react'
import Button from './Button'
import { EXPLORE_LABEL } from '../data/site'
import { useSite } from '../cms/CmsContext'

/**
 * Where "Explore products" leads: the e-commerce platform set in the admin (Contact & links),
 * where customers browse products and submit an RFQ. Until that address is set, it falls back
 * to the Packaging page on this site, so the button never dead-ends.
 */
export function useMarketplace() {
  const site = useSite()
  const url = site.marketplaceUrl?.trim()
  return url ? { href: url, newTab: site.marketplaceNewTab === true, external: true as const } : { to: '/packaging', external: false as const }
}

type Props = Omit<ComponentProps<typeof Button>, 'to' | 'href' | 'newTab' | 'children'> & { label?: string }

export default function ExploreButton({ label = EXPLORE_LABEL, ...rest }: Props) {
  const m = useMarketplace()
  return m.external ? (
    <Button {...rest} href={m.href} newTab={m.newTab}>
      {label}
    </Button>
  ) : (
    <Button {...rest} to={m.to}>
      {label}
    </Button>
  )
}
