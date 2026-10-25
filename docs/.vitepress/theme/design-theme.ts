// Port of HeroUI docs `utils/design-theme.ts` + theme ids/values from `app/[lang]/themes/{constants,theme-values}.ts`.
// Storage keys and <html> attributes are kept identical so `theme-presets.css` and HareUI's vibrant rules apply.

export const DESIGN_THEME_IDS = [
  'default',
  'sky',
  'lavender',
  'mint',
  'netflix',
  'uber',
  'spotify',
  'coinbase',
  'airbnb',
  'discord',
  'rabbit',
  'kumo',
] as const

export type DesignThemeId = (typeof DESIGN_THEME_IDS)[number]

const DEFAULT_DESIGN_THEME: DesignThemeId = 'default'
const DESIGN_THEME_STORAGE_KEY = 'heroui-docs-design-theme'
export const DESIGN_THEME_CHANGE_EVENT = 'heroui-docs-design-theme-change'
const VIBRANT_STORAGE_KEY = 'heroui-docs-vibrant-palette'

/** Accent base values per preset; used for the "Edit theme" link query like HeroUI's `themeValuesById`. */
export const DESIGN_THEME_VALUES: Record<
  DesignThemeId,
  { lightness: number; chroma: number; hue: number }
> = {
  default: { lightness: 0.6204, chroma: 0.195, hue: 253.83 },
  sky: { lightness: 0.78, chroma: 0.16, hue: 225 },
  lavender: { lightness: 0.77, chroma: 0.13, hue: 305 },
  mint: { lightness: 0.82, chroma: 0.12, hue: 155 },
  netflix: { lightness: 0.5814, chroma: 0.2349, hue: 27.99 },
  uber: { lightness: 0, chroma: 0, hue: 0 },
  spotify: { lightness: 0.7697, chroma: 0.2124, hue: 148.67 },
  coinbase: { lightness: 0.5282, chroma: 0.2628, hue: 262.87 },
  airbnb: { lightness: 0.6579, chroma: 0.2309, hue: 17.07 },
  discord: { lightness: 0.5774, chroma: 0.2091, hue: 273.85 },
  rabbit: { lightness: 0.6678, chroma: 0.2232, hue: 36.66 },
  kumo: { lightness: 0.5772, chroma: 0.2324, hue: 260 },
}

const isDesignThemeId = (value: string | null | undefined): value is DesignThemeId => {
  return (DESIGN_THEME_IDS as readonly string[]).includes(value ?? '')
}

export const getStoredDesignTheme = (): DesignThemeId => {
  const stored = localStorage.getItem(DESIGN_THEME_STORAGE_KEY)
  return isDesignThemeId(stored) ? stored : DEFAULT_DESIGN_THEME
}

export const getStoredVibrantPalette = (): boolean => {
  return localStorage.getItem(VIBRANT_STORAGE_KEY) === 'true'
}

const notifyDesignThemeChange = (themeId: DesignThemeId) => {
  window.dispatchEvent(new CustomEvent(DESIGN_THEME_CHANGE_EVENT, { detail: { themeId } }))
}

/** Sets `name` on `<html>`, or removes it when `value` is `null`. */
const setRootAttribute = (name: string, value: string | null) => {
  const root = document.documentElement
  if (value === null) {
    root.removeAttribute(name)
    return
  }

  root.setAttribute(name, value)
}

export const setStoredDesignTheme = (themeId: DesignThemeId) => {
  localStorage.setItem(DESIGN_THEME_STORAGE_KEY, themeId)
  setRootAttribute('data-design-theme', themeId === DEFAULT_DESIGN_THEME ? null : themeId)
  notifyDesignThemeChange(themeId)
}

export const setStoredVibrantPalette = (enabled: boolean) => {
  localStorage.setItem(VIBRANT_STORAGE_KEY, String(enabled))
  setRootAttribute('data-vibrant-palette', enabled ? 'true' : null)
  notifyDesignThemeChange(getStoredDesignTheme())
}
