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

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Packaging', to: '/packaging' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'For Vendors', to: '/vendors' },
  { label: 'About', to: '/about' },
]
