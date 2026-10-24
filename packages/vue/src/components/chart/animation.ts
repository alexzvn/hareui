import type { ComputedRef, Ref, WatchSource } from 'vue'
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue'

export type ChartEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'

export interface ChartAnimationProps {
  /**
   * Animates the series on mount and when its data changes. Always off when the user prefers reduced motion.
   * @defaultValue true
   */
  isAnimationActive?: boolean
  /**
   * Delay before the animation starts, in ms.
   * @defaultValue 0
   */
  animationBegin?: number
  /**
   * Animation length in ms.
   * @defaultValue 1500
   */
  animationDuration?: number
  /**
   * Timing function of the animation.
   * @defaultValue 'ease'
   */
  animationEasing?: ChartEasing
}

const bezierPoints: Record<ChartEasing, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  linear: [0, 0, 1, 1],
}

/** CSS `cubic-bezier()` timing function evaluated at `t` (0–1). */
export function cubicBezier([x1, y1, x2, y2]: [number, number, number, number]): (
  t: number,
) => number {
  const curve = (a: number, b: number) => (t: number) =>
    3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3
  const x = curve(x1, x2)
  const y = curve(y1, y2)
  const dx = (t: number) =>
    3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * (1 - t) * t + 3 * (1 - x2) * t ** 2
  return (time: number) => {
    if (time <= 0 || time >= 1) return Math.min(Math.max(time, 0), 1)
    let t = time
    for (let index = 0; index < 8; index++) {
      const error = x(t) - time
      const slope = dx(t)
      if (Math.abs(error) < 1e-6 || slope === 0) break
      t -= error / slope
    }
    return y(Math.min(Math.max(t, 0), 1))
  }
}

export const easings: Record<ChartEasing, (t: number) => number> = Object.fromEntries(
  Object.entries(bezierPoints).map(([name, points]) => [name, cubicBezier(points)]),
) as Record<ChartEasing, (t: number) => number>

// Called on every pointer move; cached per `matchMedia` function so a replaced (e.g. stubbed) one is respected.
let reducedMotionSource: typeof window.matchMedia | undefined
let reducedMotionQuery: MediaQueryList | undefined

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  if (reducedMotionSource !== window.matchMedia || !reducedMotionQuery) {
    reducedMotionSource = window.matchMedia
    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  }
  return !!reducedMotionQuery?.matches
}

export interface ChartTween<T> {
  /** Geometry to draw this frame. */
  value: ComputedRef<T>
  /** Eased progress, 0 → 1. */
  progress: Ref<number>
  /** True while the mount animation runs (no previous geometry to start from). */
  entering: Ref<boolean>
}

/**
 * Tweens a series' geometry: on mount from `null` (the series decides how it enters), and from the
 * currently drawn geometry whenever `key` changes (new data or series props). Size changes alone jump.
 */
export function useChartTween<T>(
  target: () => T,
  interpolate: (from: T | null, to: T, t: number) => T,
  key: WatchSource,
  options: () => ChartAnimationProps,
): ChartTween<T> {
  const progress = ref(1)
  const entering = ref(false)
  const from = shallowRef<T | null>(null)
  let frame = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  // Geometry of the last read, i.e. the last render. `value` is lazy, so when `key` changes this still holds what is on
  // screen (reading `value` there would already give the new target).
  let drawn: T | null = null

  const value = computed(() => {
    const to = target()
    drawn = progress.value >= 1 ? to : interpolate(from.value, to, progress.value)
    return drawn
  })

  function stop() {
    if (frame) cancelAnimationFrame(frame)
    clearTimeout(timer)
    frame = 0
    timer = undefined
  }

  function start(initial: boolean) {
    const {
      isAnimationActive = true,
      animationBegin = 0,
      animationDuration = 1500,
      animationEasing = 'ease',
    } = options()
    const snapshot = initial ? null : drawn
    stop()
    if (
      !isAnimationActive ||
      animationDuration <= 0 ||
      typeof requestAnimationFrame === 'undefined' ||
      prefersReducedMotion()
    ) {
      entering.value = false
      progress.value = 1
      return
    }
    from.value = snapshot
    entering.value = initial
    progress.value = 0
    const ease = easings[animationEasing] ?? easings.ease
    const run = () => {
      const startTime = performance.now()
      const tick = (now: number) => {
        const elapsed = Math.min((now - startTime) / animationDuration, 1)
        progress.value = ease(elapsed)
        if (elapsed < 1) {
          frame = requestAnimationFrame(tick)
        } else {
          frame = 0
          entering.value = false
        }
      }
      frame = requestAnimationFrame(tick)
    }
    if (animationBegin > 0) timer = setTimeout(run, animationBegin)
    else run()
  }

  start(true)
  watch(key, () => start(false))
  onScopeDispose(stop)

  return { value, progress, entering }
}

/** Linear interpolation. */
export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}
