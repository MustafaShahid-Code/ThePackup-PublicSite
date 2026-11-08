import type { PackKind } from '../components/Packaging'
import workJson from '../../shared/defaults/work.json'

export type WorkFilter = 'All' | 'Pizza' | 'Burgers & Fries' | 'Meal Boxes' | 'Cups & Bags' | 'Bakery' | 'Eco'
export const workFilters: WorkFilter[] = ['All', 'Pizza', 'Burgers & Fries', 'Meal Boxes', 'Cups & Bags', 'Bakery', 'Eco']

export interface WorkItem {
  id: string
  title: string
  caption: string
  filter: Exclude<WorkFilter, 'All'>
  kind: PackKind
  merchantId: string
  finish?: 'branded' | 'kraft' | 'white' | 'black'
  tone: 'ivory' | 'beige' | 'charcoal' | 'kraft'
  /** Masonry height: tall / medium / short */
  size: 'tall' | 'mid' | 'short'
  /** Optional real photograph — replaces the illustration when set. */
  image?: string
}

/**
 * These are illustrated CONCEPTS using fictional sample merchants (defaults live in shared/defaults/work.json).
 * Manage them from the admin panel at /admin — upload a real photo per item to replace the illustration.
 */
export const work = workJson as WorkItem[]
