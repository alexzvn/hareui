import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, watch } from 'vue'

export type UseMenuAutoCloseOptions = {
  /** Whether the menu is open. Set to `false` to close it. */
  open: Ref<boolean>
  /** The `autoClose` prop. */
  isEnabled: () => boolean
  /** The current vue-router path, when vue-router is installed. */
  routePath: () => string | undefined
}

/** Closes the menu when a link inside it is clicked or the page navigates (`autoClose`). */
export const useMenuAutoClose = (options: UseMenuAutoCloseOptions) => {
  const { open, isEnabled, routePath } = options

  const closeOnNavigation = () => {
    if (isEnabled()) open.value = false
  }

  const onMenuClick = (event: MouseEvent) => {
    if (!isEnabled()) return

    const isLinkClick = (event.target as HTMLElement).closest('a[href]') !== null
    if (isLinkClick) open.value = false
  }

  watch(routePath, closeOnNavigation)

  onMounted(() => {
    window.addEventListener('popstate', closeOnNavigation)
    window.addEventListener('hashchange', closeOnNavigation)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('popstate', closeOnNavigation)
    window.removeEventListener('hashchange', closeOnNavigation)
  })

  return { onMenuClick }
}
