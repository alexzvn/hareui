import { computed, nextTick, onBeforeUnmount, onWatcherCleanup, ref, shallowRef, watch } from 'vue'

import type { SheetAxis, SheetMotionOptions, SheetViewportMetrics } from './Sheet.types'
import {
  getScroll,
  nextFrame,
  restingSnapIndex,
  scrollProperty,
  scrollToPosition,
  sheetSnapPointTargets,
  waitForScrollSettle,
} from './sheetScroll'

/** The stage the sheet is laid out in, and the axis it moves along. */
type SheetMeasure = { stage: HTMLElement; axis: SheetAxis }

/** iOS Safari's collapsing toolbar: bottom sheets travel that much further to leave the screen. */
const IOS_TOOLBAR_PADDING = 'calc(100lvh - 100svh + 58px)'

const EMPTY_METRICS: SheetViewportMetrics = {
  scrollX: 0,
  scrollY: 0,
  width: 0,
  height: 0,
  pageWidth: 0,
  pageHeight: 0,
}

const isIOS = () =>
  typeof navigator !== 'undefined' &&
  (/iP(?:hone|ad|od)/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

/** Resolves a CSS length to pixels with a hidden probe element. */
const lengthToPx = (length: string) => {
  const probe = document.createElement('div')
  probe.style.cssText = `position: absolute; visibility: hidden; height: ${length}`
  document.body.append(probe)
  const px = probe.offsetHeight
  probe.remove()

  return px
}

const measureViewport = (): SheetViewportMetrics => {
  const page = document.scrollingElement ?? document.documentElement
  const viewport = window.visualViewport

  return {
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    width: viewport?.width ?? window.innerWidth,
    height: viewport?.height ?? window.innerHeight,
    pageWidth: page.scrollWidth,
    pageHeight: page.scrollHeight,
  }
}

/** Offset of `marker` from the start of the stage, through its offset parents (so transforms don't count). */
const offsetInStage = (marker: HTMLElement, { stage, axis }: SheetMeasure) => {
  let offset = 0
  let node: Element | null = marker
  while (node instanceof HTMLElement && node !== stage) {
    offset += axis === 'y' ? node.offsetTop : node.offsetLeft
    node = node.offsetParent
  }

  return offset
}

/** Clamped scroll travel in px: how far the farthest snap point reaches from the open position. */
const measureSnapTravel = (measure: SheetMeasure, isAfter: boolean) => {
  const { stage, axis } = measure
  const stageSize = axis === 'y' ? stage.offsetHeight : stage.offsetWidth
  const markers = [...stage.querySelectorAll<HTMLElement>('[data-sheet-detent]')]
  const travel = markers.reduce((farthest, marker) => {
    const offset = offsetInStage(marker, measure)
    const size = axis === 'y' ? marker.offsetHeight : marker.offsetWidth

    return Math.max(farthest, isAfter ? stageSize - offset : offset + size)
  }, 0)

  return Math.max(1, travel)
}

/**
 * The sheet's enter, exit and swipe lifecycle, ported from React Aria's `SheetOverlay`: opening mounts the overlay and
 * smooth-scrolls the sheet into view (to the requested snap point), closing scrolls it out before unmounting, and an
 * IntersectionObserver on the dialog tracks whether it is visible or fully expanded.
 *
 * Invariants:
 * - `isMounted` turns on with `open`, and off once the sheet left the viewport (right away when it already has).
 *   Reopening during the exit scrolls it back.
 * - The lifecycle runs enter → after:enter on open and leave → after:leave on close, in that order.
 * - The open sheet scrolled fully out of view calls `onSwipeAway`; if it is still open on the next tick (a controlled
 *   parent kept it), it scrolls back.
 * - When the clamp (not dismissible, at rest) moves the stage, the scroll position compensates, so the sheet stays
 *   where it is on screen.
 * - `onSnapPointChange` runs only when a scroll settles at a snap point other than the one the sheet last rested at
 *   or was sent to, so opening and setting `snapPoint` never echo back.
 *
 * Must be called in `setup`.
 */
export const useSheetMotion = (options: SheetMotionOptions) => {
  const isMounted = ref(options.open.value)
  const isEntering = ref(false)
  const isExiting = ref(false)
  const isExpanded = ref(false)
  const snapTravel = ref(1)
  const metrics = shallowRef(EMPTY_METRICS)

  const isTransitioning = computed(() => !options.open.value || isEntering.value || isExiting.value)

  const isClamped = computed(() => !options.dismissible() && !isTransitioning.value)

  const viewportPadding = computed(() => {
    const { axis, after } = options.config.value

    return axis === 'y' && after && isIOS() ? IOS_TOOLBAR_PADDING : '0px'
  })

  const paddingPx = () => (viewportPadding.value === '0px' ? 0 : lengthToPx(viewportPadding.value))
  const viewportPx = () =>
    options.config.value.axis === 'x' ? window.innerWidth : window.innerHeight + paddingPx()

  // Bumped by every enter and exit, so a superseded one stops at its next step.
  let run = 0
  let isVisible = false
  let hasEntered = false
  let resolveHidden: (() => void) | undefined

  // The snap point the sheet rests at or is heading to.
  let restIndex = 0
  let isSettling = false

  const snapTargets = (scroller: HTMLElement) =>
    sheetSnapPointTargets(scroller, options.config.value)

  /** Scrolls to the requested snap point; returns `false` when the sheet has no snap points. */
  const scrollToSnapPoint = (scroller: HTMLElement) => {
    const targets = snapTargets(scroller)
    if (targets.length < 2) return false

    const index = Math.min(Math.max(options.snapPoint() ?? 0, 0), targets.length - 1)
    const position = targets[index]
    if (position === undefined) return false

    restIndex = index
    scrollToPosition(scroller, { axis: options.config.value.axis, position, smooth: true })

    return true
  }

  const scrollToRest = (scroller: HTMLElement) => {
    if (scrollToSnapPoint(scroller)) return

    const { axis, enteredScroll } = options.config.value
    scrollToPosition(scroller, { axis, position: enteredScroll * viewportPx(), smooth: true })
  }

  const enter = async (scroller: HTMLElement) => {
    const token = ++run
    isExiting.value = false
    isEntering.value = true
    options.lifecycle.onEnter()

    // Top and left sheets rest at scroll 0 and start at the far end: scroll from the next frame.
    if (options.config.value.enteredScroll === 0) await nextFrame()
    if (token !== run) return

    scrollToRest(scroller)
    await waitForScrollSettle(scroller, options.config.value.axis)
    if (token !== run) return

    isEntering.value = false
    options.lifecycle.onAfterEnter()
  }

  const exit = async () => {
    const token = ++run
    isEntering.value = false
    isExiting.value = true
    options.lifecycle.onLeave()

    const scroller = options.scroller.value
    if (scroller && isVisible) {
      // Let the unclamped geometry render first, so the sheet has room to leave.
      await nextTick()
      if (token !== run) return

      const hidden = new Promise<void>((resolve) => {
        resolveHidden = resolve
      })

      const { axis, after } = options.config.value
      scrollToPosition(scroller, { axis, position: after ? 0 : viewportPx(), smooth: true })
      await Promise.race([hidden, waitForScrollSettle(scroller, axis)])
      if (token !== run) return
    }

    resolveHidden = undefined
    isExiting.value = false
    isMounted.value = false
    await options.lifecycle.onAfterLeave()
  }

  watch(
    options.open,
    (open) => {
      if (!open) {
        if (isMounted.value) void exit()
        return
      }

      const scroller = options.scroller.value
      if (isMounted.value && scroller) {
        void enter(scroller)
        return
      }

      metrics.value = measureViewport()
      isMounted.value = true
    },
    { flush: 'sync' },
  )

  const onIntersect = (scroller: HTMLElement, entries: IntersectionObserverEntry[]) => {
    const ratio = entries.at(-1)?.intersectionRatio
    if (ratio === undefined) return

    isExpanded.value = ratio >= 1
    isVisible = ratio > 0
    hasEntered ||= isVisible
    if (isVisible || !hasEntered) return

    resolveHidden?.()
    if (!options.open.value) return

    options.onSwipeAway()

    // A controlled parent that keeps the sheet open gets it back.
    void nextTick(() => {
      if (options.open.value && !isExiting.value) scrollToRest(scroller)
    })
  }

  const reportSnapPoint = (scroller: HTMLElement) => {
    const isResting =
      scroller.isConnected &&
      options.open.value &&
      !isExiting.value &&
      !scroller.hasAttribute('data-handle-dragging')

    if (!isResting) return

    const { axis } = options.config.value
    const index = restingSnapIndex(snapTargets(scroller), getScroll(scroller, axis))
    if (index < 0 || index === restIndex) return

    restIndex = index
    options.onSnapPointChange(index)
  }

  // A swipe or a handle glide reports where it settles; positions between snap points report nothing.
  const onScroll = async (scroller: HTMLElement) => {
    if (isSettling || !scroller.querySelector('[data-sheet-detent]')) return

    isSettling = true
    await waitForScrollSettle(scroller, options.config.value.axis)
    isSettling = false
    reportSnapPoint(scroller)
  }

  const updateSnapTravel = () => {
    const stage = options.stage.value
    if (!stage) return

    const { axis, after } = options.config.value
    snapTravel.value = measureSnapTravel({ stage, axis }, after)
  }

  const onViewportResize = () => {
    metrics.value = measureViewport()
  }

  /** Observes the mounted overlay: the dialog's visibility, its size and the viewport's. Returns the cleanup. */
  const observe = (scroller: HTMLElement) => {
    const intersection = new IntersectionObserver((entries) => onIntersect(scroller, entries), {
      threshold: [0, 1],
      rootMargin: `0px 0px ${paddingPx()}px 0px`,
    })

    const resize = new ResizeObserver(updateSnapTravel)
    const dialog = options.dialog()
    if (dialog) {
      intersection.observe(dialog)
      resize.observe(dialog)
    }

    if (options.stage.value) resize.observe(options.stage.value)
    const onScrollEvent = () => void onScroll(scroller)
    scroller.addEventListener('scroll', onScrollEvent, { passive: true })
    window.addEventListener('resize', onViewportResize)
    window.visualViewport?.addEventListener('resize', onViewportResize)

    return () => {
      intersection.disconnect()
      resize.disconnect()
      scroller.removeEventListener('scroll', onScrollEvent)
      window.removeEventListener('resize', onViewportResize)
      window.visualViewport?.removeEventListener('resize', onViewportResize)
    }
  }

  // The overlay mounted: start from the closed position, observe the sheet, then enter.
  watch(
    options.scroller,
    (scroller) => {
      if (!scroller) return

      const { axis, enteredScroll } = options.config.value
      if (enteredScroll === 0) scroller[scrollProperty(axis)] = viewportPx()
      if (!metrics.value.width) metrics.value = measureViewport()

      isVisible = false
      hasEntered = false
      onWatcherCleanup(observe(scroller))
      if (options.open.value) void enter(scroller)
    },
    { flush: 'post' },
  )

  // Setting `snapPoint` while the sheet is open scrolls it there; a closed sheet opens there.
  watch(options.snapPoint, (index) => {
    const scroller = options.scroller.value
    if (index === undefined || index === restIndex || !scroller) return
    if (!options.open.value || isExiting.value) return

    scrollToSnapPoint(scroller)
  })

  const stageOffset = () => {
    const stage = options.stage.value
    if (!stage) return null

    return options.config.value.axis === 'y' ? stage.offsetTop : stage.offsetLeft
  }

  let offsetBeforeClamp: number | null = null

  // When the clamp moves the stage, the scroll position shifts by as much, so the sheet stays put on screen: read the
  // stage offset before the DOM update and compensate after it.
  watch(
    isClamped,
    () => {
      offsetBeforeClamp = stageOffset()
    },
    { flush: 'pre' },
  )

  watch(
    isClamped,
    () => {
      const before = offsetBeforeClamp
      const offset = stageOffset()
      const scroller = options.scroller.value
      offsetBeforeClamp = null
      if (before === null || offset === null || !scroller) return

      const { axis } = options.config.value
      scroller[scrollProperty(axis)] = getScroll(scroller, axis) + offset - before
    },
    { flush: 'post' },
  )

  onBeforeUnmount(() => {
    run++
  })

  return {
    isMounted,
    isEntering,
    isExiting,
    isExpanded,
    isTransitioning,
    isClamped,
    snapTravel,
    metrics,
    viewportPadding,
  }
}
