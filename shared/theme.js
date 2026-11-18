// Theme tokens shared by the server (injects CSS into the page) and the React app (admin live preview).
// Plain ESM JavaScript so Node can import it without a build step.

export const THEME_DEFAULTS = {
  colors: {
    ink: '#0F2D3D', // text + dark surfaces (Charcoal Navy)
    paper: '#F7F7F7', // page background / light text on dark
    cream: '#E9EDF0', // alternate section background
    accent: '#FF7A00', // highlights, buttons, focus rings (Packup Orange)
    deep: '#B85400', // accent used as TEXT on light backgrounds (labels, numbers)
    dark: '#0A1F2B', // base of dark panels
    glow: '#1D5A78', // secondary glow inside dark panels
    card: '#FFFFFF', // card surface
    ember: '#9CA3AF', // soft grey (borders / muted details)
  },
  buttons: {
    primaryFrom: '#FF8A1F',
    primaryTo: '#FF7A00',
    primaryText: '#0F2D3D',
    darkBg: '#0F2D3D',
    darkText: '#FFFFFF',
    shape: 'rounded', // pill | rounded | square
  },
}

export const COLOR_KEYS = Object.keys(THEME_DEFAULTS.colors)
export const BUTTON_COLOR_KEYS = ['primaryFrom', 'primaryTo', 'primaryText', 'darkBg', 'darkText']
export const SHAPES = { pill: '9999px', rounded: '12px', square: '2px' }

export const PRESETS = [
  { id: 'packup', name: 'Packup Navy & Orange (default)', theme: THEME_DEFAULTS },
  {
    id: 'slate-amber',
    name: 'Slate & Amber',
    theme: {
      colors: { ink: '#1F2937', paper: '#F8F8F6', cream: '#ECEDEA', accent: '#F59E0B', deep: '#A15C00', dark: '#111827', glow: '#374151', card: '#FFFFFF', ember: '#9CA3AF' },
      buttons: { primaryFrom: '#FBB02D', primaryTo: '#F59E0B', primaryText: '#1F2937', darkBg: '#1F2937', darkText: '#FFFFFF', shape: 'rounded' },
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Blue & Sky',
    theme: {
      colors: { ink: '#0B2545', paper: '#F5F8FC', cream: '#E4ECF6', accent: '#1E88E5', deep: '#0F5FA8', dark: '#071A33', glow: '#1B5E9E', card: '#FFFFFF', ember: '#94A3B8' },
      buttons: { primaryFrom: '#3B9AF0', primaryTo: '#1E88E5', primaryText: '#FFFFFF', darkBg: '#0B2545', darkText: '#FFFFFF', shape: 'rounded' },
    },
  },
  {
    id: 'forest',
    name: 'Forest & Lime',
    theme: {
      colors: { ink: '#10291F', paper: '#F6F8F4', cream: '#E6ECE2', accent: '#84CC16', deep: '#3F6212', dark: '#0A1B14', glow: '#1F5B43', card: '#FFFFFF', ember: '#9CA3AF' },
      buttons: { primaryFrom: '#95DB2A', primaryTo: '#84CC16', primaryText: '#10291F', darkBg: '#10291F', darkText: '#FFFFFF', shape: 'rounded' },
    },
  },
  {
    id: 'mono',
    name: 'Clean Monochrome',
    theme: {
      colors: { ink: '#151515', paper: '#FFFFFF', cream: '#F2F2F0', accent: '#BDBDBD', deep: '#555555', dark: '#0D0D0D', glow: '#2B2B2B', card: '#FFFFFF', ember: '#9CA3AF' },
      buttons: { primaryFrom: '#2A2A2A', primaryTo: '#151515', primaryText: '#FFFFFF', darkBg: '#151515', darkText: '#FFFFFF', shape: 'square' },
    },
  },
]

const HEX = /^#[0-9a-fA-F]{6}$/
export const isHex = (v) => typeof v === 'string' && HEX.test(v)

/** Fill gaps and drop anything invalid — always returns a complete, safe theme. */
export function mergeTheme(input) {
  const d = THEME_DEFAULTS
  const c = input?.colors ?? {}
  const b = input?.buttons ?? {}
  const colors = {}
  for (const k of COLOR_KEYS) colors[k] = isHex(c[k]) ? c[k].toUpperCase() : d.colors[k]
  const buttons = {}
  for (const k of BUTTON_COLOR_KEYS) buttons[k] = isHex(b[k]) ? b[k].toUpperCase() : d.buttons[k]
  buttons.shape = b.shape in SHAPES ? b.shape : d.buttons.shape
  return { colors, buttons }
}

const triplet = (h) => `${parseInt(h.slice(1, 3), 16)} ${parseInt(h.slice(3, 5), 16)} ${parseInt(h.slice(5, 7), 16)}`

/** CSS custom properties for a theme (colour tokens are "r g b" so Tailwind opacity modifiers keep working). */
export function themeVars(theme) {
  const { colors: c, buttons: b } = mergeTheme(theme)
  return {
    '--c-charcoal': triplet(c.ink),
    '--c-ivory': triplet(c.paper),
    '--c-cream': triplet(c.cream),
    '--c-gold': triplet(c.accent),
    '--c-deep': triplet(c.deep),
    '--c-dark': triplet(c.dark),
    '--c-glow': triplet(c.glow),
    '--c-card': triplet(c.card),
    '--c-ember': triplet(c.ember),
    '--btn-from': b.primaryFrom,
    '--btn-to': b.primaryTo,
    '--btn-text': b.primaryText,
    '--btn-dark-bg': b.darkBg,
    '--btn-dark-text': b.darkText,
    '--btn-radius': SHAPES[b.shape],
  }
}

export const themeCss = (theme) =>
  ':root{' +
  Object.entries(themeVars(theme))
    .map(([k, v]) => `${k}:${v};`)
    .join('') +
  '}'

/** WCAG contrast ratio between two #rrggbb colours. */
export function contrast(a, b) {
  const lum = (h) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const v = parseInt(h.slice(i, i + 2), 16) / 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
