/**
 * EDITABLE SITE DETAILS
 * Everything marked "placeholder" must be replaced with real details before launch.
 */
export const site = {
  name: 'Packup',
  tagline: 'Pack. Store. Deliver.',
  // --- placeholders: replace these ---
  email: '',
  phone: '',
  location: '',
  social: {
    instagram: '',
    linkedin: '',
    facebook: '',
  },
  /** The e-commerce platform where customers browse products and send RFQs (set in the admin). */
  marketplaceUrl: '',
  marketplaceNewTab: false,
  /**
   * Set VITE_FORM_ENDPOINT in a .env file (e.g. a Formspree / Getform / your own API URL)
   * to make the enquiry forms send real submissions. See README.md.
   */
  // Only a real http(s) URL enables sending; anything else (empty, "none") keeps the forms in demo mode.
  formEndpoint: /^https?:\/\//.test((import.meta.env.VITE_FORM_ENDPOINT as string | undefined) ?? '') ? (import.meta.env.VITE_FORM_ENDPOINT as string) : '',
}

export const placeholder = {
  email: '[ Add business email ]',
  phone: '[ Add phone number ]',
  location: '[ Add office location ]',
}

export type NavItem = { label: string; to: string; children?: { label: string; to: string }[] }

/** Main menu, in display order. Items with `children` open a dropdown (desktop) or an indented list (mobile). */
export const nav: NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'About',
    to: '/about',
    children: [
      { label: 'Packaging', to: '/packaging' },
      { label: 'Gallery', to: '/gallery' },
    ],
  },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
  { label: 'For Vendors', to: '/vendors' },
]

/** Every page in the menu, flattened (used by the footer). */
export const navFlat = nav.flatMap((n) => [{ label: n.label, to: n.to }, ...(n.children ?? [])])

/** Label of the main call-to-action that leads to the e-commerce platform. */
export const EXPLORE_LABEL = 'Explore products'
