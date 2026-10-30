let reducedMotionSource: typeof window.matchMedia | undefined
let reducedMotionQuery: MediaQueryList | undefined

/**
 * Whether the user asked for reduced motion. Cheap enough for hot paths (e.g. every pointer move): the query is
 * cached per `matchMedia` function, so a replaced (e.g. stubbed) one is respected.
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false

  if (reducedMotionSource !== window.matchMedia || !reducedMotionQuery) {
    reducedMotionSource = window.matchMedia
    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  }

  return !!reducedMotionQuery?.matches
}
