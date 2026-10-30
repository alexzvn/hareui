import type { Ref, ShallowRef } from 'vue'
import { onBeforeUnmount, onMounted, watch } from 'vue'

import type { HeaderProps } from './Header.types'

export type UseHeaderHideOnScrollOptions = {
  /** The header root (a `Primitive` component instance). */
  root: Readonly<ShallowRef<{ $el: HTMLElement } | null>>
  /** Whether the menu is open. The bar stays while it is. */
  open: Ref<boolean>
  /** The `hidden` model, written as the bar hides and reveals. */
  hidden: Ref<boolean>
  /** The `hideOnScroll` prop. */
  isEnabled: () => boolean
  /** The `scrollTarget` prop. */
  scrollTarget: () => HeaderProps['scrollTarget']
}

const scrollableOverflows = new Set(['auto', 'scroll', 'overlay'])

// The nearest scrollable ancestor: that is what a sticky bar sticks to.
const getScrollableAncestor = (el: HTMLElement | null | undefined): HTMLElement | Window => {
  for (
    let parent = el?.parentElement;
    parent && parent !== document.body && parent !== document.documentElement;
    parent = parent.parentElement
  ) {
    if (scrollableOverflows.has(getComputedStyle(parent).overflowY)) return parent
  }

  return window
}

const getScrollTop = (scroller: HTMLElement | Window) => {
  const top = scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop

  return Math.max(0, top)
}

/** Hides the bar while scrolling down and reveals it when scrolling up (`hideOnScroll`). */
export const useHeaderHideOnScroll = (options: UseHeaderHideOnScrollOptions) => {
  const { root, open, hidden, isEnabled, scrollTarget } = options

  let scroller: HTMLElement | Window | null = null
  let lastY = 0
  let frame = 0
  let isScheduled = false

  const resolveScroller = (): HTMLElement | Window => {
    const target = scrollTarget()
    if (typeof target === 'string') return document.querySelector<HTMLElement>(target) ?? window
    if (target) return target

    return getScrollableAncestor(root.value?.$el)
  }

  const update = () => {
    isScheduled = false

    const y = getScrollTop(scroller as HTMLElement | Window)
    const delta = y - lastY
    lastY = y

    // Keep the bar while the menu is open, and whenever the page sits within its own height of the top.
    const isPinned = open.value || y <= (root.value?.$el?.offsetHeight ?? 0)
    if (isPinned) {
      hidden.value = false
      return
    }

    if (delta !== 0) hidden.value = delta > 0
  }

  const onScroll = () => {
    if (isScheduled) return
    isScheduled = true

    frame = requestAnimationFrame(update)
  }

  const stopTracking = () => {
    scroller?.removeEventListener('scroll', onScroll)
    scroller = null
    if (!isScheduled) return

    cancelAnimationFrame(frame)
    isScheduled = false
  }

  const startTracking = () => {
    stopTracking()

    scroller = resolveScroller()
    lastY = getScrollTop(scroller)
    scroller.addEventListener('scroll', onScroll, { passive: true })
  }

  onMounted(() => {
    if (isEnabled()) startTracking()
  })

  onBeforeUnmount(stopTracking)

  watch(open, (isOpen) => {
    if (isOpen) hidden.value = false
  })

  watch(
    () => [isEnabled(), scrollTarget()] as const,
    ([isNowEnabled]) => {
      if (isNowEnabled) {
        startTracking()
        return
      }

      stopTracking()
      hidden.value = false
    },
  )

  // A bar that holds the keyboard focus must not slide away.
  const onFocusIn = () => {
    if (hidden.value) hidden.value = false
  }

  return { onFocusIn }
}
