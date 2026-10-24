import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { h, nextTick, ref } from 'vue'

import ChartArea from '@/components/chart/ChartArea.vue'
import ChartBar from '@/components/chart/ChartBar.vue'
import ChartLine from '@/components/chart/ChartLine.vue'
import ChartTooltip from '@/components/chart/ChartTooltip.vue'
import ChartXAxis from '@/components/chart/ChartXAxis.vue'
import ChartYAxis from '@/components/chart/ChartYAxis.vue'
import ComposedChart from '@/components/composed-chart/ComposedChart.vue'

import { expectAccessible } from './a11y'

const WIDTH = 400
const HEIGHT = 200
const margin = { top: 0, right: 0, bottom: 0, left: 0 }

/** Bounding box of an SVG path made of M/L/H/V/A/Z commands (absolute or relative). */
const bbox = (d: string) => {
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

const settle = async () => {
  await flushPromises()
  await nextTick()
}

const hover = async (
  wrapper: { find: (s: string) => { element: Element } },
  clientX: number,
  clientY: number,
) => {
  wrapper
    .find('[data-slot=chart-surface]')
    .element.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY, bubbles: true }))
  await settle()
}

const data = [
  { month: 'Jan', revenue: 100, orders: 1, views: 50 },
  { month: 'Feb', revenue: 200, orders: 2, views: 100 },
]

const mountChart = (children: () => Array<VNode | null>) => {
  return mount(ComposedChart, {
    props: { data, width: WIDTH, height: HEIGHT, margin },
    slots: { default: children },
    attachTo: document.body,
  })
}

describe('ComposedChart', () => {
  it('stacks bars and areas that share a stackId', async () => {
    const wrapper = mountChart(() => [
      h(ChartXAxis, { dataKey: 'month', hide: true }),
      h(ChartBar, { dataKey: 'revenue', stackId: 'a', barSize: 16, isAnimationActive: false }),
      h(ChartArea, { dataKey: 'views', stackId: 'a', isAnimationActive: false }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    // Totals 150 and 300 -> domain [0, 300]. The Feb bar (200) ends at 200 - 200 * 200 / 300.
    const bar = bbox(wrapper.findAll('[data-slot=chart-bar-rectangle]')[1].attributes('d')!)
    expect(bar.y).toBeCloseTo(66.667, 2)
    // The area sits on the bar: its Feb top is the stack total, 300, the top of the plot.
    await hover(wrapper, 300, 100)
    expect(Number(wrapper.find('[data-slot=chart-active-dot]').attributes('cy'))).toBeCloseTo(0)
    // The cursor follows the chart type, not the band scale: a ComposedChart draws a dashed line.
    const cursor = wrapper.find('[data-slot=chart-cursor]')
    expect(cursor.attributes('data-kind')).toBe('line')
    expect(cursor.attributes('d')).toBe('M300,0L300,200')
    wrapper.unmount()
  })

  it('keeps template order when a series is shown again', async () => {
    const showRevenue = ref(true)
    const wrapper = mountChart(() => [
      h(ChartXAxis, { dataKey: 'month', hide: true }),
      showRevenue.value
        ? h(ChartLine, {
            dataKey: 'revenue',
            name: 'Revenue',
            dot: false,
            isAnimationActive: false,
          })
        : null,
      h(ChartLine, { dataKey: 'orders', name: 'Orders', dot: false, isAnimationActive: false }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    const labels = () =>
      wrapper.findAll('[data-slot=chart-tooltip-label]').map((label) => label.text())
    await hover(wrapper, 100, 100)
    expect(labels()).toEqual(['Revenue', 'Orders'])
    showRevenue.value = false
    await settle()
    expect(labels()).toEqual(['Orders'])
    showRevenue.value = true
    await settle()
    await hover(wrapper, 110, 100)
    expect(labels()).toEqual(['Revenue', 'Orders'])
    wrapper.unmount()
  })

  it('skips rows without a value on a number x axis', async () => {
    const wrapper = mount(ComposedChart, {
      // x domain: nice ticks 0, 3, ..., 12.
      props: {
        data: [{ x: 0, y: 1 }, { y: 2 }, { x: 12, y: 3 }],
        width: WIDTH,
        height: HEIGHT,
        margin,
      },
      slots: {
        default: () => [
          h(ChartXAxis, { dataKey: 'x', type: 'number', hide: true }),
          h(ChartLine, { dataKey: 'y', dot: true, isAnimationActive: false }),
        ],
      },
      attachTo: document.body,
    })
    await settle()
    expect(
      wrapper.findAll('[data-slot=chart-dot]').map((dot) => Number(dot.attributes('cx'))),
    ).toEqual([0, 400])
    wrapper.unmount()
  })

  it('renders bar, line and area series together', async () => {
    const wrapper = mountChart(() => [
      h(ChartArea, { dataKey: 'views', isAnimationActive: false }),
      h(ChartBar, { dataKey: 'revenue', barSize: 16, isAnimationActive: false }),
      h(ChartLine, { dataKey: 'orders', dot: false, isAnimationActive: false }),
    ])
    await settle()
    expect(wrapper.findAll('[data-slot=chart-bar-rectangle]')).toHaveLength(2)
    expect(wrapper.find('[data-slot=chart-line-curve]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=chart-area-fill]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('centers line points on the bar bands when bars are present', async () => {
    const wrapper = mountChart(() => [
      h(ChartBar, { dataKey: 'revenue', barSize: 16, isAnimationActive: false }),
      h(ChartLine, { dataKey: 'orders', type: 'linear', dot: { r: 3 }, isAnimationActive: false }),
    ])
    await settle()
    const bar = wrapper.findAll('[data-slot=chart-bar-rectangle]')[0]
    const box = bbox(bar.attributes('d')!)
    const dot = wrapper.findAll('[data-slot=chart-dot]')[0]
    expect(Number(dot.attributes('cx'))).toBeCloseTo(box.x + box.width / 2)
    wrapper.unmount()
  })

  it('plots series against their own y-axis', async () => {
    const wrapper = mountChart(() => [
      h(ChartYAxis, { yAxisId: 'left', hide: true }),
      h(ChartYAxis, { yAxisId: 'right', orientation: 'right', hide: true }),
      h(ChartBar, { dataKey: 'revenue', yAxisId: 'left', barSize: 16, isAnimationActive: false }),
      h(ChartLine, {
        dataKey: 'orders',
        yAxisId: 'right',
        type: 'linear',
        dot: { r: 3 },
        isAnimationActive: false,
      }),
    ])
    await settle()
    // Both maxima (200 on the left, 2 on the right) reach the top of the plot.
    const bar = wrapper.findAll('[data-slot=chart-bar-rectangle]')[1]
    const box = bbox(bar.attributes('d')!)
    const dot = wrapper.findAll('[data-slot=chart-dot]')[1]
    expect(box.y).toBeCloseTo(0)
    expect(Number(dot.attributes('cy'))).toBeCloseTo(0)
    wrapper.unmount()
  })

  it('leaves series with tooltip-type="none" out of the tooltip', async () => {
    const wrapper = mountChart(() => [
      h(ChartXAxis, { dataKey: 'month', hide: true }),
      h(ChartBar, { dataKey: 'revenue', name: 'Revenue', isAnimationActive: false }),
      h(ChartLine, { dataKey: 'orders', name: 'Orders', dot: false, isAnimationActive: false }),
      h(ChartArea, {
        dataKey: 'views',
        name: 'Views',
        tooltipType: 'none',
        isAnimationActive: false,
      }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    await hover(wrapper, 100, 100)
    const panel = wrapper.find('[data-slot=chart-tooltip]')
    expect(panel.find('[data-slot=chart-tooltip-header]').text()).toBe('Jan')
    expect(panel.findAll('[data-slot=chart-tooltip-label]').map((label) => label.text())).toEqual([
      'Revenue',
      'Orders',
    ])
    expect(panel.findAll('[data-slot=chart-tooltip-value]').map((value) => value.text())).toEqual([
      '100',
      '1',
    ])
    wrapper.unmount()
  })

  it('walks the months with the keyboard and announces every series kind', async () => {
    const wrapper = mountChart(() => [
      h(ChartXAxis, { dataKey: 'month', hide: true }),
      h(ChartArea, { dataKey: 'views', name: 'Views', isAnimationActive: false }),
      h(ChartBar, { dataKey: 'revenue', name: 'Revenue', isAnimationActive: false }),
      h(ChartLine, { dataKey: 'orders', name: 'Orders', dot: false, isAnimationActive: false }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    const header = () => wrapper.find('[data-slot=chart-tooltip-header]').text()
    ;(svg.element as SVGElement).focus()
    await settle()
    expect(header()).toBe('Jan')
    expect(wrapper.findAll('[data-slot=chart-tooltip-label]').map((label) => label.text())).toEqual(
      ['Views', 'Revenue', 'Orders'],
    )
    await svg.trigger('keydown', { key: 'End' })
    await settle()
    expect(header()).toBe('Feb')
    await svg.trigger('keydown', { key: 'Home' })
    await settle()
    expect(header()).toBe('Jan')
    wrapper.unmount()
  })

  it('is accessible idle and with a month focused', async () => {
    const wrapper = mount(ComposedChart, {
      props: {
        data: data,
        index: 'month',
        series: {
          revenue: { type: 'bar' },
          orders: { type: 'line', yAxis: 'right' },
          views: { type: 'area' },
        },
        width: WIDTH,
        height: HEIGHT,
        legend: true,
        'aria-label': 'Revenue, orders and views per month',
      },
      attachTo: document.body,
    })
    await settle()
    await expectAccessible(wrapper)
    ;(wrapper.find('[data-slot=chart-surface]').element as SVGElement).focus()
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe('open')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
