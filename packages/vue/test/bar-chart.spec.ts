import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import BarChart from '../src/components/bar-chart/BarChart.vue'
import ChartBar from '../src/components/chart/ChartBar.vue'
import ChartTooltip from '../src/components/chart/ChartTooltip.vue'
import ChartXAxis from '../src/components/chart/ChartXAxis.vue'
import ChartYAxis from '../src/components/chart/ChartYAxis.vue'
import { expectAccessible } from './a11y'

const WIDTH = 400
const HEIGHT = 200
const margin = { top: 0, right: 0, bottom: 0, left: 0 }

/** Bounding box of an SVG path made of M/L/H/V/A/Z commands (absolute or relative). */
function bbox(d: string) {
  const xs: number[] = []
  const ys: number[] = []
  let x = 0
  let y = 0
  for (const [, cmd, args] of d.matchAll(/([MLHVAZmlhvaz])([^MLHVAZmlhvaz]*)/g)) {
    const n = (args.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number)
    const rel = cmd === cmd.toLowerCase()
    switch (cmd.toUpperCase()) {
      case 'M':
      case 'L':
        for (let i = 0; i < n.length; i += 2) {
          x = rel ? x + n[i] : n[i]
          y = rel ? y + n[i + 1] : n[i + 1]
          xs.push(x)
          ys.push(y)
        }
        break
      case 'H':
        for (const v of n) {
          x = rel ? x + v : v
          xs.push(x)
        }
        break
      case 'V':
        for (const v of n) {
          y = rel ? y + v : v
          ys.push(y)
        }
        break
      case 'A':
        for (let i = 0; i < n.length; i += 7) {
          x = rel ? x + n[i + 5] : n[i + 5]
          y = rel ? y + n[i + 6] : n[i + 6]
          xs.push(x)
          ys.push(y)
        }
        break
    }
  }
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  }
}

async function settle() {
  await flushPromises()
  await nextTick()
}

async function hover(
  wrapper: { find: (s: string) => { element: Element } },
  clientX: number,
  clientY: number,
) {
  wrapper
    .find('[data-slot=chart-surface]')
    .element.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY, bubbles: true }))
  await settle()
}

const data = [
  { name: 'A', low: 10, high: 30 },
  { name: 'B', low: 20, high: 20 },
]

function mountChart(children: () => any[], props: Record<string, unknown> = {}) {
  return mount(BarChart, {
    props: { data, width: WIDTH, height: HEIGHT, margin, ...props },
    slots: { default: children },
    attachTo: document.body,
  })
}

function bars(wrapper: ReturnType<typeof mountChart>) {
  return wrapper.findAll('[data-slot=chart-bar-rectangle]').map((bar) => bbox(bar.attributes('d')!))
}

describe('BarChart', () => {
  it('draws one bar per datum with heights proportional to values', async () => {
    const wrapper = mountChart(() => [
      h(ChartBar, { dataKey: 'low', barSize: 20, isAnimationActive: false }),
    ])
    await settle()
    const [a, b] = bars(wrapper)
    expect(a.width).toBeCloseTo(20)
    expect(b.width).toBeCloseTo(20)
    expect(b.height).toBeCloseTo(a.height * 2)
    // Bars grow from the bottom edge of the plot.
    expect(a.y + a.height).toBeCloseTo(HEIGHT)
    // Band scale: the second category sits to the right of the first.
    expect(b.x).toBeGreaterThan(a.x)
    wrapper.unmount()
  })

  it('places grouped bars side by side within a category', async () => {
    const wrapper = mountChart(() => [
      h(ChartBar, { dataKey: 'low', barSize: 10, isAnimationActive: false }),
      h(ChartBar, { dataKey: 'high', barSize: 10, isAnimationActive: false }),
    ])
    await settle()
    const [lowA, , highA] = bars(wrapper)
    expect(highA.x).toBeGreaterThanOrEqual(lowA.x + lowA.width)
    wrapper.unmount()
  })

  it('stacks bars that share a stack-id', async () => {
    const wrapper = mountChart(() => [
      h(ChartBar, { dataKey: 'low', stackId: 's', barSize: 20, isAnimationActive: false }),
      h(ChartBar, { dataKey: 'high', stackId: 's', isAnimationActive: false }),
    ])
    await settle()
    const [lowA, lowB, highA, highB] = bars(wrapper)
    // Same x and width (size inherited from the first bar in the stack).
    expect(highA.x).toBeCloseTo(lowA.x)
    expect(highA.width).toBeCloseTo(20)
    // The upper segment starts where the lower one ends.
    expect(highA.y + highA.height).toBeCloseTo(lowA.y)
    // Totals are 40 for both categories, so both stacks reach the same top.
    expect(highA.y).toBeCloseTo(highB.y)
    expect(lowB.height).toBeCloseTo(lowA.height * 2)
    wrapper.unmount()
  })

  it('layout="vertical" draws horizontal bars from the left edge', async () => {
    const wrapper = mountChart(
      () => [
        h(ChartXAxis, { type: 'number', hide: true }),
        h(ChartYAxis, { dataKey: 'name', type: 'category', hide: true }),
        h(ChartBar, { dataKey: 'low', barSize: 14, isAnimationActive: false }),
      ],
      { layout: 'vertical' },
    )
    await settle()
    const [a, b] = bars(wrapper)
    expect(a.height).toBeCloseTo(14)
    expect(a.x).toBeCloseTo(0)
    expect(b.width).toBeCloseTo(a.width * 2)
    expect(b.y).toBeGreaterThan(a.y)
    wrapper.unmount()
  })

  it('hovering a category shows both series in the tooltip', async () => {
    const wrapper = mountChart(() => [
      h(ChartXAxis, { dataKey: 'name', hide: true }),
      h(ChartBar, {
        dataKey: 'low',
        name: 'Low',
        fill: 'var(--chart-1)',
        isAnimationActive: false,
      }),
      h(ChartBar, {
        dataKey: 'high',
        name: 'High',
        fill: 'var(--chart-2)',
        isAnimationActive: false,
      }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    await hover(wrapper, 300, 100)
    const panel = wrapper.find('[data-slot=chart-tooltip]')
    expect(panel.find('[data-slot=chart-tooltip-header]').text()).toBe('B')
    expect(panel.findAll('[data-slot=chart-tooltip-label]').map((label) => label.text())).toEqual([
      'Low',
      'High',
    ])
    expect(panel.findAll('[data-slot=chart-tooltip-value]').map((value) => value.text())).toEqual([
      '20',
      '20',
    ])
    expect(wrapper.find('[data-slot=chart-cursor]').attributes('data-kind')).toBe('band')
    wrapper.unmount()
  })

  it('keeps the tooltip in the gaps between bars, switching at the category boundary', async () => {
    const wrapper = mountChart(() => [
      h(ChartXAxis, { dataKey: 'name', hide: true }),
      h(ChartBar, { dataKey: 'low', barSize: 20, isAnimationActive: false }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    const header = () => wrapper.find('[data-slot=chart-tooltip-header]').text()
    const state = () => wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')
    // Bands are [0, 200] and [200, 400]; 20px bars sit in their middle, so these points miss every bar.
    await hover(wrapper, 5, 10)
    expect([state(), header()]).toEqual(['open', 'A'])
    await hover(wrapper, 195, 10)
    expect([state(), header()]).toEqual(['open', 'A'])
    await hover(wrapper, 205, 10)
    expect([state(), header()]).toEqual(['open', 'B'])
    await hover(wrapper, 399, 199)
    expect([state(), header()]).toEqual(['open', 'B'])
    wrapper.unmount()
  })

  it('picks the hovered category by y in the vertical layout', async () => {
    const wrapper = mountChart(
      () => [
        h(ChartXAxis, { type: 'number', hide: true }),
        h(ChartYAxis, { dataKey: 'name', type: 'category', hide: true }),
        h(ChartBar, { dataKey: 'low', isAnimationActive: false }),
        h(ChartTooltip, { isAnimationActive: false }),
      ],
      { layout: 'vertical' },
    )
    await settle()
    const header = () => wrapper.find('[data-slot=chart-tooltip-header]').text()
    await hover(wrapper, 390, 90)
    expect(header()).toBe('A')
    await hover(wrapper, 10, 110)
    expect(header()).toBe('B')
    // The band is inset by half a pixel on each side.
    expect(wrapper.find('[data-slot=chart-cursor]').attributes('d')).toBe(
      'M 0,100.5 h 400 v 99 h -400 Z',
    )
    wrapper.unmount()
  })

  it('never draws negative bar widths when the category gap exceeds half the band', async () => {
    const wrapper = mountChart(() => [h(ChartBar, { dataKey: 'low', isAnimationActive: false })], {
      barCategoryGap: '60%',
    })
    await settle()
    for (const bar of bars(wrapper)) expect(bar.width).toBeGreaterThanOrEqual(0)
    expect(wrapper.find('[data-slot=chart-bar-rectangle]').attributes('d')).not.toContain('NaN')
    wrapper.unmount()
  })

  it('walks the categories with the keyboard in the vertical layout and announces both series', async () => {
    const wrapper = mountChart(
      () => [
        h(ChartXAxis, { type: 'number', hide: true }),
        h(ChartYAxis, { dataKey: 'name', type: 'category', hide: true }),
        h(ChartBar, { dataKey: 'low', name: 'Low', isAnimationActive: false }),
        h(ChartBar, { dataKey: 'high', name: 'High', isAnimationActive: false }),
        h(ChartTooltip, { isAnimationActive: false }),
      ],
      { layout: 'vertical' },
    )
    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    const live = () => wrapper.find('[data-slot=chart-tooltip-wrapper]')
    expect(svg.attributes('tabindex')).toBe('0')
    ;(svg.element as SVGElement).focus()
    await settle()
    expect(live().find('[data-slot=chart-tooltip-header]').text()).toBe('A')
    await svg.trigger('keydown', { key: 'ArrowDown' })
    await settle()
    expect(live().find('[data-slot=chart-tooltip-header]').text()).toBe('B')
    expect(
      live()
        .findAll('[data-slot=chart-tooltip-label]')
        .map((label) => label.text()),
    ).toEqual(['Low', 'High'])
    // The band cursor is decoration.
    expect(
      wrapper.find('[data-slot=chart-cursor]').element.closest('[aria-hidden=true]'),
    ).not.toBeNull()
    await svg.trigger('keydown', { key: 'ArrowUp' })
    await settle()
    expect(live().find('[data-slot=chart-tooltip-header]').text()).toBe('A')
    wrapper.unmount()
  })

  it('is accessible idle and with a category focused, horizontal and vertical', async () => {
    for (const layout of ['horizontal', 'vertical'] as const) {
      const wrapper = mount(BarChart, {
        props: {
          data: data,
          index: 'name',
          layout: layout,
          width: WIDTH,
          height: HEIGHT,
          legend: true,
          'aria-label': 'Low and high by group',
        },
        attachTo: document.body,
      })
      await settle()
      await expectAccessible(wrapper)
      ;(wrapper.find('[data-slot=chart-surface]').element as SVGElement).focus()
      await settle()
      expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe(
        'open',
      )
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })
})
