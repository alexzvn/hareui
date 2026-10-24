import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, watch } from 'vue'

type ElementRef = Readonly<Ref<HTMLElement | null | undefined>>

export type UseTableLoadMoreOptions = {
  hasMore: () => boolean
  loading: () => boolean
  rowCount: () => number
  /** The zero-height row after the last one. */
  sentinel: ElementRef
  /** The scroll container the sentinel scrolls into view within. */
  root: ElementRef
  onLoadMore: () => void
}

/**
 * Infinite scroll, like React Aria's `useLoadMoreSentinel`: asks for the next page whenever the
 * sentinel row is in view, more rows exist and none are loading.
 */
export const useTableLoadMore = (options: UseTableLoadMoreOptions) => {
  const { hasMore, loading, rowCount, sentinel, root, onLoadMore } = options
  let observer: IntersectionObserver | undefined

  // The state the sentinel was last observed in: the same state is never re-observed, so the
  // watch below can fire several times per tick (e.g. on mount) without asking twice.
  let observedState: unknown[] = []

  const observeSentinel = () => {
    const state = [hasMore(), loading(), rowCount(), sentinel.value]
    const isObserved = state.every((value, i) => value === observedState[i])
    if (isObserved) return

    observedState = state
    observer?.disconnect()

    const el = sentinel.value
    if (!hasMore() || !el) return

    observer = new IntersectionObserver(
      (entries) => {
        const isInView = entries[0]?.isIntersecting
        if (isInView && !loading()) onLoadMore()
      },
      { root: root.value ?? null },
    )

    observer.observe(el)
  }

  // Re-observing delivers a fresh initial entry, so a sentinel that stays in view after a page
  // loads (short pages, tall container) asks for the next one.
  watch([hasMore, loading, rowCount, sentinel], () => nextTick(observeSentinel), {
    immediate: true,
  })

  onBeforeUnmount(() => observer?.disconnect())
}
