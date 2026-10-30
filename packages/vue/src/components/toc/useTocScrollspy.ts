import type { MaybeRefOrGetter } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, shallowReactive, toValue, watch } from 'vue'

import { getScrollParent } from '@/utils/scrollParent'

// How long scrolling must pause before a pinned link lets the scroll position decide again.
const SETTLE_DELAY = 150

/**
 * Watches the elements with the given ids and reports the ones inside the viewport (after clipping by scrolling
 * ancestors). When none is in view, the last ones stay active, so the link of the section being read stays marked
 * between two headings. `pin(id)` marks one link right away and holds it while the scroll it started settles, so a
 * heading the page can't scroll to the top still ends up marked. `isAtEnd` tells when the headings' scroll container
 * has reached its end, where the last headings in view can no longer reach the top.
 */
export const useTocScrollspy = (ids: MaybeRefOrGetter<string[]>) => {
  const state = shallowReactive({
    visible: [] as string[],
    active: [] as string[],
    isAtEnd: false,
  })

  let observer: IntersectionObserver | undefined
  let settleTimer: ReturnType<typeof setTimeout> | undefined
  let scroller: Element | undefined

  const isPinned = () => settleTimer !== undefined

  // A container that fits its content never scrolls, so it never counts as scrolled to its end.
  const updateIsAtEnd = () => {
    if (!scroller) {
      state.isAtEnd = false
      return
    }

    const { scrollTop, clientHeight, scrollHeight } = scroller
    state.isAtEnd = scrollTop > 0 && Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1
  }

  const unpin = () => {
    clearTimeout(settleTimer)
    settleTimer = undefined
    window.removeEventListener('scroll', waitForSettle, true)
  }

  // Each scroll event (of the page or any scrolling ancestor) pushes the release back until scrolling stops.
  const waitForSettle = () => {
    clearTimeout(settleTimer)
    settleTimer = setTimeout(unpin, SETTLE_DELAY)
  }

  const pin = (id: string) => {
    state.active = [id]
    if (!isPinned()) window.addEventListener('scroll', waitForSettle, true)

    waitForSettle()
  }

  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    const visible = new Set(state.visible)

    for (const entry of entries) {
      const { id } = entry.target
      if (!id) continue

      if (entry.isIntersecting) {
        visible.add(id)
        continue
      }

      visible.delete(id)
    }

    const isChanged =
      visible.size !== state.visible.length || state.visible.some((id) => !visible.has(id))

    if (!isChanged) return

    state.visible = [...visible]
    if (state.visible.length > 0 && !isPinned()) state.active = state.visible
  }

  const observe = () => {
    if (!observer) return

    // Drop the previous targets and their active links: the headings of other links (another page)
    // must neither accumulate observers nor stay marked.
    observer.disconnect()
    unpin()
    state.visible = []
    state.active = []

    const headings = toValue(ids)
      .map((id) => document.getElementById(id))
      .filter((heading) => heading !== null)

    for (const heading of headings) observer.observe(heading)

    const lastHeading = headings.at(-1)
    scroller = lastHeading
      ? (getScrollParent(lastHeading.parentElement) ?? document.scrollingElement ?? undefined)
      : undefined

    updateIsAtEnd()
  }

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') return

    observer = new IntersectionObserver(onIntersect)
    window.addEventListener('scroll', updateIsAtEnd, { capture: true, passive: true })
    observe()
  })

  // The headings of new links render with them, so observe once the DOM has caught up.
  watch(
    () => toValue(ids).join('\0'),
    () => nextTick(observe),
  )

  onBeforeUnmount(() => {
    observer?.disconnect()
    window.removeEventListener('scroll', updateIsAtEnd, { capture: true })
    unpin()
  })

  return { state, pin }
}
