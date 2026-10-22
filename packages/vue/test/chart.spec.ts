import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { curveMonotoneX, curveMonotoneY, curveStep } from 'd3-shape'
import { lerp, useChartTween } from '../src/components/chart/animation'
import { curveFactory } from '../src/components/chart/curve'
import { fixedDomainTicks, niceTicks, resolveNumberDomain, thinTicks } from '../src/components/chart/scale'
import { rectanglePath } from '../src/components/chart/shapes'

describe('useChartTween', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  // Manual frames: `frame(ms)` runs the queued callbacks at that time.
  function fakeFrames() {
    let queue: FrameRequestCallback[] = []
    vi.spyOn(performance, 'now').mockReturnValue(0)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => queue.push(callback))
    vi.stubGlobal('cancelAnimationFrame', () => { queue = [] })
    return (time: number) => {
      const run = queue
      queue = []
      run.forEach(callback => callback(time))
    }
  }

  it('starts a data change from the geometry on screen, not the old target', async () => {
    const frame = fakeFrames()
    const target = ref(10)
    const scope = effectScope()
    const tween = scope.run(() => useChartTween(
      () => target.value,
      (from, to, t) => lerp(from ?? 0, to, t),
      target,
      () => ({ animationDuration: 100, animationEasing: 'linear' }),
    ))!
    expect(tween.value.value).toBe(0)
    frame(50)
    expect(tween.value.value).toBe(5)
    // Interrupted halfway: the new animation runs 5 -> 20, it doesn't jump back to 10 first.
    target.value = 20
    await nextTick()
    expect(tween.value.value).toBe(5)
    frame(50)
    expect(tween.value.value).toBe(12.5)
    frame(100)
    expect(tween.value.value).toBe(20)
    scope.stop()
  })
})

describe('chart scale helpers', () => {
  it('rounds number axes to nice ticks', () => {
    expect(niceTicks([0, 11500])).toEqual([0, 3000, 6000, 9000, 12000])
    expect(niceTicks([0, 20])).toEqual([0, 5, 10, 15, 20])
    expect(niceTicks([0, 16000])).toEqual([0, 4000, 8000, 12000, 16000])
    expect(niceTicks([0, 5])).toEqual([0, 2, 4, 6, 8])
    expect(niceTicks([-10, 10])).toEqual([-10, -5, 0, 5, 10])
  })

  it('keeps a finite domain for a single value with tickCount below 2', () => {
    for (const count of [0, 1]) {
      const ticks = niceTicks([5, 5], count)
      expect(ticks.length).toBeGreaterThanOrEqual(2)
      expect(ticks.every(Number.isFinite)).toBe(true)
    }
  })

  it('steps evenly inside a fixed domain and ends on its max', () => {
    expect(fixedDomainTicks([0, 8])).toEqual([0, 2, 4, 6, 8])
    expect(fixedDomainTicks([4000, 10000])).toEqual([4000, 5500, 7000, 8500, 10000])
  })

  it('resolves domain definitions', () => {
    expect(resolveNumberDomain([0, 11500]).domain).toEqual([0, 12000])
    expect(resolveNumberDomain([5000, 9000], { domain: ['dataMin - 1000', 'dataMax + 1000'] }).domain).toEqual([4000, 10000])
    expect(resolveNumberDomain([2, 6], { domain: [0, 8] })).toEqual({ domain: [0, 8], ticks: [0, 2, 4, 6, 8] })
    // A fixed max below the data grows unless overflow is allowed.
    expect(resolveNumberDomain([0, 12], { domain: [0, 8] }).domain).toEqual([0, 12])
    expect(resolveNumberDomain([0, 12], { domain: [0, 8], allowDataOverflow: true }).domain).toEqual([0, 8])
    expect(resolveNumberDomain([0, 20], { ticks: [0, 10, 20] }).ticks).toEqual([0, 10, 20])
  })

  it('thins overlapping labels, keeping the last one', () => {
    const ticks = Array.from({ length: 5 }, (_, index) => ({ value: index, coordinate: index * 10, index, text: String(index) }))
    const kept = thinTicks(ticks, 'preserveEnd', () => 12, [0, 40], 5)
    // The last label is pulled inside the bounds (34), then labels are kept leftwards while they fit.
    expect(kept.map(tick => tick.index)).toEqual([1, 4])
    expect(kept.at(-1)?.labelCoordinate).toBe(34)
    expect(thinTicks(ticks, 1, () => 1, [0, 40], 0).map(tick => tick.index)).toEqual([0, 2, 4])
  })
})

describe('chart shapes and curves', () => {
  it('draws plain and rounded bar rectangles', () => {
    expect(rectanglePath(0, 0, 10, 20)).toBe('M 0,0 h 10 v 20 h -10 Z')
    const rounded = rectanglePath(0, 0, 10, 20, [4, 4, 0, 0])
    expect(rounded.startsWith('M0,4A 4,4,0,0,1,4,0')).toBe(true)
    expect(rounded.endsWith('Z')).toBe(true)
    // Radii clamp to half the shorter side.
    expect(rectanglePath(0, 0, 4, 20, 10)).toContain('A 2,2')
  })

  it('maps curve types and follows the layout for monotone', () => {
    expect(curveFactory('monotone', 'horizontal')).toBe(curveMonotoneX)
    expect(curveFactory('monotone', 'vertical')).toBe(curveMonotoneY)
    expect(curveFactory('step')).toBe(curveStep)
  })
})
