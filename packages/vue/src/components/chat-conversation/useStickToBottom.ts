import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

// How close to the end (in px) still counts as "at the bottom", so sub-pixel rounding never breaks following
const BOTTOM_THRESHOLD = 4

type StickToBottomOptions = {
  /** The scroll viewport. */
  viewport: Ref<HTMLElement | null | undefined>
  /** The element that grows with the messages. */
  content: Ref<HTMLElement | null | undefined>
  /** Whether growing content is followed while the viewport sticks to the bottom. */
  shouldFollow: () => boolean
  /** Whether the viewport starts at the bottom. */
  shouldStartAtBottom: () => boolean
}

/**
 * Keeps a scroll viewport pinned to its end while content grows. The viewport sticks until the user scrolls up (wheel,
 * touch drag, scrollbar, keyboard) and sticks again once they reach the end or `scrollToBottom` runs.
 */
export const useStickToBottom = ({
  viewport,
  content,
  shouldFollow,
  shouldStartAtBottom,
}: StickToBottomOptions) => {
  const isAtBottom = ref(true)
  const hasOverflow = ref(false)

  // Not reactive: it changes on every scroll event and only steers the next resize
  let isSticky = shouldStartAtBottom()
  let lastScrollTop = 0
  let touchY: number | null = null
  let observer: ResizeObserver | undefined

  const measure = () => {
    const el = viewport.value

    if (!el) return

    const distance = el.scrollHeight - el.clientHeight - el.scrollTop

    hasOverflow.value = el.scrollHeight - el.clientHeight > BOTTOM_THRESHOLD
    isAtBottom.value = !hasOverflow.value || distance <= BOTTOM_THRESHOLD
  }

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    const el = viewport.value

    isSticky = true

    if (!el) return

    const top = el.scrollHeight - el.clientHeight

    if (typeof el.scrollTo === 'function') el.scrollTo({ top, behavior })
    if (typeof el.scrollTo !== 'function') el.scrollTop = top

    if (behavior !== 'smooth') lastScrollTop = el.scrollTop

    measure()
  }

  // Leaves the bottom on the user's intent, before the scroll event, so a streaming chunk can't pull them back
  const release = () => {
    isSticky = false
  }

  const onScroll = () => {
    const el = viewport.value

    if (!el) return

    const isScrollingUp = el.scrollTop < lastScrollTop - 1

    lastScrollTop = el.scrollTop
    measure()

    if (isAtBottom.value) isSticky = true
    if (!isAtBottom.value && isScrollingUp) isSticky = false
  }

  const onWheel = (event: WheelEvent) => {
    if (event.deltaY < 0) release()
  }

  const onTouchStart = (event: TouchEvent) => {
    touchY = event.touches[0]?.clientY ?? null
  }

  // A finger moving down drags the content down, which scrolls up
  const onTouchMove = (event: TouchEvent) => {
    const y = event.touches[0]?.clientY ?? null

    if (touchY !== null && y !== null && y > touchY) release()

    touchY = y
  }

  /** Re-measures after the content changed size, and follows it to the end while sticky. */
  const onResize = () => {
    if (isSticky && shouldFollow()) return scrollToBottom()

    measure()
  }

  onMounted(() => {
    if (isSticky) scrollToBottom()
    if (!isSticky) measure()

    if (typeof ResizeObserver === 'undefined') return

    observer = new ResizeObserver(onResize)

    if (viewport.value) observer.observe(viewport.value)
    if (content.value) observer.observe(content.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return {
    isAtBottom,
    hasOverflow,
    scrollToBottom,
    release,
    onResize,
    listeners: {
      scroll: onScroll,
      wheel: onWheel,
      touchstart: onTouchStart,
      touchmove: onTouchMove,
    },
  }
}
