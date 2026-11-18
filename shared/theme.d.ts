export interface Theme {
  colors: Record<'ink' | 'paper' | 'cream' | 'accent' | 'deep' | 'dark' | 'glow' | 'card' | 'ember', string>
  buttons: { primaryFrom: string; primaryTo: string; primaryText: string; darkBg: string; darkText: string; shape: 'pill' | 'rounded' | 'square' }
}
export const THEME_DEFAULTS: Theme
export const COLOR_KEYS: string[]
export const BUTTON_COLOR_KEYS: string[]
export const SHAPES: Record<string, string>
export const PRESETS: { id: string; name: string; theme: Theme }[]
export function isHex(v: unknown): v is string
export function mergeTheme(input?: unknown): Theme
export function themeVars(theme?: unknown): Record<string, string>
export function themeCss(theme?: unknown): string
export function contrast(a: string, b: string): number
