import { flip, offset, shift } from '@floating-ui/dom'
import type { Middleware, Placement } from '@floating-ui/dom'

/** What an editor menu or drag handle needs from Floating UI. Internal: the public props are `side`, `align`, `sideOffset`. */
export type FloatingMiddlewareOptions = {
  /** The side and alignment relative to the anchor. */
  placement: Placement
  /** Distance from the anchor, in pixels. */
  offset?: number
  /** Flips to the opposite side when there isn't room. */
  flip?: boolean
  /** Shifts along the anchor's side to stay 8px inside the viewport. */
  shift?: boolean
}

/** The Floating UI middleware for `options`, in the order Floating UI needs them. */
export const floatingMiddleware = (options: FloatingMiddlewareOptions): Middleware[] =>
  [
    options.offset !== undefined && offset(options.offset),
    options.flip && flip(),
    options.shift && shift({ padding: 8 }),
  ].filter((entry): entry is Middleware => !!entry)
