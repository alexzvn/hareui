import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import AreaChart from '../src/components/area-chart/AreaChart.vue'
import BarChart from '../src/components/bar-chart/BarChart.vue'
import ChartArea from '../src/components/chart/ChartArea.vue'
import ChartXAxis from '../src/components/chart/ChartXAxis.vue'
import ChartYAxis from '../src/components/chart/ChartYAxis.vue'
import ComposedChart from '../src/components/composed-chart/ComposedChart.vue'
import LineChart from '../src/components/line-chart/LineChart.vue'

const WIDTH = 400
const HEIGHT = 200
const margin = { top: 0, right: 0, bottom: 0, left: 0 }
// Axes, grid and tooltip off: the plot box is the whole chart.
const bare = { xAxis: false, yAxis: false, grid: false }

const data = [
  { month: 'Jan', organic: 0, paid: 10 },
  { month: 'Feb', organic: 10, paid: 10 },
  { month: 'Mar', organic: 20, paid: 0 },
]

async function settle() {
  await flushPromises()
  await nextTick()
}

function mountRoot(component: any, props: Record<string, unknown>, slots: Record<string, any> = {}) {
  return mount(component, {
    props: { data, width: WIDTH, height: HEIGHT, margin, ...props },
    slots,
    attachTo: document.body,
  })
}

async function hover(wrapper: { find: (selector: string) => { element: Element } }, clientX: number, clientY = 100) {
  wrapper.find('[data-slot=chart-surface]').element.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY, bubbles: true }))
  await settle()
}

describe('cartesian roots drawn from props', () => {
  // Reduced motion: series draw their final geometry at once.
  beforeEach(() => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {} }))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('draws grid, axes, tooltip and one gradient area per numeric key', async () => {
    const wrapper = mountRoot(AreaChart, { index: 'month' })
    await settle()
    expect(wrapper.findAll('[data-slot=chart-grid-line]').length).toBeGreaterThan(0)
    expect(wrapper.find('[data-slot=chart-x-axis]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=chart-y-axis]').exists()).toBe(true)
    expect(wrapper.findAll('[data-slot=chart-x-axis] [data-slot=chart-tick]').map(tick => tick.text())).toEqual(['Jan', 'Feb', 'Mar'])
    const areas = wrapper.findAll('[data-slot=chart-area]')
    expect(areas.map(area => area.attributes('data-key'))).toEqual(['organic', 'paid'])
    // Palette by position; the fill is a gradient of the series color.
    expect(wrapper.findAll('[data-slot=chart-area-curve]').map(curve => curve.attributes('stroke'))).toEqual(['var(--chart-3)', 'var(--chart-1)'])
    const fill = areas[0]!.find('[data-slot=chart-area-fill]')
    expect(fill.attributes('fill')).toMatch(/^url\(#.+\)$/)
    const gradientId = fill.attributes('fill')!.slice(5, -1)
    const stops = wrapper.findAll(`linearGradient[id="${gradientId}"] stop`)
    expect(stops.map(stop => [stop.attributes('stop-color'), stop.attributes('stop-opacity')])).toEqual([['var(--chart-3)', '0.2'], ['var(--chart-3)', '0.02']])
    await hover(wrapper, 200)
    expect(wrapper.find('[data-slot=chart-tooltip-header]').text()).toBe('Feb')
    wrapper.unmount()
  })

  it('fills areas flat, not at all, or with a custom fill at full opacity', async () => {
    const wrapper = mountRoot(AreaChart, {
      ...bare,
      series: { organic: { fill: 'solid' }, paid: { fill: 'url(#mine)' } },
    })
    await settle()
    const fills = () => wrapper.findAll('[data-slot=chart-area-fill]').map(path => [path.attributes('fill'), path.attributes('fill-opacity')])
    // 'solid' uses the top opacity of the default pair; the custom gradient carries its own opacity.
    expect(fills()).toEqual([['var(--chart-3)', '0.2'], ['url(#mine)', '1']])
    await wrapper.setProps({ fillOpacity: 0.5 })
    await settle()
    expect(fills()).toEqual([['var(--chart-3)', '0.5'], ['url(#mine)', '0.5']])
    await wrapper.setProps({ fill: 'none', series: ['organic'] })
    await settle()
    expect(wrapper.find('[data-slot=chart-area-fill]').attributes('fill')).toBe('none')
    wrapper.unmount()
  })

  it('draws a sparkline without axes, grid or tooltip, under a 2px top margin', async () => {
    const wrapper = mount(AreaChart, {
      props: { data, width: WIDTH, height: HEIGHT, sparkline: true, series: { organic: { curve: 'linear' } } },
      attachTo: document.body,
    })
    await settle()
    expect(wrapper.find('[data-slot=chart-x-axis]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chart-y-axis]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chart-grid]').exists()).toBe(false)
    const curve = wrapper.find('[data-slot=chart-area-curve]')
    // y domain [0, 20] over the plot from y=2 to y=200.
    expect(curve.attributes('d')).toBe('M0,200L200,101L400,2')
    expect(curve.attributes('stroke-width')).toBe('1.5')
    await hover(wrapper, 200)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('heads a sparkline tooltip with the index value, though no x axis is drawn', async () => {
    const wrapper = mountRoot(LineChart, { sparkline: true, index: 'month', series: ['organic'], tooltip: { cursor: false, panel: false } })
    await settle()
    expect(wrapper.find('[data-slot=chart-x-axis]').exists()).toBe(false)
    await hover(wrapper, 200)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toMatch(/^Feb/)
    wrapper.unmount()
  })

  it('toggles series from the legend through v-model:hidden', async () => {
    const wrapper = mountRoot(LineChart, { ...bare, index: 'month', legend: true, series: ['organic', 'paid'] })
    await settle()
    const legend = wrapper.find('[data-slot=chart-legend]')
    expect(legend.findAll('[data-slot=chart-legend-label]').map(label => label.text())).toEqual(['organic', 'paid'])
    // The legend sits under the plot, outside the svg.
    expect(wrapper.find('[data-slot=chart-plot]').element.nextElementSibling).toBe(legend.element)
    await legend.findAll('[data-slot=chart-legend-trigger]')[1]!.trigger('click')
    expect(wrapper.emitted('update:hidden')?.at(-1)).toEqual([['paid']])
    await wrapper.setProps({ hidden: ['paid'] })
    await settle()
    expect(wrapper.findAll('[data-slot=chart-line]').map(line => line.attributes('data-key'))).toEqual(['organic'])
    expect(wrapper.findAll('[data-slot=chart-legend-item]')[1]!.attributes('data-hidden')).toBe('true')
    expect(wrapper.findAll('[data-slot=chart-legend-trigger]')[1]!.attributes('aria-pressed')).toBe('false')
    wrapper.unmount()
  })

  it('formats tooltip values per series, then with the root formatter and the series key', async () => {
    const wrapper = mountRoot(AreaChart, {
      ...bare,
      index: 'month',
      series: { organic: { name: 'Organic', valueFormatter: (value: number) => `${value} visits` }, paid: { name: 'Paid' } },
      valueFormatter: (value: number, key: string) => `${key}=${value}`,
    })
    await settle()
    await hover(wrapper, 200)
    const panel = wrapper.find('[data-slot=chart-tooltip]')
    expect(panel.findAll('[data-slot=chart-tooltip-label]').map(label => label.text())).toEqual(['Organic', 'Paid'])
    expect(panel.findAll('[data-slot=chart-tooltip-value]').map(value => value.text())).toEqual(['10 visits', 'paid=10'])
    wrapper.unmount()
  })

  it('forwards the tooltip-footer and x-tick slots to the generated parts', async () => {
    // The y axis keeps the first category label clear of the left edge, so no tick is thinned out.
    const wrapper = mountRoot(AreaChart, { grid: false, index: 'month' }, {
      'tooltip-footer': ({ label, payload }: { label?: string, payload: Array<{ value: number }> }) =>
        h('p', { 'data-test': 'footer' }, `${label}: ${payload.reduce((sum, entry) => sum + Number(entry.value), 0)}`),
      'x-tick': ({ x, y, text }: { x: number, y: number, text: string }) => h('text', { 'x': x, 'y': y, 'data-test': 'tick' }, text.toUpperCase()),
    })
    await settle()
    expect(wrapper.findAll('[data-test=tick]').map(tick => tick.text())).toEqual(['JAN', 'FEB', 'MAR'])
    await hover(wrapper, 200, 50)
    expect(wrapper.find('[data-test=footer]').text()).toBe('Feb: 20')
    wrapper.unmount()
  })

  it('gives hand-placed parts the root index and series config', async () => {
    const wrapper = mountRoot(AreaChart, { xAxis: false, grid: false, tooltip: false, index: 'month', series: { organic: { color: 'red' } } }, {
      default: () => [h(ChartXAxis)],
    })
    await settle()
    // The slotted axis has no dataKey: it reads the categories from `index`.
    expect(wrapper.findAll('[data-slot=chart-x-axis] [data-slot=chart-tick]').map(tick => tick.text())).toEqual(['Jan', 'Feb', 'Mar'])
    wrapper.unmount()

    const composed = mountRoot(ComposedChart, { ...bare, tooltip: false, index: 'month', series: { organic: { type: 'line', color: 'red' } } }, {
      default: () => [h(ChartArea, { dataKey: 'organic', isAnimationActive: false })],
    })
    await settle()
    expect(composed.find('[data-slot=chart-area-curve]').attributes('stroke')).toBe('red')
    composed.unmount()
  })

  it('warns in development when a generated axis is also slotted', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountRoot(AreaChart, { index: 'month' }, { default: () => [h(ChartXAxis, { dataKey: 'month' })] })
    await settle()
    expect(warn.mock.calls.some(([message]) => String(message).includes('Two x axes'))).toBe(true)
    wrapper.unmount()
  })

  it('rounds only the outer end of the top bar of a stack', async () => {
    const wrapper = mountRoot(BarChart, { ...bare, index: 'month', stacked: true, series: ['organic', 'paid'] })
    await settle()
    const paths = (key: string) => wrapper.findAll(`[data-slot=chart-bar][data-key=${key}] [data-slot=chart-bar-rectangle]`).map(bar => bar.attributes('d')!)
    expect(paths('organic').every(d => !d.includes('A'))).toBe(true)
    expect(paths('paid').filter(d => d.includes('A')).length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('picks the part of each ComposedChart series from its type', async () => {
    const wrapper = mountRoot(ComposedChart, { ...bare, index: 'month', series: { organic: { type: 'bar' }, paid: { type: 'line' } } })
    await settle()
    expect(wrapper.find('[data-slot=chart-bar][data-key=organic]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=chart-line][data-key=paid]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('fits an auto-width y axis to its widest tick label', async () => {
    const wrapper = mountRoot(AreaChart, {}, {
      default: () => [
        h(ChartYAxis, { width: 'auto' }),
        h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
      ],
    })
    await settle()
    // No canvas in jsdom: "20" measures 2 × 10px × 0.6 = 12px, plus 8px tick size and margin.
    expect(wrapper.find('[data-slot=chart-area-curve]').attributes('d')).toBe('M20,200L210,100L400,0')
    wrapper.unmount()
  })
})
