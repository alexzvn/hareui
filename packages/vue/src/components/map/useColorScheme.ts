import type { ShallowRef } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * The color scheme the theme tokens resolve to on `element`, as a `.dark` or `[data-theme]` scope on it or an ancestor
 * sets it. A `light dark` scheme follows the system preference. Stays `light` until mounted. `themeVersion` counts the
 * changes that may have restyled the tokens (scheme, theme class or inline style on the way up).
 */
export const useColorScheme = (element: Readonly<ShallowRef<HTMLElement | null>>) => {
  const colorScheme = ref<'light' | 'dark'>('light')
  const themeVersion = ref(0)
  let observer: MutationObserver | undefined
  let darkQuery: MediaQueryList | undefined

  const read = () => {
    if (!element.value) return

    const schemes = getComputedStyle(element.value).getPropertyValue('color-scheme').split(' ')
    const isSystemDark = darkQuery?.matches === true
    const isDark = schemes.includes('dark') && (!schemes.includes('light') || isSystemDark)
    colorScheme.value = isDark ? 'dark' : 'light'
    themeVersion.value++
  }

  onMounted(() => {
    darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkQuery.addEventListener('change', read)
    read()
    observer = new MutationObserver(read)

    for (let node = element.value; node; node = node.parentElement) {
      observer.observe(node, {
        attributes: true,
        attributeFilter: ['class', 'data-theme', 'style'],
      })
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    darkQuery?.removeEventListener('change', read)
  })

  return { colorScheme, themeVersion }
}
