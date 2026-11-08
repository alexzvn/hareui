import { nextTick, onBeforeUnmount, ref, useId } from 'vue'

type WavePhase = 'pressed' | 'releasing' | 'released'

type Wave = {
  id: string
  size: number
  from: string
  to: string
  phase: WavePhase
  startedAt: number
}

type Point = { x: number; y: number }

type RippleTiming = { duration: number; minimumPressDuration: number }

// The circle starts at 20 % of its size and ends centred, as wide as the element's diagonal plus a soft edge of
// 35 % of its longest side (at least 75px) and 12px of padding, so the solid part covers every corner.
const INITIAL_SCALE = 0.2
const PADDING = 12
const SOFT_EDGE_MINIMUM = 75
const SOFT_EDGE_RATIO = 0.35
const FADE_DURATION = 375

const prefersReducedMotion = () => {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

const toTransform = ({ point, size, scale }: { point: Point; size: number; scale: number }) => {
  return `translate(${point.x - size / 2}px, ${point.y - size / 2}px) scale(${scale})`
}

/** Ripple waves of one pressable element: `press` adds a wave, `release` fades the pressed ones out. */
export const usePressableRipple = (timing: () => RippleTiming) => {
  const waves = ref<Wave[]>([])
  const idPrefix = useId()
  const timers = new Set<ReturnType<typeof setTimeout>>()
  let count = 0

  const later = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.delete(timer)
      callback()
    }, delay)

    timers.add(timer)
  }

  const createWave = (el: HTMLElement, point?: Point): Wave => {
    const { width, height } = el.getBoundingClientRect()
    const softEdge = Math.max(SOFT_EDGE_RATIO * Math.max(width, height), SOFT_EDGE_MINIMUM)
    const size = Math.hypot(width, height) + PADDING + softEdge
    const center = { x: width / 2, y: height / 2 }

    return {
      id: `${idPrefix}-${count++}`,
      size,
      from: toTransform({ point: point ?? center, size, scale: INITIAL_SCALE }),
      to: toTransform({ point: center, size, scale: 1 }),
      phase: 'pressed',
      startedAt: performance.now(),
    }
  }

  const press = (el: HTMLElement, point?: Point) => {
    const wave = createWave(el, point)
    waves.value.push(wave)
    if (prefersReducedMotion()) return

    const { duration } = timing()

    nextTick(() => {
      const node = el.querySelector<HTMLElement>(`[data-wave="${wave.id}"]`)
      node?.animate?.([{ transform: wave.from }, { transform: wave.to }], { duration })
    })
  }

  const fade = (id: string) => {
    const wave = waves.value.find((entry) => entry.id === id)
    if (!wave) return

    wave.phase = 'released'

    later(() => {
      waves.value = waves.value.filter((entry) => entry.id !== id)
    }, FADE_DURATION)
  }

  const release = () => {
    const { minimumPressDuration } = timing()
    const pressed = waves.value.filter((wave) => wave.phase === 'pressed')

    for (const wave of pressed) {
      wave.phase = 'releasing'
      const elapsed = performance.now() - wave.startedAt
      later(() => fade(wave.id), Math.max(minimumPressDuration - elapsed, 0))
    }
  }

  onBeforeUnmount(() => {
    for (const timer of timers) clearTimeout(timer)
  })

  return { waves, press, release }
}
