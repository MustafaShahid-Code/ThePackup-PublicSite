import type { PackKind } from '../components/Packaging'
import categoriesJson from '../../shared/defaults/categories.json'
import whyJson from '../../shared/defaults/why.json'

export interface Category {
  slug: string
  title: string
  short: string
  description: string
  kind: PackKind
  merchantId: string
  tone: 'ivory' | 'beige' | 'charcoal' | 'kraft'
  customisation: string[]
  applications: string[]
  /** Optional real photograph. Drop an image in /public/images and set e.g. '/images/pizza.jpg'. */
  image?: string
}

/** The six restaurant-focused categories shown on Home and Solutions (defaults live in shared/defaults/categories.json). */
export const categories = categoriesJson as Category[]

export const alsoAvailable = [
  { title: 'Bakery & Confectionery', text: 'Window boxes, pastry trays and gift packaging.', category: 'Bakery & Confectionery' },
  { title: 'Corrugated & Carton', text: 'Shipping cartons and heavy-duty corrugated boxes.', category: 'Corrugated & Carton' },
  { title: 'Retail & Custom', text: 'Premium product boxes and retail packaging.', category: 'Retail & Custom' },
  { title: 'Custom-Branded', text: 'Fully bespoke packaging for any brand.', category: 'Custom-Branded' },
]

export interface WhyItem {
  title: string
  text: string
}
export const whyItems = whyJson as WhyItem[]

export const enquiryCategories = [
  'Pizza Boxes',
  'Burger, Sandwich & Fries',
  'Lunch & Meal Boxes',
  'Takeaway Containers',
  'Paper Bags & Cups',
  'Eco-Friendly Food Packaging',
  'Bakery & Confectionery',
  'Corrugated & Carton',
  'Retail & Custom',
  'Custom-Branded',
  'Not sure yet',
]
