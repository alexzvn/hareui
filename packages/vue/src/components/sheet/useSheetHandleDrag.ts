import { onBeforeUnmount, watch } from 'vue'

import type { SheetAxis, SheetHandleDrag, SheetHandleDragOptions } from './Sheet.types'
import {
  animateSheetScroll,
  getScroll,
  nearestSheetSnap,
  scrollProperty,
  sheetDismissTarget,
  sheetSnapTargets,
} from './sheetScroll'

const pointerPosition = (event: PointerEvent, axis: SheetAxis) =>
  axis === 'y' ? event.clientY : event.clientX

/**
 * Pointer drags on the handle, ported from HeroUI's `useSheetHandleDrag`. Touch on the panel already swipes natively;
 * a mouse can't scroll by dragging, so the handle scrolls the sheet's scroll container itself (snapping paused), and
 * the release glides to the nearest snap position, or without snap points closes the sheet past a quarter of it or
 * on a flick.
 *
 * Must be called in `setup`.
 */
export const useSheetHandleDrag = (options: SheetHandleDragOptions) => {
  let drag: SheetHandleDrag | null = null
  let cancelGlide: (() => void) | null = null

  const release = () => {
    const state = drag
    drag = null
    if (!state) return null

    state.handle.removeAttribute('data-dragging')

    if (state.handle.hasPointerCapture?.(state.pointerId)) {
      state.handle.releasePointerCapture(state.pointerId)
    }

    return state
  }

  const stop = () => {
    release()?.scroller.removeAttribute('data-handle-dragging')
    cancelGlide?.()
    cancelGlide = null
  }

  const onPointerdown = (event: PointerEvent) => {
    if (event.button !== 0 || drag) return
    const handle = event.currentTarget as HTMLElement
    const scroller = handle.closest<HTMLElement>('[data-sheet-scroll]')
    if (!scroller) return

    event.preventDefault()
    cancelGlide?.()
    cancelGlide = null
    handle.setPointerCapture?.(event.pointerId)
    handle.setAttribute('data-dragging', '')
    scroller.setAttribute('data-handle-dragging', '')

    const { axis } = options.config()
    const origin = pointerPosition(event, axis)

    drag = {
      axis,
      handle,
      scroller,
      pointerId: event.pointerId,
      origin,
      last: origin,
      lastTime: event.timeStamp,
      startedAt: event.timeStamp,
      scroll: getScroll(scroller, axis),
      velocity: 0,
    }
  }

  const onPointermove = (event: PointerEvent) => {
    if (drag?.pointerId !== event.pointerId) return
    const position = pointerPosition(event, drag.axis)
    const elapsed = event.timeStamp - drag.lastTime
    if (elapsed > 0) drag.velocity = (position - drag.last) / elapsed
    drag.last = position
    drag.lastTime = event.timeStamp
    drag.scroller[scrollProperty(drag.axis)] = drag.scroll - (position - drag.origin)
  }

  const dismissTarget = (state: SheetHandleDrag, event: PointerEvent) => {
    const { axis, scroller } = state
    const isVertical = axis === 'y'
    const rect = state.handle.closest<HTMLElement>('[data-sheet-content]')?.getBoundingClientRect()

    return sheetDismissTarget({
      after: options.config().after,
      current: getScroll(scroller, axis),
      rest: state.scroll,
      extent: isVertical
        ? scroller.scrollHeight - scroller.clientHeight
        : scroller.scrollWidth - scroller.clientWidth,
      size: (isVertical ? rect?.height : rect?.width) ?? 0,
      viewport: isVertical ? window.innerHeight : window.innerWidth,
      travel: state.last - state.origin,
      elapsed: event.timeStamp - state.startedAt,
      dismissible: options.dismissible(),
    })
  }

  const releaseTarget = (state: SheetHandleDrag, event: PointerEvent) => {
    if (!options.hasSnapPoints()) return dismissTarget(state, event)
    const targets = sheetSnapTargets(state.scroller, state.axis)
    const current = getScroll(state.scroller, state.axis)

    return nearestSheetSnap(targets, { current, velocity: state.velocity })
  }

  const finish = (event: PointerEvent, isCancelled: boolean) => {
    if (drag?.pointerId !== event.pointerId) return
    const state = release()
    if (!state) return

    const { axis, scroller } = state
    const target = isCancelled ? state.scroll : releaseTarget(state, event)
    if (target === null) {
      scroller.removeAttribute('data-handle-dragging')
      return
    }

    // With snap points, the sheet leaving the viewport closes it (useSheetMotion).
    const shouldClose = !isCancelled && !options.hasSnapPoints() && target !== state.scroll

    cancelGlide = animateSheetScroll(scroller, {
      axis,
      target,
      onDone: () => {
        cancelGlide = null
        scroller.removeAttribute('data-handle-dragging')
        if (shouldClose && scroller.isConnected && options.open()) options.close()
      },
    })
  }

  watch(options.open, (open) => {
    if (!open) stop()
  })

  onBeforeUnmount(stop)

  return {
    onPointerdown,
    onPointermove,
    onPointerup: (event: PointerEvent) => finish(event, false),
    onPointercancel: (event: PointerEvent) => finish(event, true),
    onLostpointercapture: (event: PointerEvent) => finish(event, true),
  }
}
