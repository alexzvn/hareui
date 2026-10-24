// Port of HeroUI docs `themes/hooks/use-custom-fonts.ts`: custom fonts imported by URL, kept in localStorage.
import { readonly, ref } from 'vue'

import { extractFontFamilyFromUrl } from '../utils/font-utils'

export interface CustomFont {
  id: string
  label: string
  url: string
  variable: string
  fontFamily: string
}

const STORAGE_KEY = 'theme-builder-custom-fonts'

function read(): CustomFont[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as CustomFont[]) : []
  } catch {
    return []
  }
}

// Empty during SSR; filled on the client so server and first client render agree.
const customFonts = ref<CustomFont[]>([])
let loaded = false

function save(fonts: CustomFont[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fonts))
    customFonts.value = fonts
  } catch {
    // Storage unavailable (private mode, quota): keep the previous list.
  }
}

function generateFontId(fontFamily: string, existing: CustomFont[]) {
  const baseId = `custom-${fontFamily.toLowerCase().replace(/\s+/g, '-')}`
  const ids = new Set(existing.map((f) => f.id))
  if (!ids.has(baseId)) return baseId
  let counter = 2
  while (ids.has(`${baseId}-${counter}`)) counter++
  return `${baseId}-${counter}`
}

export type AddCustomFontResult =
  | { font: CustomFont }
  | { error: 'cannot-detect-family' }
  | { error: 'already-imported'; label: string }

export function useCustomFonts() {
  if (!loaded && typeof window !== 'undefined') {
    loaded = true
    customFonts.value = read()
    // Other tabs.
    window.addEventListener('storage', (e) => e.key === STORAGE_KEY && (customFonts.value = read()))
  }

  const addCustomFont = (url: string, customLabel?: string): AddCustomFontResult => {
    const current = read()
    const extracted = extractFontFamilyFromUrl(url)
    if (!extracted && !customLabel) return { error: 'cannot-detect-family' }
    const fontFamily = customLabel || extracted || 'Custom Font'
    const existing = current.find((f) => f.url === url)
    if (existing) return { error: 'already-imported', label: existing.label }
    const id = generateFontId(fontFamily, current)
    const font: CustomFont = { fontFamily, id, label: fontFamily, url, variable: `--font-${id}` }
    save([...current, font])
    return { font }
  }

  const removeCustomFont = (id: string) => save(read().filter((f) => f.id !== id))
  const getCustomFont = (id: string) => read().find((f) => f.id === id)
  const isCustomFont = (id: string) => read().some((f) => f.id === id)

  return {
    addCustomFont,
    customFonts: readonly(customFonts),
    getCustomFont,
    isCustomFont,
    removeCustomFont,
  }
}
