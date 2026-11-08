/**
 * EDITABLE SITE DETAILS
 * Everything marked "placeholder" must be replaced with real details before launch.
 */
export const site = {
  name: 'The Pack Up',
  tagline: 'The bridge between restaurants and packaging vendors',
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
   formEndpoint: /^https?:\/\//.test((import.meta.env.VITE_FORM_ENDPOINT as string | undefined) ?? '') ? (import.meta.env.VITE_FORM_ENDPOINT as string) : '',
}

export const placeholder = {
  email: '[ Add business email ]',
  phone: '[ Add phone number ]',
  location: '[ Add office location ]',
}

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Showcase', to: '/our-work' },
  { label: 'Vendors', to: '/vendors' },
  { label: 'Contact', to: '/contact' },
]
