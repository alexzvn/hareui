import type { ChartTooltipSlotProps } from '../src/components/chart/ChartTooltip.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import ChartCell from '../src/components/chart/ChartCell.vue'
import ChartLabel from '../src/components/chart/ChartLabel.vue'
import ChartPie from '../src/components/chart/ChartPie.vue'
import ChartTooltip from '../src/components/chart/ChartTooltip.vue'
import { percentValue } from '../src/components/chart/percent'
import { cartesianToPolar, computePieSectors, deltaAngle, sectorPath } from '../src/components/chart/polar'
import PieChart from '../src/components/pie-chart/PieChart.vue'
import { expectAccessible } from './a11y'

// 200 × 200 without margins: center (100, 100), percentages of a 100px radius.
const SIZE = 200
const margin = { top: 0, right: 0, bottom: 0, left: 0 }

const data = [
  { name: 'Chrome', value: 1 },
  { name: 'Safari', value: 3 },
]

async function settle() {
  await flushPromises()
  await nextTick()
}

function mountChart(children: () => any[], props: Record<string, unknown> = {}) {
  return mount(PieChart, {
    props: { width: SIZE, height: SIZE, margin, ...props },
    slots: { default: children },
    attachTo: document.body,
  })
}

const pie = (props: Record<string, unknown> = {}, cells?: () => any[]) =>
  h(ChartPie, { data, dataKey: 'value', outerRadius: 100, isAnimationActive: false, ...props }, cells ? { default: cells } : undefined)

// Moves the pointer over the chart to a polar position around (100, 100). jsdom boxes sit at 0,0, so client = SVG coordinates.
async function hoverAt(wrapper: ReturnType<typeof mountChart>, radius: number, angle: number) {
  const clientX = 100 + radius * Math.cos((angle * Math.PI) / 180)
  const clientY = 100 - radius * Math.sin((angle * Math.PI) / 180)
  wrapper.find('[data-slot=chart-surface]').element.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY, bubbles: true }))
  await settle()
}

describe('polar geometry', () => {
  it('resolves percentages against a total', () => {
    expect(percentValue('80%', 100)).toBe(80)
    expect(percentValue(30, 100)).toBe(30)
    expect(percentValue('40', 100)).toBe(40)
    expect(percentValue(undefined, 100, 7)).toBe(7)
  })

  it('caps the sweep at one turn and keeps its direction', () => {
    expect(deltaAngle(0, 360)).toBe(360)
    expect(deltaAngle(90, -270)).toBe(-360)
    expect(deltaAngle(0, 720)).toBe(360)
    expect(deltaAngle(225, -45)).toBe(-270)
  })

  it('converts points to radius and angle (0° at 3 o\'clock, counter-clockwise)', () => {
    expect(cartesianToPolar(100, 100, 100, 20)).toEqual({ radius: 80, angle: 90 })
    expect(cartesianToPolar(100, 100, 150, 100)).toEqual({ radius: 50, angle: 0 })
    expect(cartesianToPolar(100, 100, 100, 160).angle).toBe(-90)
  })

  it('splits a full pie by value, counter-clockwise from the start angle', () => {
    const sectors = computePieSectors([1, 3], { cx: 0, cy: 0, innerRadius: 0, outerRadius: 100, startAngle: 0, endAngle: 360 })
    expect(sectors.map(s => [s.startAngle, s.endAngle])).toEqual([[0, 90], [90, 360]])
    expect(sectors.map(s => s.percent)).toEqual([0.25, 0.75])
    expect(sectors[0]!.midAngle).toBe(45)
    expect(sectors[0]!.tooltipPosition.x).toBeCloseTo(Math.SQRT1_2 * 50)
    expect(sectors[0]!.tooltipPosition.y).toBeCloseTo(-Math.SQRT1_2 * 50)
  })

  it('leaves padding between slices, also between the last and the first one of a full pie', () => {
    const sectors = computePieSectors([1, 1], { cx: 0, cy: 0, innerRadius: 0, outerRadius: 1, startAngle: 0, endAngle: 360, paddingAngle: 10 })
    expect(sectors.map(s => [s.startAngle, s.endAngle])).toEqual([[0, 170], [180, 350]])
  })

  it('overlaps slices with a negative padding angle', () => {
    const sectors = computePieSectors([1, 1], { cx: 0, cy: 0, innerRadius: 0, outerRadius: 1, startAngle: 0, endAngle: 360, paddingAngle: -20 })
    expect(sectors.map(s => [s.startAngle, s.endAngle])).toEqual([[0, 200], [180, 380]])
  })

  it('gives small slices their minimum angle', () => {
    const sectors = computePieSectors([1, 99], { cx: 0, cy: 0, innerRadius: 0, outerRadius: 1, startAngle: 0, endAngle: 360, minAngle: 10 })
    expect(sectors[0]!.endAngle).toBeCloseTo(13.4)
    expect(sectors[1]!.endAngle).toBeCloseTo(360)
  })

  it('runs clockwise when the end angle is below the start angle (half pie)', () => {
    const sectors = computePieSectors([1, 1], { cx: 0, cy: 0, innerRadius: 0, outerRadius: 1, startAngle: 180, endAngle: 0 })
    expect(sectors.map(s => [s.startAngle, s.endAngle])).toEqual([[180, 90], [90, 0]])
  })

  it('returns no slices when the values sum to zero', () => {
    expect(computePieSectors([0, 0], { cx: 0, cy: 0, innerRadius: 0, outerRadius: 1, startAngle: 0, endAngle: 360 })).toEqual([])
  })

  it('draws sectors relative to their center, with corners capped at half the ring', () => {
    const quarter = sectorPath({ innerRadius: 0, outerRadius: 100, startAngle: 0, endAngle: 90 })
    expect(quarter.startsWith('M100,0A100,100,0,0,0,')).toBe(true)
    expect(quarter.endsWith('L0,0Z')).toBe(true)

    const rounded = sectorPath({ innerRadius: 40, outerRadius: 50, startAngle: 90, endAngle: 0, cornerRadius: 12 })
    expect(rounded).toContain('A5,5')
    expect(rounded).not.toContain('A12,12')

    const ring = sectorPath({ innerRadius: 40, outerRadius: 50, startAngle: 90, endAngle: -270, cornerRadius: 12 })
    expect(ring).toContain('A50,50')
    expect(ring).toContain('A40,40')
    expect(ring).not.toContain('A5,5')

    expect(sectorPath({ innerRadius: 0, outerRadius: 50, startAngle: 30, endAngle: 30 })).toBe('')
  })
})

describe('PieChart', () => {
  it('renders the root with data-slot and the default height', () => {
    const wrapper = mount(PieChart)
    expect(wrapper.attributes('data-slot')).toBe('pie-chart')
    expect(wrapper.attributes('style')).toContain('height: 300px')
    wrapper.unmount()
  })

  it('draws one sector per datum around the chart center', async () => {
    const wrapper = mountChart(() => [pie()])
    await settle()
    const sectors = wrapper.findAll('[data-slot=chart-pie-sector]')
    expect(sectors).toHaveLength(2)
    expect(sectors[0]!.attributes('transform')).toBe('translate(100, 100)')
    expect(sectors[0]!.attributes('data-index')).toBe('0')
    // Chrome: 0° → 90°, from 3 o'clock up to 12 o'clock.
    expect(sectors[0]!.attributes('d')!.startsWith('M100,0A100,100,0,0,0,')).toBe(true)
    expect(sectors[0]!.attributes('fill')).toBe('var(--chart-3)')
    expect(sectors[0]!.attributes('stroke')).toBeUndefined()
    wrapper.unmount()
  })

  it('resolves percentage radii against half the shorter side', async () => {
    const wrapper = mountChart(() => [pie({ innerRadius: '50%', outerRadius: '80%' })], { width: 300 })
    await settle()
    const d = wrapper.find('[data-slot=chart-pie-sector]').attributes('d')!
    expect(d).toContain('A80,80')
    expect(d).toContain('A50,50')
    expect(wrapper.find('[data-slot=chart-pie-sector]').attributes('transform')).toBe('translate(150, 100)')
    wrapper.unmount()
  })

  it('colors slices with ChartCell, then the datum fill, then the pie fill', async () => {
    const rows = [
      { name: 'A', value: 1 },
      { name: 'B', value: 1, fill: 'green' },
      { name: 'C', value: 1 },
    ]
    const wrapper = mountChart(() => [
      pie({ data: rows, fill: 'gray' }, () => [h(ChartCell, { fill: 'red' })]),
    ])
    await settle()
    const fills = wrapper.findAll('[data-slot=chart-pie-sector]').map(sector => sector.attributes('fill'))
    expect(fills).toEqual(['red', 'green', 'gray'])
    wrapper.unmount()
  })

  it('shows the hovered slice in the tooltip, anchored at the slice middle', async () => {
    let received: ChartTooltipSlotProps | undefined
    const wrapper = mountChart(() => [
      pie({}, () => [h(ChartCell, { fill: 'red' }), h(ChartCell, { fill: 'blue' })]),
      h(ChartTooltip, { isAnimationActive: false }, {
        content: (props: ChartTooltipSlotProps) => {
          received = props
          return h('div', { 'data-test': 'custom' }, props.payload.map(entry => `${entry.name}:${entry.value}`).join(','))
        },
      }),
    ])
    await settle()
    const sectors = wrapper.findAll('[data-slot=chart-pie-sector]')
    await hoverAt(wrapper, 50, 225)
    await settle()
    expect(wrapper.find('[data-test=custom]').text()).toBe('Safari:3')
    expect(received?.payload[0]).toMatchObject({ dataKey: 'value', name: 'Safari', value: 3, color: 'blue', fill: 'blue' })
    expect(received?.label).toBeUndefined()
    // Safari spans 90° → 360°: middle at 225°, half the radius out.
    expect(received?.coordinate?.x).toBeCloseTo(100 - Math.SQRT1_2 * 50)
    expect(received?.coordinate?.y).toBeCloseTo(100 + Math.SQRT1_2 * 50)
    expect(sectors[1]!.attributes('data-active')).toBe('true')

    await wrapper.find('[data-slot=chart-surface]').trigger('pointerleave')
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe('closed')
    expect(sectors[1]!.attributes('data-active')).toBeUndefined()
    wrapper.unmount()
  })

  it('shows only the hovered pie of a nested donut', async () => {
    const outer = [
      { name: 'Q1', value: 10 },
      { name: 'Q2', value: 30 },
    ]
    const wrapper = mountChart(() => [
      pie({ innerRadius: 30, outerRadius: 40 }),
      pie({ data: outer, innerRadius: 60, outerRadius: 80 }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    const sectors = wrapper.findAll('[data-slot=chart-pie-sector]')
    expect(sectors).toHaveLength(4)
    expect(sectors[2]!.attributes('d')).toContain('A80,80')
    await hoverAt(wrapper, 70, 45)
    const tooltip = wrapper.find('[data-slot=chart-tooltip-wrapper]')
    expect(tooltip.text()).toContain('Q1')
    expect(tooltip.text()).toContain('10')
    expect(tooltip.text()).not.toContain('Chrome')
    expect(sectors[2]!.attributes('data-active')).toBe('true')
    wrapper.unmount()
  })

  it('keeps the tooltip on the nearest slice across padding gaps, and hides it in the hole and outside', async () => {
    const even = [{ name: 'A', value: 1 }, { name: 'B', value: 1 }, { name: 'C', value: 1 }]
    const wrapper = mountChart(() => [
      pie({ data: even, innerRadius: 50, outerRadius: 100, paddingAngle: 30 }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    const [a, b] = computePieSectors([1, 1, 1], { cx: 100, cy: 100, innerRadius: 50, outerRadius: 100, startAngle: 0, endAngle: 360, paddingAngle: 30 })
    const tooltip = () => wrapper.find('[data-slot=chart-tooltip-wrapper]')
    const active = () => wrapper.findAll('[data-slot=chart-pie-sector]').findIndex(sector => sector.attributes('data-active') === 'true')
    // The gap between A and B is 30° wide: each side snaps to its own slice.
    expect(b!.startAngle - a!.endAngle).toBeCloseTo(30)
    await hoverAt(wrapper, 75, a!.endAngle + 5)
    expect(tooltip().attributes('data-state')).not.toBe('closed')
    expect(active()).toBe(0)
    await hoverAt(wrapper, 75, b!.startAngle - 5)
    expect(tooltip().attributes('data-state')).not.toBe('closed')
    expect(active()).toBe(1)
    // The hole and the outside hide it.
    await hoverAt(wrapper, 30, b!.startAngle - 5)
    expect(tooltip().attributes('data-state')).toBe('closed')
    expect(active()).toBe(-1)
    await hoverAt(wrapper, 75, 10)
    expect(active()).toBe(0)
    await hoverAt(wrapper, 105, 10)
    expect(tooltip().attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('keeps the tooltip up between nested rings, on the ring the pointer came from', async () => {
    const outer = [
      { name: 'Q1', value: 10 },
      { name: 'Q2', value: 30 },
    ]
    const wrapper = mountChart(() => [
      pie({ innerRadius: 30, outerRadius: 40 }),
      pie({ data: outer, innerRadius: 60, outerRadius: 80 }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    const tooltip = () => wrapper.find('[data-slot=chart-tooltip-wrapper]')
    // Chrome and Q1 both span 0° → 90°. Entering the gap from outside a ring picks the nearer ring.
    await hoverAt(wrapper, 55, 45)
    expect(tooltip().text()).toContain('Q1')
    await wrapper.find('[data-slot=chart-surface]').trigger('pointerleave')
    await hoverAt(wrapper, 45, 45)
    expect(tooltip().text()).toContain('Chrome')
    // Moving outwards from the inner ring keeps it until the pointer reaches the outer ring.
    await hoverAt(wrapper, 55, 45)
    expect(tooltip().attributes('data-state')).not.toBe('closed')
    expect(tooltip().text()).toContain('Chrome')
    await hoverAt(wrapper, 70, 45)
    expect(tooltip().text()).toContain('Q1')
    await hoverAt(wrapper, 45, 45)
    expect(tooltip().text()).toContain('Q1')
    // The hole and the outside hide it.
    await hoverAt(wrapper, 20, 45)
    expect(tooltip().attributes('data-state')).toBe('closed')
    await hoverAt(wrapper, 90, 45)
    expect(tooltip().attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('moves between slices with the arrow keys and marks the active slice', async () => {
    const wrapper = mountChart(() => [pie(), h(ChartTooltip, { isAnimationActive: false })])
    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    const sectors = () => wrapper.findAll('[data-slot=chart-pie-sector]')
    await svg.trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('Chrome')
    expect(sectors()[0]!.attributes('data-active')).toBe('true')
    await svg.trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('Safari')
    expect(sectors()[0]!.attributes('data-active')).toBeUndefined()
    expect(sectors()[1]!.attributes('data-active')).toBe('true')
    await svg.trigger('keydown', { key: 'Escape' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe('closed')
    expect(sectors()[1]!.attributes('data-active')).toBeUndefined()
    wrapper.unmount()
  })

  it('walks the slices of a nested donut one pie after the other', async () => {
    const outer = [
      { name: 'Q1', value: 10 },
      { name: 'Q2', value: 30 },
      { name: 'Q3', value: 20 },
    ]
    let received: ChartTooltipSlotProps | undefined
    const wrapper = mountChart(() => [
      pie({ innerRadius: 30, outerRadius: 40 }),
      pie({ data: outer, innerRadius: 60, outerRadius: 80 }),
      h(ChartTooltip, { isAnimationActive: false }, {
        content: (props: ChartTooltipSlotProps) => {
          received = props
          return h('div', props.payload.map(entry => entry.name).join(','))
        },
      }),
    ])
    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    const names: string[] = []
    for (let step = 0; step < 6; step++) {
      await svg.trigger('keydown', { key: 'ArrowRight' })
      await settle()
      names.push(received!.payload.map(entry => entry.name).join(','))
    }
    // Inner pie first, then every outer slice, one slice per step; the last key stays on the last slice.
    expect(names).toEqual(['Chrome', 'Safari', 'Q1', 'Q2', 'Q3', 'Q3'])
    const sectors = wrapper.findAll('[data-slot=chart-pie-sector]')
    expect(sectors.map(sector => sector.attributes('data-active') ?? '')).toEqual(['', '', '', '', 'true'])
    // Q3 spans 240° → 360° of the outer ring: anchored at 300°, 70px out.
    expect(received?.coordinate?.x).toBeCloseTo(100 + Math.cos(Math.PI / 3) * 70)
    expect(received?.coordinate?.y).toBeCloseTo(100 + Math.sin(Math.PI / 3) * 70)

    await svg.trigger('keydown', { key: 'Home' })
    await settle()
    expect(received?.payload.map(entry => entry.name)).toEqual(['Chrome'])
    wrapper.unmount()
  })

  it('draws negative values as empty slices', () => {
    const sectors = computePieSectors([10, -5, 5], { cx: 0, cy: 0, innerRadius: 0, outerRadius: 1, startAngle: 0, endAngle: 360 })
    expect(sectors.map(s => [s.startAngle, s.endAngle])).toEqual([[0, 240], [240, 240], [240, 360]])
    expect(sectors.map(s => s.value)).toEqual([10, 0, 5])
  })

  it('places a root ChartLabel in the middle of the chart', async () => {
    const wrapper = mountChart(() => [
      pie({ innerRadius: 60, outerRadius: 80 }),
      h(ChartLabel, { value: '4.5K', position: 'center' }),
    ])
    await settle()
    const label = wrapper.findAll('text').find(text => text.text() === '4.5K')
    expect(label?.attributes('x')).toBe('100')
    expect(label?.attributes('y')).toBe('100')
    expect(label?.attributes('text-anchor')).toBe('middle')
    wrapper.unmount()
  })

  it('labels each slice inside its ring by default', async () => {
    const wrapper = mountChart(() => [pie({ innerRadius: 40, outerRadius: 80 }, () => [h(ChartLabel)])])
    await settle()
    const label = wrapper.findAll('text').find(text => text.text() === '1')
    // Chrome: middle at 45°, radius 60.
    expect(Number(label?.attributes('x'))).toBeCloseTo(100 + Math.SQRT1_2 * 60)
    expect(Number(label?.attributes('y'))).toBeCloseTo(100 - Math.SQRT1_2 * 60)
    wrapper.unmount()
  })

  it('hides a pie with `hide`', async () => {
    const wrapper = mountChart(() => [pie({ hide: true })])
    await settle()
    expect(wrapper.find('[data-slot=chart-pie-sector]').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('PieChart generated mode', () => {
  // No tweens: shapes land on their final geometry at once.
  beforeAll(() => vi.stubGlobal('matchMedia', () => ({ matches: true })))
  afterAll(() => vi.unstubAllGlobals())

  const browsers = [
    { name: 'Chrome', visits: 1 },
    { name: 'Safari', visits: 3 },
    { name: 'Edge', visits: 4, fill: 'red' },
  ]

  function mountGenerated(props: Record<string, unknown> = {}, slots: Record<string, any> = {}) {
    return mount(PieChart, {
      props: { data: browsers, index: 'name', width: SIZE, height: SIZE, margin, ...props },
      slots,
      attachTo: document.body,
    })
  }

  it('draws one slice per row, colored from the palette, a colors map and the row fill', async () => {
    const wrapper = mountGenerated()
    await settle()
    const fills = () => wrapper.findAll('[data-slot=chart-pie-sector]').map(sector => sector.attributes('fill'))
    expect(fills()).toEqual(['var(--chart-3)', 'var(--chart-1)', 'red'])
    await wrapper.setProps({ colors: { Safari: 'blue', Edge: 'green' } })
    await settle()
    // A row's own `fill` wins over the map.
    expect(fills()).toEqual(['var(--chart-3)', 'blue', 'red'])
    await wrapper.setProps({ colors: ['pink'] })
    await settle()
    expect(fills()).toEqual(['pink', 'pink', 'red'])
    wrapper.unmount()
  })

  it('draws the same donut as the hand-composed parts', async () => {
    const generated = mountGenerated({ donut: true })
    const composed = mount(PieChart, {
      props: { width: SIZE, height: SIZE, margin },
      slots: { default: () => [h(ChartPie, { data: browsers, dataKey: 'visits', nameKey: 'name', innerRadius: '68%', cornerRadius: 12, paddingAngle: -20, isAnimationActive: false })] },
      attachTo: document.body,
    })
    await settle()
    const paths = (wrapper: typeof composed) => wrapper.findAll('[data-slot=chart-pie-sector]').map(sector => sector.attributes('d'))
    expect(paths(generated)).toHaveLength(3)
    expect(paths(generated)).toEqual(paths(composed))
    // Explicit radius props win over `donut`.
    await generated.setProps({ innerRadius: 0 })
    await settle()
    expect(paths(generated)).not.toEqual(paths(composed))
    generated.unmount()
    composed.unmount()
  })

  it('leaves hidden slices out and keeps the other colors', async () => {
    const wrapper = mountGenerated({ hidden: ['Safari'] })
    await settle()
    expect(wrapper.findAll('[data-slot=chart-pie-sector]').map(sector => sector.attributes('fill'))).toEqual(['var(--chart-3)', 'red'])
    wrapper.unmount()
  })

  it('renders a toggleable legend that hides slices', async () => {
    const wrapper = mountGenerated({ legend: true })
    await settle()
    expect(wrapper.attributes('data-legend')).toBe('bottom')
    const rows = wrapper.findAll('[data-slot=chart-legend-item]')
    expect(rows.map(row => row.text())).toEqual(['Chrome', 'Safari', 'Edge'])
    await wrapper.findAll('[data-slot=chart-legend-trigger]')[1]!.trigger('click')
    await settle()
    expect(wrapper.emitted('update:hidden')?.[0]).toEqual([['Safari']])
    expect(wrapper.findAll('[data-slot=chart-pie-sector]')).toHaveLength(2)
    expect(wrapper.findAll('[data-slot=chart-legend-item]')[1]!.attributes('data-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('places a side legend in a vertical list and accepts legend props', async () => {
    const wrapper = mountGenerated({ legend: { position: 'right', showValue: true } })
    await settle()
    expect(wrapper.attributes('data-legend')).toBe('right')
    expect(wrapper.find('[data-slot=chart-legend]').attributes('data-orientation')).toBe('vertical')
    expect(wrapper.find('[data-slot=chart-legend-item]').text()).toContain('1')
    wrapper.unmount()
  })

  it('formats legend values with the root valueFormatter, and a legend formatter wins', async () => {
    const valueFormatter = (value: number, name: string) => `${name}=${value * 10}`
    const wrapper = mountGenerated({ valueFormatter, legend: { showValue: true } })
    await settle()
    const values = () => wrapper.findAll('[data-slot=chart-legend-value]').map(value => value.text())
    expect(values()).toEqual(['Chrome=10', 'Safari=30', 'Edge=40'])
    await wrapper.setProps({ legend: { showValue: true, valueFormatter: (value: number) => `#${value}` } })
    await settle()
    expect(values()).toEqual(['#1', '#3', '#4'])
    wrapper.unmount()
  })

  it('shows the slice under keyboard focus in the tooltip, formatted', async () => {
    const wrapper = mountGenerated({ valueFormatter: (value: number, name: string) => `${name}=${value * 10}` })
    await settle()
    await wrapper.find('[data-slot=chart-surface]').trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('Chrome=10')
    wrapper.unmount()
  })

  it('turns the tooltip off with :tooltip="false"', async () => {
    const wrapper = mountGenerated({ tooltip: false })
    await settle()
    expect(wrapper.find('[data-slot=chart-surface]').attributes('tabindex')).toBeUndefined()
    wrapper.unmount()
  })

  it('forwards the tooltip and tooltip-footer slots', async () => {
    const footer = mountGenerated({}, { 'tooltip-footer': (p: { payload: unknown[] }) => h('span', { 'data-test': 'footer' }, `rows:${p.payload.length}`) })
    await settle()
    await footer.find('[data-slot=chart-surface]').trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(footer.find('[data-test=footer]').text()).toBe('rows:1')
    footer.unmount()

    const custom = mountGenerated({}, { tooltip: (p: ChartTooltipSlotProps) => h('span', { 'data-test': 'custom' }, p.payload.map(entry => entry.name).join(',')) })
    await settle()
    await custom.find('[data-slot=chart-surface]').trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(custom.find('[data-test=custom]').text()).toBe('Chrome')
    custom.unmount()
  })

  it('renders #center on the chart center with the visible total and the active slice', async () => {
    const wrapper = mountGenerated({ hidden: ['Chrome'] }, {
      center: (p: { total: number, active: { name: string, percent?: number } | null }) => h('span', { 'data-test': 'center' }, `${p.total}:${p.active ? `${p.active.name}@${p.active.percent}` : '-'}`),
    })
    await settle()
    const center = wrapper.find('[data-slot=chart-center]')
    expect(center.attributes('style')).toContain('left: 100px')
    expect(center.attributes('style')).toContain('top: 100px')
    expect(wrapper.find('[data-test=center]').text()).toBe('7:-')
    await wrapper.find('[data-slot=chart-surface]').trigger('keydown', { key: 'ArrowRight' })
    await settle()
    // Safari is the first visible slice: 3 of 7.
    expect(wrapper.find('[data-test=center]').text()).toBe(`7:Safari@${(3 / 7) * 100}`)
    wrapper.unmount()
  })

  it('sums the hand-composed pie for #center in composition mode', async () => {
    const wrapper = mount(PieChart, {
      props: { width: SIZE, height: SIZE, margin },
      slots: {
        default: () => [pie(), h(ChartTooltip)],
        center: (p: { total: number }) => h('span', { 'data-test': 'center' }, String(p.total)),
      },
      attachTo: document.body,
    })
    await settle()
    expect(wrapper.find('[data-test=center]').text()).toBe('4')
    wrapper.unmount()
  })

  it('is accessible idle and with a slice focused, as a donut with legend and center', async () => {
    const wrapper = mountGenerated({ 'donut': true, 'legend': true, 'hidden': ['Edge'], 'aria-label': 'Visits by browser' }, {
      center: (p: { total: number }) => h('span', `${p.total} visits`),
    })
    await settle()
    expect(wrapper.find('[data-slot=chart-surface]').attributes('aria-label')).toBe('Visits by browser')
    await expectAccessible(wrapper)
    ;(wrapper.find('[data-slot=chart-surface]').element as SVGElement).focus()
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('Chrome')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('announces the first visible slice on keyboard focus, also without a panel', async () => {
    const wrapper = mountGenerated({ 'hidden': ['Chrome'], 'tooltip': { panel: false }, 'aria-label': 'Visits by browser' })
    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    ;(svg.element as SVGElement).focus()
    await settle()
    const live = wrapper.find('[data-slot=chart-tooltip-wrapper]')
    expect(live.attributes('role')).toBe('status')
    expect(live.classes()).toContain('sr-only')
    expect(live.text()).toContain('Safari')
    expect(wrapper.find('[data-slot=chart-pie-sector][data-active=true]').attributes('fill')).toBe('var(--chart-1)')
    await expectAccessible(wrapper)
    ;(svg.element as SVGElement).blur()
    await settle()
    expect(live.text()).toBe('')
    wrapper.unmount()
  })

  it('keeps composition mode when index is not set', async () => {
    const wrapper = mount(PieChart, { props: { data: browsers, width: SIZE, height: SIZE, margin }, attachTo: document.body })
    await settle()
    expect(wrapper.find('[data-slot=chart-pie-sector]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chart-legend]').exists()).toBe(false)
    wrapper.unmount()
  })
})
