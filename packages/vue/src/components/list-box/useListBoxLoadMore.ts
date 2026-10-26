// Internal: RAC `ListBoxLoadMoreItem`: asks for the next page while the sentinel after the last item is in view.
import type { ShallowRef } from 'vue'
import { onBeforeUnmount, ref, watch } from 'vue'

type ListBoxLoadMoreOptions = {
  sentinel: Readonly<ShallowRef<HTMLElement | null>>
  loading: () => boolean | undefined
  /** Number of loaded items; a new page re-checks the sentinel. */
  itemCount: () => number | undefined
  onLoadMore: () => void
}

export const useListBoxLoadMore = ({
  sentinel,
  loading,
  itemCount,
  onLoadMore,
}: ListBoxLoadMoreOptions) => {
  const isSentinelVisible = ref(false)
  let observer: IntersectionObserver | undefined

  // Observed against the nearest scroll container (IntersectionObserver clips by ancestors)
  watch(sentinel, (el) => {
    observer?.disconnect()
    if (!el) return

    observer = new IntersectionObserver(([entry]) => {
      isSentinelVisible.value = !!entry?.isIntersecting
    })

    observer.observe(el)
  })

  onBeforeUnmount(() => observer?.disconnect())

  // Re-check after each page arrives: the sentinel may still be in view
  watch([isSentinelVisible, loading, itemCount], () => {
    if (isSentinelVisible.value && loading() === false) onLoadMore()
  })
}
