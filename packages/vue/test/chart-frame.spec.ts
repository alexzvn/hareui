import { flushPromises, mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import { h, nextTick } from 'vue'

import BarChart from '@/components/bar-chart/BarChart.vue'
import ChartLabel from '@/components/chart/ChartLabel.vue'
import ChartPie from '@/components/chart/ChartPie.vue'
import type { ChartTooltipSlotProps } from '@/components/chart/ChartTooltip.vue'
import { resolveFrameLegend } from '@/components/chart/frame'
import { percentValue } from '@/components/chart/percent'
import { resolvePolarGeometry } from '@/components/chart/polar'
import LineChart from '@/components/line-chart/LineChart.vue'
import PieChart from '@/components/pie-chart/PieChart.vue'
import RadarChart from '@/components/radar-chart/RadarChart.vue'
import RadialChart from '@/components/radial-chart/RadialChart.vue'

// 200 × 200 without margins: polar center (100, 100), percentages of a 100px radius.
const SIZE = 200
const margin = { top: 0, right: 0, bottom: 0, left: 0 }

async function settle() {
  await flushPromises()
  await nextTick()
}

const sessions = [
  { month: 'Jan', organic: 1, paid: 2 },
  { month: 'Feb', organic: 3, paid: 4 },
]

type FrameCase = {
  name: string
  component: Component
  props: Record<string, unknown>
  /** Legend keys, in order. */
  keys: string[]
  /** Selector of one drawn series (or slice) per legend key. */
  series: string
}

const cases: FrameCase[] = [
  {
    name: 'LineChart',
    component: LineChart,
    props: { data: sessions, index: 'month' },
    keys: ['organic', 'paid'],
    series: '[data-slot=chart-line]',
  },
  {
    name: 'BarChart',
    component: BarChart,
    props: { data: sessions, index: 'month' },
    keys: ['organic', 'paid'],
    series: '[data-slot=chart-bar]',
  },
  {
    name: 'PieChart',
    component: PieChart,
    props: {
      data: [
        { name: 'Chrome', visits: 1 },
        { name: 'Safari', visits: 3 },
      ],
      index: 'name',
    },
    keys: ['Chrome', 'Safari'],
    series: '[data-slot=chart-pie-sector]',
  },
  {
    name: 'RadarChart',
    component: RadarChart,
    props: {
      data: [
        { category: 'N', score: 100, other: 50 },
        { category: 'E', score: 50, other: 50 },
        { category: 'S', score: 100, other: 50 },
      ],
      index: 'category',
    },
    keys: ['score', 'other'],
    series: '[data-slot=chart-radar]',
  },
  {
    name: 'RadialChart',
    component: RadialChart,
    props: {
      data: [
        { name: 'Move', value: 40 },
        { name: 'Exercise', value: 80 },
      ],
      index: 'name',
    },
    keys: ['Move', 'Exercise'],
    series: '[data-slot=chart-radial-bar-sector]',
  },
]

describe('chart frame', () => {
  // No tweens: shapes land on their final geometry at once.
  beforeAll(() => vi.stubGlobal('matchMedia', () => ({ matches: true })))
  afterAll(() => vi.unstubAllGlobals())

  describe.each(cases)('$name', ({ component, props, keys, series }) => {
    function mountChart(extra: Record<string, unknown> = {}, slots: Record<string, any> = {}) {
      return mount(component, {
        props: { width: SIZE, height: SIZE, margin, ...props, ...extra },
        slots,
        attachTo: document.body,
      })
    }

    it('hides and shows a series from its legend item, emitting update:hidden', async () => {
      const wrapper = mountChart({ legend: true })
      await settle()
      expect(wrapper.attributes('data-legend')).toBe('bottom')
      expect(wrapper.findAll('[data-slot=chart-legend-item]').map((item) => item.text())).toEqual(
        keys,
      )
      expect(wrapper.findAll(series)).toHaveLength(2)

      await wrapper.findAll('[data-slot=chart-legend-trigger]')[0]!.trigger('click')
      await settle()
      expect(wrapper.emitted('update:hidden')?.[0]).toEqual([[keys[0]]])
      expect(wrapper.findAll(series)).toHaveLength(1)
      expect(wrapper.findAll('[data-slot=chart-legend-item]')[0]!.attributes('data-hidden')).toBe(
        'true',
      )

      await wrapper.findAll('[data-slot=chart-legend-trigger]')[0]!.trigger('click')
      await settle()
      expect(wrapper.emitted('update:hidden')?.[1]).toEqual([[]])
      expect(wrapper.findAll(series)).toHaveLength(2)
      wrapper.unmount()
    })

    it('puts a legend slot alone at the bottom, with a toggle', async () => {
      const wrapper = mountChart(
        {},
        {
          legend: (p: { items: Array<{ key: string }>; toggle: (key: string) => void }) =>
            h(
              'button',
              { 'data-test': 'legend', onClick: () => p.toggle(keys[1]!) },
              p.items.map((item) => item.key).join(','),
            ),
        },
      )
      await settle()
      expect(wrapper.attributes('data-legend')).toBe('bottom')
      expect(wrapper.find('[data-slot=chart-legend]').exists()).toBe(false)
      expect(wrapper.find('[data-test=legend]').text()).toBe(keys.join(','))
      await wrapper.find('[data-test=legend]').trigger('click')
      expect(wrapper.emitted('update:hidden')?.[0]).toEqual([[keys[1]]])
      wrapper.unmount()
    })

    it('forwards the tooltip and tooltip-footer slots', async () => {
      const custom = mountChart(
        {},
        {
          tooltip: (p: ChartTooltipSlotProps) =>
            h('span', { 'data-test': 'tip' }, `rows:${p.payload.length}`),
        },
      )
      await settle()
      ;(custom.find('[data-slot=chart-surface]').element as SVGElement).focus()
      await settle()
      expect(custom.find('[data-test=tip]').text()).toMatch(/^rows:[1-9]/)
      custom.unmount()

      const footer = mountChart(
        {},
        {
          'tooltip-footer': (p: { payload: unknown[] }) =>
            h('span', { 'data-test': 'footer' }, `rows:${p.payload.length}`),
        },
      )
      await settle()
      ;(footer.find('[data-slot=chart-surface]').element as SVGElement).focus()
      await settle()
      expect(footer.find('[data-test=footer]').text()).toMatch(/^rows:[1-9]/)
      footer.unmount()
    })
  })

  describe('pie center', () => {
    const data = [
      { name: 'Chrome', value: 1 },
      { name: 'Safari', value: 3 },
    ]
    const pie = (props: Record<string, unknown>) =>
      h(ChartPie, { data, dataKey: 'value', isAnimationActive: false, ...props })

    function mountPies(pies: () => any[]) {
      return mount(PieChart, {
        props: { width: SIZE, height: SIZE, margin },
        slots: {
          default: () => [...pies(), h(ChartLabel, { value: 'mid', position: 'center' })],
          center: (p: { total: number }) => h('span', { 'data-test': 'center' }, String(p.total)),
        },
        attachTo: document.body,
      })
    }

    it('keeps the #center slot and a centered ChartLabel on a composed pie moved by cx/cy', async () => {
      const wrapper = mountPies(() => [pie({ cx: '30%', cy: 120, outerRadius: 50 })])
      await settle()
      expect(wrapper.find('[data-slot=chart-pie-sector]').attributes('transform')).toBe(
        'translate(60, 120)',
      )
      const center = wrapper.find('[data-slot=chart-center]')
      expect(center.attributes('style')).toContain('left: 60px')
      expect(center.attributes('style')).toContain('top: 120px')
      expect(wrapper.find('[data-test=center]').text()).toBe('4')
      const label = wrapper.findAll('text').find((text) => text.text() === 'mid')
      expect(label?.attributes('x')).toBe('60')
      expect(label?.attributes('y')).toBe('120')
      wrapper.unmount()
    })

    it('centers on the first registered pie when several are drawn', async () => {
      const wrapper = mountPies(() => [
        pie({ cx: '30%', outerRadius: 40 }),
        pie({ cx: '70%', outerRadius: 40 }),
      ])
      await settle()
      expect(wrapper.find('[data-slot=chart-center]').attributes('style')).toContain('left: 60px')
      const label = wrapper.findAll('text').find((text) => text.text() === 'mid')
      expect(label?.attributes('x')).toBe('60')
      wrapper.unmount()
    })
  })
})

describe('resolveFrameLegend', () => {
  const format = (value: number) => `#${value}`

  it('has no legend without the prop or a legend slot', () => {
    expect(resolveFrameLegend(undefined, false)).toBeNull()
    expect(resolveFrameLegend(false, false)).toBeNull()
  })

  it('puts a legend slot alone at the bottom', () => {
    expect(resolveFrameLegend(undefined, true, { valueFormatter: format })).toEqual({
      position: 'bottom',
      props: { valueFormatter: format },
    })
  })

  it('takes the position from the prop, over the slot default', () => {
    expect(resolveFrameLegend('left', true)?.position).toBe('left')
    expect(resolveFrameLegend(true, false)?.position).toBe('bottom')
    expect(resolveFrameLegend({ showValue: true }, false)).toEqual({
      position: 'bottom',
      props: { showValue: true },
    })
  })

  it("lets the prop's own legend props win over the root defaults", () => {
    const own = (value: number) => `${value}!`
    expect(
      resolveFrameLegend({ position: 'right', valueFormatter: own }, false, {
        valueFormatter: format,
        showValue: true,
      }),
    ).toEqual({ position: 'right', props: { valueFormatter: own, showValue: true } })
  })
})

describe('resolvePolarGeometry', () => {
  const box = { left: 10, top: 20, width: 200, height: 100 }

  it('defaults to the box middle and 80% of half the shorter side', () => {
    expect(resolvePolarGeometry(box, {})).toEqual({
      cx: 110,
      cy: 70,
      innerRadius: 0,
      outerRadius: 40,
    })
  })

  it('reads centers against the box sides and radii against half the shorter side', () => {
    expect(
      resolvePolarGeometry(box, { cx: '25%', cy: 30, innerRadius: '50%', outerRadius: 45 }),
    ).toEqual({ cx: 60, cy: 50, innerRadius: 25, outerRadius: 45 })
  })

  it('falls back to the defaults on unparsable values', () => {
    expect(resolvePolarGeometry(box, { cx: 'abc', outerRadius: 'x%' })).toEqual({
      cx: 110,
      cy: 70,
      innerRadius: 0,
      outerRadius: 40,
    })
  })
})

describe('percentValue', () => {
  it('reads px numbers, numeric strings and percentages of the total', () => {
    expect(percentValue(12, 80)).toBe(12)
    expect(percentValue(' 12 ', 80)).toBe(12)
    expect(percentValue('25%', 80)).toBe(20)
    expect(percentValue(undefined, 80, 7)).toBe(7)
    expect(percentValue(null, 80, 7)).toBe(7)
    expect(percentValue('', 80, 7)).toBe(7)
  })

  it('falls back on non-finite input unless keepNonFinite is set (cartesian bar layout)', () => {
    expect(percentValue(Number.POSITIVE_INFINITY, 80, 7)).toBe(7)
    expect(percentValue(Number.POSITIVE_INFINITY, 80, 7, { keepNonFinite: true })).toBe(
      Number.POSITIVE_INFINITY,
    )
    expect(percentValue('abc%', 80, 7)).toBe(7)
    expect(percentValue('abc%', 80, 7, { keepNonFinite: true })).toBeNaN()
    // A plain string that isn't a number falls back either way.
    expect(percentValue('abc', 80, 7, { keepNonFinite: true })).toBe(7)
  })
})
