import type { SheetAxis, SheetDismissInput, SheetSwipeConfig } from './Sheet.types'

// Scroll helpers of the sheet's handle drag and motion, ported from HeroUI's `sheet.utils.ts` and
// `use-sheet-handle-drag.ts`.

type SheetSnapAlign = 'start' | 'end'

/** Where a snap marker is measured from. */
type SheetSnapMeasure = { scroller: HTMLElement; axis: SheetAxis; align: SheetSnapAlign }

/** A programmatic scroll of the sheet's scroll container. */
type SheetScrollTarget = { axis: SheetAxis; position: number; smooth: boolean }

/** A handle release: the scroll position and the pointer velocity (px/ms). */
type SheetRelease = { current: number; velocity: number }

/** The glide of the scroll position after a handle release. */
type SheetGlide = { axis: SheetAxis; target: number; onDone: () => void }

/** A release glides with the sheet curve: 0.5s cubic-bezier(0.32, 0.72, 0, 1). */
const GLIDE_DURATION = 500

/** Pointer velocity (px/ms) of a flick. */
const FLICK_VELOCITY = 0.4

/** Share of the visible sheet a drag must cover to dismiss it. */
const DISMISS_FRACTION = 0.25

/** How close (px) the scroll position must be to a snap position to rest there; scroll positions can be fractional. */
const SNAP_TOLERANCE = 2

/** Scroll margin properties of a snap marker, by axis and snap alignment. */
const SCROLL_MARGIN = {
  y: { start: 'scrollMarginTop', end: 'scrollMarginBottom' },
  x: { start: 'scrollMarginLeft', end: 'scrollMarginRight' },
} as const

const bezier = (t: number, [p1, p2]: readonly [number, number]) =>
  3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3

/** The sheet curve, `cubic-bezier(0.32, 0.72, 0, 1)`. Its x curve is monotonic, so bisection finds `t`. */
const glideEasing = (x: number) => {
  let low = 0
  let high = 1
  let t = x
  for (let step = 0; step < 24; step++) {
    t = (low + high) / 2
    const isBelow = bezier(t, [0.32, 0]) < x
    low = isBelow ? t : low
    high = isBelow ? high : t
  }

  return bezier(t, [0.72, 1])
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })

/** The scroll offset property along `axis`. */
export const scrollProperty = (axis: SheetAxis) => (axis === 'y' ? 'scrollTop' : 'scrollLeft')

export const getScroll = (element: HTMLElement, axis: SheetAxis) => element[scrollProperty(axis)]

export const scrollToPosition = (element: HTMLElement, scroll: SheetScrollTarget) => {
  element.scrollTo({
    [scroll.axis === 'y' ? 'top' : 'left']: scroll.position,
    behavior: scroll.smooth && !prefersReducedMotion() ? 'smooth' : 'instant',
  })
}

/** Resolves once the scroll position stops changing (or on `scrollend`, where supported). */
export const waitForScrollSettle = (element: HTMLElement, axis: SheetAxis) =>
  new Promise<void>((resolve) => {
    let last = getScroll(element, axis)
    let stillFrames = 0
    let frame = 0

    const done = () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('scrollend', done)
      resolve()
    }

    const check = () => {
      const current = getScroll(element, axis)
      stillFrames = current === last ? stillFrames + 1 : 0
      last = current

      if (stillFrames >= 6) {
        done()
        return
      }

      frame = requestAnimationFrame(check)
    }

    element.addEventListener('scrollend', done)
    frame = requestAnimationFrame(check)
  })

/** The scroll position at which `marker` snaps with its `align` edge, including its scroll margin. */
const snapScrollPosition = (marker: HTMLElement, snap: SheetSnapMeasure) => {
  const { scroller, axis, align } = snap
  const isVertical = axis === 'y'
  const markerRect = marker.getBoundingClientRect()
  const scrollerRect = scroller.getBoundingClientRect()
  const start = isVertical ? markerRect.top - scrollerRect.top : markerRect.left - scrollerRect.left
  const offset = start + getScroll(scroller, axis)
  const margin = Number.parseFloat(getComputedStyle(marker)[SCROLL_MARGIN[axis][align]]) || 0
  if (align === 'start') return offset - margin

  const size = isVertical ? markerRect.height : markerRect.width
  const viewport = isVertical ? scroller.clientHeight : scroller.clientWidth

  return offset + size + margin - viewport
}

/** Scroll positions of every active snap marker (`[data-sheet-snap]`) in the scroller. */
export const sheetSnapTargets = (scroller: HTMLElement, axis: SheetAxis) =>
  [...scroller.querySelectorAll<HTMLElement>('[data-sheet-snap]')].flatMap((marker) => {
    const align = getComputedStyle(marker).scrollSnapAlign.split(' ')[0]
    if (!align || align === 'none') return []

    return [
      snapScrollPosition(marker, { scroller, axis, align: align === 'end' ? 'end' : 'start' }),
    ]
  })

/**
 * Scroll positions of the snap points in order, then of the fully expanded sheet. Detents snap with the edge the sheet
 * enters from; the expanded marker is the end marker of bottom/right sheets and the start marker of top/left ones.
 */
export const sheetSnapPointTargets = (scroller: HTMLElement, swipe: SheetSwipeConfig) => {
  const { axis, after } = swipe
  const detents = [...scroller.querySelectorAll<HTMLElement>('[data-sheet-detent]')]
  const expanded = scroller.querySelector<HTMLElement>('[data-sheet-expanded]')

  const positions = detents.map((marker) =>
    snapScrollPosition(marker, { scroller, axis, align: after ? 'start' : 'end' }),
  )

  if (!expanded) return positions

  return [
    ...positions,
    snapScrollPosition(expanded, { scroller, axis, align: after ? 'end' : 'start' }),
  ]
}

/** Index of the snap position the scroll position `current` rests at, or `-1` between them. */
export const restingSnapIndex = (targets: number[], current: number) =>
  targets.findIndex((target) => Math.abs(target - current) <= SNAP_TOLERANCE)

/** A flick moves to the next snap position in its direction; a slow release to the nearest one. */
export const nearestSheetSnap = (targets: number[], release: SheetRelease) => {
  const { current, velocity } = release
  if (!targets.length) return null

  const nearest = () =>
    targets.reduce((best, target) =>
      Math.abs(target - current) < Math.abs(best - current) ? target : best,
    )

  // Scroll moves against the pointer: a pointer moving forward scrolls back.
  if (velocity > FLICK_VELOCITY) {
    const behind = targets.filter((target) => target < current - 0.5)
    return behind.length ? Math.max(...behind) : nearest()
  }

  if (velocity < -FLICK_VELOCITY) {
    const ahead = targets.filter((target) => target > current + 0.5)
    return ahead.length ? Math.min(...ahead) : nearest()
  }

  return nearest()
}

/** Release target of a handle drag without snap points: closed past a quarter of the sheet or on a flick, else back. */
export const sheetDismissTarget = (input: SheetDismissInput) => {
  const { after, current, rest, travel } = input
  const dragged = Math.max(after ? travel : -travel, after ? rest - current : current - rest)
  if (!input.dismissible || dragged <= 0) return rest

  const closed = after ? 0 : Math.max(0, input.extent)
  const visible = Math.min(input.size, input.viewport)
  const velocity = Math.abs(travel) / Math.max(1, input.elapsed)

  return velocity > FLICK_VELOCITY || dragged >= visible * DISMISS_FRACTION ? closed : rest
}

/** Glides the scroll position to `glide.target`; returns a function that stops the glide. */
export const animateSheetScroll = (scroller: HTMLElement, glide: SheetGlide) => {
  const { axis, target, onDone } = glide
  const property = scrollProperty(axis)
  const from = scroller[property]
  if (prefersReducedMotion() || Math.abs(target - from) < 0.5) {
    scroller[property] = target
    onDone()

    return () => undefined
  }

  let frame = 0
  let start: number | undefined

  const step = (now: number) => {
    start ??= now
    const progress = Math.min(1, (now - start) / GLIDE_DURATION)
    scroller[property] = from + (target - from) * glideEasing(progress)

    if (progress >= 1) {
      onDone()
      return
    }

    frame = requestAnimationFrame(step)
  }

  frame = requestAnimationFrame(step)

  return () => cancelAnimationFrame(frame)
}
