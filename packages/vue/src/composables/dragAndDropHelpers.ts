/** Where dropped items land relative to the target item: before it, after it, or inside it. */
export type DropPosition = 'before' | 'after' | 'inside'

/** The locale key announcing a drop at each position. */
export const MOVED_KEYS = {
  before: 'dragAndDrop.movedBefore',
  after: 'dragAndDrop.movedAfter',
  inside: 'dragAndDrop.movedInside',
} as const satisfies Record<DropPosition, string>

type Point = { x: number; y: number }

// Within this distance (px) of the scroll container's edge a pointer drag scrolls it...
const SCROLL_EDGE = 48

// ...by up to this many pixels a frame, faster closer to the edge
const MAX_SCROLL_SPEED = 16

/**
 * How far, and which way, a pointer at `position` scrolls a container spanning `start`–`end`; zero away from the
 * edges.
 */
export const getEdgeScroll = (position: number, { start, end }: { start: number; end: number }) => {
  const zone = Math.min(SCROLL_EDGE, (end - start) / 4)
  const intoStart = start + zone - position
  const intoEnd = position - (end - zone)
  if (intoStart > 0) return -Math.ceil((Math.min(intoStart, zone) / zone) * MAX_SCROLL_SPEED)
  if (intoEnd > 0) return Math.ceil((Math.min(intoEnd, zone) / zone) * MAX_SCROLL_SPEED)

  return 0
}

/** `progress` runs from 0 at the item's leading edge to 1 at its trailing edge. */
export const pickPosition = (progress: number, canDropInside: boolean): DropPosition => {
  if (!canDropInside) return progress < 0.5 ? 'before' : 'after'
  if (progress < 0.25) return 'before'

  return progress > 0.75 ? 'after' : 'inside'
}

/** Whether the browser won't pan this touch: it only pans when every element from the pressed one up allows it. */
export const isPanBlocked = (event: PointerEvent) => {
  const boundary = (event.currentTarget as HTMLElement).parentElement
  for (let node = event.target as HTMLElement | null; node && node !== boundary;) {
    if (getComputedStyle(node).touchAction === 'none') return true
    node = node.parentElement
  }

  return false
}

const clamp = (value: number, { start, end }: { start: number; end: number }) =>
  Math.min(Math.max(value, start + 1), end - 1)

/**
 * The pointer moved inside `rect` across the axis, so only the main axis counts: a pointer beside a vertical list
 * hits the item level with it.
 */
export const clampCrossAxis = (
  pointer: Point,
  { rect, isVertical }: { rect: DOMRect; isVertical: boolean },
) =>
  isVertical
    ? { x: clamp(pointer.x, { start: rect.left, end: rect.right }), y: pointer.y }
    : { x: pointer.x, y: clamp(pointer.y, { start: rect.top, end: rect.bottom }) }

/** Whether `key` picks up or drops a keyboard drag. */
export const isGrabKey = (key: string) => key === 'Enter' || key === ' '

/** Swallows the next keyup of a grab key: Space activates a focused button on keyup, and the key that grabbed or dropped must not. */
export const swallowKeyUp = () => {
  const onKeyUp = (event: KeyboardEvent) => {
    window.removeEventListener('keyup', onKeyUp, true)
    if (!isGrabKey(event.key)) return

    event.preventDefault()
    event.stopPropagation()
  }

  window.addEventListener('keyup', onKeyUp, true)
}
