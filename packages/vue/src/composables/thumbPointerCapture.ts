/**
 * reka-limitation: Reka's `SliderImpl` captures the pointer on whichever element was pressed. A press
 * on the track keeps the track as the capture target for the whole drag, and the browser shows the
 * capture target's cursor, so the dragged thumb's `cursor-grabbing` never appears (RAC shows it, since
 * its thumb follows the pointer). Bound to `gotpointercapture` on the slider root, this hands the
 * capture to the thumb being dragged: the one Reka focused on slide start, or the only thumb. Reka's
 * move/up handlers only check that the event target holds the capture, so dragging is unaffected.
 */
export const captureOnDraggedThumb = (event: PointerEvent): void => {
  const root = event.currentTarget as HTMLElement
  const target = event.target as HTMLElement
  const thumbs = root.querySelectorAll<HTMLElement>('[role="slider"]')
  const active = document.activeElement
  const thumb =
    [...thumbs].find((el) => el === active) ?? (thumbs.length === 1 ? thumbs[0] : undefined)

  if (thumb && thumb !== target) thumb.setPointerCapture(event.pointerId)
}
