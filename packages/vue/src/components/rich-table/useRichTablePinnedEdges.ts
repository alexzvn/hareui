import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, shallowReactive } from 'vue'

type UseRichTablePinnedEdgesOptions = {
  getScrollElement: () => HTMLElement | undefined
  getTableElement: () => HTMLTableElement | null
  /** Whether an external element owns the scroll: the root doesn't scroll, so nothing is tracked. */
  isExternalScroll: Ref<boolean>
}

// Sub-pixel tolerance, so fractional scroll offsets at either end don't count as scrolled.
const SCROLL_TOLERANCE = 0.5

/**
 * Whether content is scrolled under the columns pinned to each side: only then is their facing edge
 * outlined. Tracks the root's scroll position and size.
 */
export const useRichTablePinnedEdges = (options: UseRichTablePinnedEdgesOptions) => {
  const detached = shallowReactive({ left: false, right: false })
  let scrollElement: HTMLElement | undefined
  let resizeObserver: ResizeObserver | undefined

  const updateDetached = () => {
    if (!scrollElement) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollElement
    const range = scrollWidth - clientWidth
    const isRtl = getComputedStyle(scrollElement).direction === 'rtl'

    // RTL scrolls from 0 (start, right edge) to -range (left edge).
    const fromLeft = isRtl ? scrollLeft + range : scrollLeft

    detached.left = fromLeft > SCROLL_TOLERANCE
    detached.right = fromLeft < range - SCROLL_TOLERANCE
  }

  const observeResizes = (element: HTMLElement) => {
    if (typeof ResizeObserver === 'undefined') return

    resizeObserver = new ResizeObserver(updateDetached)
    resizeObserver.observe(element)

    const table = options.getTableElement()
    if (table) resizeObserver.observe(table)
  }

  onMounted(() => {
    scrollElement = options.getScrollElement()
    if (!scrollElement || options.isExternalScroll.value) return

    scrollElement.addEventListener('scroll', updateDetached, { passive: true })
    observeResizes(scrollElement)
    updateDetached()
  })

  onBeforeUnmount(() => {
    scrollElement?.removeEventListener('scroll', updateDetached)
    resizeObserver?.disconnect()
  })

  return detached
}
