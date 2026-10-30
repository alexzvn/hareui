import { defu } from 'defu'
import type { ComputedRef, Ref, WatchSource } from 'vue'
import { computed, onScopeDispose, shallowReactive, toRefs, watch } from 'vue'

import { prefersReducedMotion } from '@/utils/motion'

/** CSS timing function a chart series animates with. */
export type ChartEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'

/** Timing of a chart series animation, the `animation` prop of every series. */
export type ChartAnimationOptions = {
  /**
   * Delay before the animation starts, in ms.
   * @defaultValue 0
   */
  begin?: number
  /**
   * Animation length in ms.
   * @defaultValue 1500
   */
  duration?: number
  /**
   * Timing function of the animation.
   * @defaultValue 'ease'
   */
  easing?: ChartEasing
}

/** Defaults of `ChartAnimationOptions`; a partial `animation` prop keeps the others. */
const CHART_ANIMATION_DEFAULTS: Readonly<Required<ChartAnimationOptions>> = {
  begin: 0,
  duration: 1500,
  easing: 'ease',
}

/** Animation props shared by every chart series (`ChartLine`, `ChartBar`, `ChartPie`, …). */
export type ChartAnimationProps = {
  /**
   * Animates the series on mount and when its data changes. Always off when the user prefers reduced motion.
   * @defaultValue true
   */
  isAnimationActive?: boolean
  /**
   * Animation timing. Unset keys keep their defaults.
   * @defaultValue { begin: 0, duration: 1500, easing: 'ease' }
   */
  animation?: ChartAnimationOptions
}

const bezierPoints: Record<ChartEasing, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  linear: [0, 0, 1, 1],
}

/** CSS `cubic-bezier()` timing function evaluated at `t` (0–1). */
const cubicBezier = ([x1, y1, x2, y2]: [number, number, number, number]): ((
  t: number,
) => number) => {
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

const easings: Record<ChartEasing, (t: number) => number> = Object.fromEntries(
  Object.entries(bezierPoints).map(([name, points]) => [name, cubicBezier(points)]),
) as Record<ChartEasing, (t: number) => number>

export type ChartTween<T> = {
  /** Geometry to draw this frame. */
  value: ComputedRef<T>
  /** Eased progress, 0 → 1. */
  progress: Ref<number>
  /** True while the mount animation runs (no previous geometry to start from). */
  isEntering: Ref<boolean>
}

/** One interpolation step: `from` is `null` on mount, `t` the eased progress (0–1). */
export type ChartTweenStep<T> = { from: T | null; to: T; t: number }

type ChartTweenOptions<T> = {
  /** Geometry the tween ends on. */
  target: () => T
  interpolate: (step: ChartTweenStep<T>) => T
  /** Restarts the animation from the drawn geometry when it changes. */
  key: WatchSource
  animation: () => ChartAnimationProps
}

/**
 * Tweens a series' geometry: on mount from `null` (the series decides how it enters), and from the
 * currently drawn geometry whenever `key` changes (new data or series props). Size changes alone jump.
 */
export const useChartTween = <T>({
  target,
  interpolate,
  key,
  animation,
}: ChartTweenOptions<T>): ChartTween<T> => {
  // `from` is the geometry the running animation starts from (`null` on mount); kept unproxied like the drawn frames
  const tween = shallowReactive({ progress: 1, isEntering: false, from: null as T | null })
  let frame = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  // Geometry of the last read, i.e. the last render. `value` is lazy, so when `key` changes this still holds what is on
  // screen (reading `value` there would already give the new target).
  let drawn: T | null = null

  const value = computed(() => {
    const to = target()
    drawn = tween.progress >= 1 ? to : interpolate({ from: tween.from, to, t: tween.progress })

    return drawn
  })

  const stop = () => {
    if (frame) cancelAnimationFrame(frame)
    clearTimeout(timer)
    frame = 0
    timer = undefined
  }

  const start = (initial: boolean) => {
    const { isAnimationActive = true, animation: options } = animation()
    const { begin, duration, easing } = defu(options, CHART_ANIMATION_DEFAULTS)

    const snapshot = initial ? null : drawn
    stop()

    if (
      !isAnimationActive ||
      duration <= 0 ||
      typeof requestAnimationFrame === 'undefined' ||
      prefersReducedMotion()
    ) {
      tween.isEntering = false
      tween.progress = 1

      return
    }

    tween.from = snapshot
    tween.isEntering = initial
    tween.progress = 0
    const ease = easings[easing] ?? easings.ease
    const run = () => {
      const startTime = performance.now()
      const tick = (now: number) => {
        const elapsed = Math.min((now - startTime) / duration, 1)
        tween.progress = ease(elapsed)

        if (elapsed < 1) {
          frame = requestAnimationFrame(tick)

          return
        }

        frame = 0
        tween.isEntering = false
      }

      frame = requestAnimationFrame(tick)
    }

    if (begin > 0) {
      timer = setTimeout(run, begin)

      return
    }

    run()
  }

  start(true)
  watch(key, () => start(false))
  onScopeDispose(stop)

  const { progress, isEntering } = toRefs(tween)

  return { value, progress, isEntering }
}

/** Linear interpolation between `[from, to]`. */
export const lerp = ([from, to]: [number, number], t: number): number => {
  return from + (to - from) * t
}
