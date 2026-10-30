import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'

import type { SidebarBreakpoint } from './Sidebar.types'

// The default Tailwind CSS breakpoints, in rem, so the query matches the `md:` (etc.) classes of the theme.
const breakpoints = {
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
  '2xl': 96,
} as const satisfies Record<SidebarBreakpoint, number>

/**
 * Whether the viewport is narrower than `breakpoint`. Stays `false` until mounted, so the server render and the
 * hydration pass agree on the desktop markup.
 */
export const useBelowBreakpoint = (breakpoint: MaybeRefOrGetter<SidebarBreakpoint>) => {
  const isBelow = ref(false)
  let query: MediaQueryList | undefined

  const sync = () => {
    isBelow.value = query ? !query.matches : false
  }

  const listen = () => {
    query?.removeEventListener('change', sync)
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    query = window.matchMedia(`(min-width: ${breakpoints[toValue(breakpoint)]}rem)`)
    query.addEventListener('change', sync)
    sync()
  }

  onMounted(listen)
  watch(() => toValue(breakpoint), listen)

  onBeforeUnmount(() => {
    query?.removeEventListener('change', sync)
    query = undefined
  })

  return isBelow
}
