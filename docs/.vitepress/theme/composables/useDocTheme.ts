import { onMounted, readonly, ref, shallowRef } from 'vue'

/** `<html>` attributes the design presets (theme-presets.css, theme-kumo.css) and the vibrant palette key on. */
export const DESIGN_ATTRIBUTES = ['data-design-theme', 'data-vibrant-palette'] as const
export type DesignAttributes = Partial<Record<(typeof DESIGN_ATTRIBUTES)[number], string>>

export const readDesignAttributes = (root: Element): DesignAttributes => {
  const attributes: DesignAttributes = {}
  for (const name of DESIGN_ATTRIBUTES) {
    const value = root.getAttribute(name)
    if (value !== null) attributes[name] = value
  }
  return attributes
}

const dark = ref(false)
const design = shallowRef<DesignAttributes>({})
let observing = false

/**
 * The docs page's live theme: `html.dark` plus the design attributes. The docs ThemeToggle and the theme builder write
 * `<html>` directly, bypassing VitePress' `isDark`, so the DOM is the source of truth: one observer, shared by every
 * caller. It starts on mount, so hydration renders the SSR defaults (light, no preset).
 */
export const useDocTheme = () => {
  onMounted(() => {
    if (observing) return
    observing = true
    const root = document.documentElement
    const read = () => {
      dark.value = root.classList.contains('dark')
      const next = readDesignAttributes(root)
      if (DESIGN_ATTRIBUTES.some((name) => next[name] !== design.value[name])) design.value = next
    }
    read()
    new MutationObserver(read).observe(root, {
      attributes: true,
      attributeFilter: ['class', ...DESIGN_ATTRIBUTES],
    })
  })
  return { dark: readonly(dark), design: readonly(design) }
}
