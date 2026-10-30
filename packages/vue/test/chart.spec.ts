import { flushPromises, mount } from '@vue/test-utils'
import { curveMonotoneX, curveMonotoneY, curveStep } from 'd3-shape'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import { lerp, useChartTween } from '@/components/chart/animation'
import { curveFactory } from '@/components/chart/curve'
import {
  fixedDomainTicks,
  niceTicks,
  resolveNumberDomain,
  thinTicks,
} from '@/components/chart/scale'
import { rectanglePath } from '@/components/chart/shapes'
import LineChart from '@/components/line-chart/LineChart.vue'

import { expectAccessible } from './a11y'

describe('useChartTween', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  // Manual frames: `frame(ms)` runs the queued callbacks at that time.
  const fakeFrames = () => {
    let queue: FrameRequestCallback[] = []
    vi.spyOn(performance, 'now').mockReturnValue(0)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => queue.push(callback))

    vi.stubGlobal('cancelAnimationFrame', () => {
      queue = []
    })

    return (time: number) => {
      const run = queue
      queue = []
      run.forEach((callback) => callback(time))
    }
  }

  it('starts a data change from the geometry on screen, not the old target', async () => {
    const frame = fakeFrames()
    const target = ref(10)
    const scope = effectScope()
    const tween = scope.run(() =>
      useChartTween({
        target: () => target.value,
        interpolate: ({ from, to, t }) => lerp([from ?? 0, to], t),
        key: target,
        animation: () => ({ animation: { duration: 100, easing: 'linear' } }),
      }),
    )!

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
      const ticks = niceTicks([5, 5], { tickCount: count })
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

    expect(
      resolveNumberDomain([5000, 9000], { domain: ['dataMin - 1000', 'dataMax + 1000'] }).domain,
    ).toEqual([4000, 10000])

    expect(resolveNumberDomain([2, 6], { domain: [0, 8] })).toEqual({
      domain: [0, 8],
      ticks: [0, 2, 4, 6, 8],
    })

    // A fixed max below the data grows unless overflow is allowed.
    expect(resolveNumberDomain([0, 12], { domain: [0, 8] }).domain).toEqual([0, 12])

    expect(
      resolveNumberDomain([0, 12], { domain: [0, 8], allowDataOverflow: true }).domain,
    ).toEqual([0, 8])

    expect(resolveNumberDomain([0, 20], { ticks: [0, 10, 20] }).ticks).toEqual([0, 10, 20])
  })

  it('thins overlapping labels, keeping the last one', () => {
    const ticks = Array.from({ length: 5 }, (_, index) => ({
      value: index,
      coordinate: index * 10,
      index,
      text: String(index),
    }))

    const kept = thinTicks(ticks, {
      interval: 'preserveEnd',
      size: () => 12,
      bounds: [0, 40],
      minTickGap: 5,
    })

    // The last label is pulled inside the bounds (34), then labels are kept leftwards while they fit.
    expect(kept.map((tick) => tick.index)).toEqual([1, 4])
    expect(kept.at(-1)?.labelCoordinate).toBe(34)

    const everyOther = thinTicks(ticks, {
      interval: 1,
      size: () => 1,
      bounds: [0, 40],
      minTickGap: 0,
    })

    expect(everyOther.map((tick) => tick.index)).toEqual([0, 2, 4])
  })
})

describe('chart shapes and curves', () => {
  it('draws plain and rounded bar rectangles', () => {
    expect(rectanglePath({ x: 0, y: 0, width: 10, height: 20 })).toBe('M 0,0 h 10 v 20 h -10 Z')
    const rounded = rectanglePath({ x: 0, y: 0, width: 10, height: 20 }, [4, 4, 0, 0])
    expect(rounded.startsWith('M0,4A 4,4,0,0,1,4,0')).toBe(true)
    expect(rounded.endsWith('Z')).toBe(true)

    // Radii clamp to half the shorter side.
    expect(rectanglePath({ x: 0, y: 0, width: 4, height: 20 }, 10)).toContain('A 2,2')
  })

  it('maps curve types and follows the layout for monotone', () => {
    expect(curveFactory('monotone', 'horizontal')).toBe(curveMonotoneX)
    expect(curveFactory('monotone', 'vertical')).toBe(curveMonotoneY)
    expect(curveFactory('step')).toBe(curveStep)
  })
})

describe('Chart', () => {
  // No tweens: shapes land on their final geometry at once.
  beforeAll(() => vi.stubGlobal('matchMedia', () => ({ matches: true })))
  afterAll(() => vi.unstubAllGlobals())

  const data = [
    { month: 'Jan', organic: 0, paid: 10 },
    { month: 'Feb', organic: 10, paid: 5 },
    { month: 'Mar', organic: 20, paid: 0 },
  ]

  const settle = async () => {
    await flushPromises()
    await nextTick()
  }

  const mountChart = (props: Record<string, unknown> = {}) => {
    return mount(LineChart, {
      props: {
        data: data,
        index: 'month',
        width: 400,
        height: 200,
        'aria-label': 'Sessions per month',
        ...props,
      },
      attachTo: document.body,
    })
  }

  const surface = (wrapper: ReturnType<typeof mountChart>) =>
    wrapper.find('[data-slot=chart-surface]').element as SVGSVGElement

  const keydown = (target: Element, key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    target.dispatchEvent(event)

    return event
  }

  it('names the interactive chart from aria-labelledby and aria-describedby on the svg', async () => {
    const title = Object.assign(document.createElement('h2'), {
      id: 'chart-title',
      textContent: 'Traffic',
    })

    const description = Object.assign(document.createElement('p'), {
      id: 'chart-description',
      textContent: 'Organic and paid sessions, Q1',
    })

    document.body.append(title, description)

    const wrapper = mountChart({
      'aria-label': undefined,
      'aria-labelledby': 'chart-title',
      'aria-describedby': 'chart-description',
    })

    await settle()
    const svg = surface(wrapper)
    expect(svg.getAttribute('role')).toBe('application')

    expect(document.getElementById(svg.getAttribute('aria-labelledby')!)?.textContent).toBe(
      'Traffic',
    )

    expect(document.getElementById(svg.getAttribute('aria-describedby')!)?.textContent).toBe(
      'Organic and paid sessions, Q1',
    )

    expect(wrapper.attributes('aria-labelledby')).toBeUndefined()
    await expectAccessible()
    wrapper.unmount()
    title.remove()
    description.remove()
  })

  it('takes role="img" and a name when it has no tooltip, and stays out of the tab order', async () => {
    const wrapper = mountChart({ tooltip: false, role: 'img' })
    await settle()
    const svg = surface(wrapper)
    expect(svg.getAttribute('role')).toBe('img')
    expect(svg.getAttribute('aria-label')).toBe('Sessions per month')
    expect(svg.hasAttribute('tabindex')).toBe(false)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('lets Tab leave the chart and keeps focus on it when Escape dismisses the tooltip', async () => {
    const wrapper = mountChart()
    await settle()
    const svg = surface(wrapper)
    svg.focus()
    await settle()
    expect(keydown(svg, 'Tab').defaultPrevented).toBe(false)
    expect(keydown(svg, 'ArrowRight').defaultPrevented).toBe(true)
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe('open')
    keydown(svg, 'Escape')
    await settle()

    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe(
      'closed',
    )

    expect(document.activeElement).toBe(svg)
    wrapper.unmount()
  })

  it('puts the chart and its legend toggles in the tab order in reading order', async () => {
    const focusables = (wrapper: ReturnType<typeof mountChart>) => {
      const root: Element = wrapper.element
      return Array.from(root.querySelectorAll('[tabindex="0"], button'), (element) =>
        element.getAttribute('data-slot'),
      )
    }

    const below = mountChart({ legend: 'bottom' })
    await settle()

    expect(focusables(below)).toEqual([
      'chart-surface',
      'chart-legend-trigger',
      'chart-legend-trigger',
    ])

    below.unmount()
    const above = mountChart({ legend: 'top' })
    await settle()

    expect(focusables(above)).toEqual([
      'chart-legend-trigger',
      'chart-legend-trigger',
      'chart-surface',
    ])

    above.unmount()
  })

  it('keeps focus on a legend toggle that hides its series, and stays accessible', async () => {
    const wrapper = mountChart({ legend: true })
    await settle()
    const toggle = wrapper.findAll('[data-slot=chart-legend-trigger]')[1]!
    ;(toggle.element as HTMLButtonElement).focus()
    await toggle.trigger('click')
    await settle()
    expect(document.activeElement).toBe(toggle.element)
    expect(toggle.attributes('aria-pressed')).toBe('false')
    expect(wrapper.findAll('[data-slot=chart-line-curve]')).toHaveLength(1)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
