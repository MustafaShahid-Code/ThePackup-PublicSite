/**
 * SAMPLE MERCHANTS — fictional brands used only to demonstrate how The Pack Up
 * can brand the same packaging for different restaurants. Replace or extend
 * with real client brands (with their permission) when available.
 */
export type Pattern = 'checker' | 'stripe' | 'dots' | 'rays' | 'plain'

export interface Merchant {
  id: string
  name: string
  tagline: string
  cuisine: string
  bg: string
  ink: string
  accent: string
  pattern: Pattern
}

export const merchants: Merchant[] = [
  {
    id: 'casa-rosso',
    name: 'Casa Rosso',
    tagline: 'Wood-fired pizza',
    cuisine: 'Neapolitan pizzeria',
    bg: '#6B1523',
    ink: '#F8EEDC',
    accent: '#D9B877',
    pattern: 'checker',
  },
  {
    id: 'slice-society',
    name: 'Slice Society',
    tagline: 'Late-night slices',
    cuisine: 'Cloud kitchen',
    bg: '#16110E',
    ink: '#F8F3EA',
    accent: '#C6A56A',
    pattern: 'stripe',
  },
  {
    id: 'oven-lane',
    name: 'Oven Lane',
    tagline: 'Stone-baked daily',
    cuisine: 'Neighbourhood bakery-pizzeria',
    bg: '#14382B',
    ink: '#F3E9D2',
    accent: '#D8B26A',
    pattern: 'dots',
  },
  {
    id: 'crust-ember',
    name: 'Crust & Ember',
    tagline: 'Fired to order',
    cuisine: 'Delivery-first pizza',
    bg: '#E9DCC2',
    ink: '#2A1A12',
    accent: '#A8431F',
    pattern: 'rays',
  },
  {
    id: 'dough-theory',
    name: 'Dough Theory',
    tagline: 'Slow-fermented',
    cuisine: 'Premium pizza concept',
    bg: '#F6F1E6',
    ink: '#16110E',
    accent: '#B3623A',
    pattern: 'plain',
  },
]

export const getMerchant = (id: string): Merchant =>
  merchants.find((m) => m.id === id) ?? merchants[0]

/** Relative luminance (0–1) of a #rrggbb colour. */
export function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
