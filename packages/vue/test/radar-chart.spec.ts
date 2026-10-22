import type { ChartTooltipSlotProps } from '../src/components/chart/ChartTooltip.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import ChartLabel from '../src/components/chart/ChartLabel.vue'
import ChartPolarAngleAxis from '../src/components/chart/ChartPolarAngleAxis.vue'
import ChartPolarGrid from '../src/components/chart/ChartPolarGrid.vue'
import ChartPolarRadiusAxis from '../src/components/chart/ChartPolarRadiusAxis.vue'
import ChartRadar from '../src/components/chart/ChartRadar.vue'
import ChartTooltip from '../src/components/chart/ChartTooltip.vue'
import { angleInSweep, angleTickAnchor, polygonPath } from '../src/components/chart/polar'
import RadarChart from '../src/components/radar-chart/RadarChart.vue'

// 200 × 200 without margins: center (100, 100), outer radius 80% of 100px = 80px.
const SIZE = 200
const margin = { top: 0, right: 0, bottom: 0, left: 0 }

// Four spokes: up, right, down, left (clockwise from 12 o'clock). The radius axis runs 0 → 100.
const data = [
  { category: 'N', score: 100, other: 50 },
  { category: 'E', score: 50, other: 50 },
  { category: 'S', score: 100, other: 50 },
  { category: 'W', score: 50, other: 50 },
]

async function settle() {
  await flushPromises()
  await nextTick()
}

function mountChart(children: () => any[], props: Record<string, unknown> = {}) {
  return mount(RadarChart, {
    props: { data, width: SIZE, height: SIZE, margin, ...props },
    slots: { default: children },
    attachTo: document.body,
  })
}

async function hover(wrapper: ReturnType<typeof mountChart>, clientX: number, clientY: number) {
  wrapper.find('[data-slot=chart-surface]').element.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY, bubbles: true }))
  await settle()
}

const radar = (props: Record<string, unknown> = {}, children?: () => any[]) => h(ChartRadar, { dataKey: 'score', name: 'Score', isAnimationActive: false, ...props }, children)
const angleAxis = () => h(ChartPolarAngleAxis, { dataKey: 'category' })

describe('polar helpers', () => {
  it('anchors angle labels away from the center', () => {
    expect(angleTickAnchor(90)).toEqual({ textAnchor: 'middle', dy: '0em' })
    expect(angleTickAnchor(0)).toEqual({ textAnchor: 'start', dy: '0.355em' })
    expect(angleTickAnchor(-90)).toEqual({ textAnchor: 'middle', dy: '0.71em' })
    expect(angleTickAnchor(180)).toEqual({ textAnchor: 'end', dy: '0.355em' })
    expect(angleTickAnchor(0, 'inner').textAnchor).toBe('end')
  })

  it('tests angles against a sweep in either direction', () => {
    expect(angleInSweep(45, 90, -270)).toBe(true)
    expect(angleInSweep(180, 225, -45)).toBe(true)
    expect(angleInSweep(-90, 225, -45)).toBe(false)
    expect(angleInSweep(-90, 0, 180)).toBe(false)
    expect(angleInSweep(90, 0, 180)).toBe(true)
  })

  it('closes a polygon back to its first point', () => {
    expect(polygonPath([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }])).toBe('M0,0L10,0L10,10L0,0Z')
    expect(polygonPath([])).toBe('')
  })
})

describe('RadarChart', () => {
  it('renders the root with data-slot and the default height', () => {
    const wrapper = mount(RadarChart, { props: { data } })
    expect(wrapper.attributes('data-slot')).toBe('radar-chart')
    expect(wrapper.attributes('style')).toContain('height: 300px')
    wrapper.unmount()
  })

  it('places one point per spoke, clockwise from 12 o\'clock', async () => {
    const wrapper = mountChart(() => [radar({ stroke: 'red', fill: 'red', fillOpacity: 0.15, strokeWidth: 2 })])
    await settle()
    const polygon = wrapper.find('[data-slot=chart-radar-polygon]')
    expect(polygon.attributes('d')).toBe('M100,20L140,100L100,180L60,100L100,20Z')
    expect(polygon.attributes('fill')).toBe('red')
    expect(polygon.attributes('fill-opacity')).toBe('0.15')
    expect(polygon.attributes('stroke')).toBe('red')
    expect(polygon.attributes('stroke-width')).toBe('2')
    wrapper.unmount()
  })

  it('draws a polygon grid at the radius ticks with a spoke per category', async () => {
    const wrapper = mountChart(() => [h(ChartPolarGrid), angleAxis(), radar()])
    await settle()
    const rings = wrapper.findAll('[data-slot=chart-polar-grid-ring]')
    // Ticks 0, 25, 50, 75, 100 → radii 0, 20, 40, 60, 80.
    expect(rings).toHaveLength(5)
    expect(rings[4]!.attributes('d')).toBe('M100,20L180,100L100,180L20,100L100,20Z')
    const spokes = wrapper.findAll('[data-slot=chart-polar-grid-spoke]')
    expect(spokes).toHaveLength(4)
    expect(spokes[0]!.attributes()).toMatchObject({ x1: '100', y1: '100', x2: '100', y2: '20' })
    wrapper.unmount()
  })

  it('draws circles with grid-type="circle"', async () => {
    const wrapper = mountChart(() => [h(ChartPolarGrid, { gridType: 'circle' }), radar()])
    await settle()
    const rings = wrapper.findAll('circle[data-slot=chart-polar-grid-ring]')
    expect(rings.map(ring => ring.attributes('r'))).toEqual(['0', '20', '40', '60', '80'])
    wrapper.unmount()
  })

  it('labels each spoke outside the outer ring', async () => {
    const wrapper = mountChart(() => [angleAxis(), radar()])
    await settle()
    const labels = wrapper.findAll('[data-slot=chart-polar-angle-axis-tick] text')
    expect(labels.map(label => label.text())).toEqual(['N', 'E', 'S', 'W'])
    expect(labels[0]!.attributes()).toMatchObject({ 'text-anchor': 'middle', 'dy': '0em' })
    expect(Number(labels[0]!.attributes('y'))).toBeCloseTo(12)
    expect(labels[1]!.attributes()).toMatchObject({ 'text-anchor': 'start', 'dy': '0.355em' })
    expect(Number(labels[1]!.attributes('x'))).toBeCloseTo(188)
    expect(labels[2]!.attributes('dy')).toBe('0.71em')
    expect(labels[3]!.attributes('text-anchor')).toBe('end')
    wrapper.unmount()
  })

  it('places point labels past each point, anchored away from the center', async () => {
    const wrapper = mountChart(() => [radar({}, () => [h(ChartLabel)])])
    await settle()
    const labels = wrapper.findAll('[data-slot=chart-label]')
    expect(labels.map(label => label.text())).toEqual(['100', '50', '100', '50'])
    // N: 80px up, plus the 5px offset; the text sits above the point.
    expect(labels[0]!.attributes()).toMatchObject({ 'text-anchor': 'middle', 'dominant-baseline': 'auto' })
    expect(Number(labels[0]!.attributes('x'))).toBeCloseTo(100)
    expect(Number(labels[0]!.attributes('y'))).toBeCloseTo(15)
    // E: 40px right, plus 5px; starts at the point and grows outwards.
    expect(labels[1]!.attributes()).toMatchObject({ 'text-anchor': 'start', 'dominant-baseline': 'central' })
    expect(Number(labels[1]!.attributes('x'))).toBeCloseTo(145)
    expect(Number(labels[1]!.attributes('y'))).toBeCloseTo(100)
    // S: below the point.
    expect(labels[2]!.attributes()).toMatchObject({ 'text-anchor': 'middle', 'dominant-baseline': 'hanging' })
    expect(Number(labels[2]!.attributes('y'))).toBeCloseTo(185)
    // W: ends at the point.
    expect(labels[3]!.attributes('text-anchor')).toBe('end')
    expect(Number(labels[3]!.attributes('x'))).toBeCloseTo(55)
    wrapper.unmount()
  })

  it('formats spoke labels and hides them with :tick="false"', async () => {
    const wrapper = mountChart(() => [h(ChartPolarAngleAxis, { dataKey: 'category', tickFormatter: (value: string) => value.toLowerCase() }), radar()])
    await settle()
    expect(wrapper.findAll('[data-slot=chart-polar-angle-axis-tick] text').map(label => label.text())).toEqual(['n', 'e', 's', 'w'])
    wrapper.unmount()

    const hidden = mountChart(() => [h(ChartPolarAngleAxis, { dataKey: 'category', tick: false }), radar()])
    await settle()
    expect(hidden.find('[data-slot=chart-polar-angle-axis-tick] text').exists()).toBe(false)
    hidden.unmount()
  })

  it('labels the radius axis along its angle and honours a fixed domain', async () => {
    const wrapper = mountChart(() => [h(ChartPolarRadiusAxis, { angle: 90, domain: [0, 200] }), radar()])
    await settle()
    const ticks = wrapper.findAll('[data-slot=chart-polar-radius-axis-tick] text')
    expect(ticks.map(tick => tick.text())).toEqual(['0', '50', '100', '150', '200'])
    expect(Number(ticks[4]!.attributes('y'))).toBeCloseTo(20)
    expect(Number(ticks[4]!.attributes('x'))).toBeCloseTo(100)
    expect(ticks[0]!.attributes('text-anchor')).toBe('start')
    const line = wrapper.find('[data-slot=chart-polar-radius-axis-line]')
    expect(Number(line.attributes('y2'))).toBeCloseTo(20)
    // score 100 of 200 → half the radius.
    expect(wrapper.find('[data-slot=chart-radar-polygon]').attributes('d')).toBe('M100,60L120,100L100,140L80,100L100,60Z')
    wrapper.unmount()
  })

  it('draws dots only when asked, with the radar fill opacity', async () => {
    const wrapper = mountChart(() => [radar({ fill: 'red', fillOpacity: 0.15, dot: { r: 3, strokeWidth: 0 } })])
    await settle()
    const dots = wrapper.findAll('[data-slot=chart-dot]')
    expect(dots).toHaveLength(4)
    expect(dots[0]!.attributes()).toMatchObject({ 'cx': '100', 'cy': '20', 'r': '3', 'fill': 'red', 'fill-opacity': '0.15', 'stroke-width': '0' })
    wrapper.unmount()

    const plain = mountChart(() => [radar()])
    await settle()
    expect(plain.find('[data-slot=chart-dot]').exists()).toBe(false)
    plain.unmount()
  })

  it('shows the nearest spoke in the tooltip with an active dot per radar', async () => {
    let received: ChartTooltipSlotProps | undefined
    const wrapper = mountChart(() => [
      angleAxis(),
      radar({ stroke: 'red' }),
      radar({ dataKey: 'other', name: 'Other', stroke: 'blue' }),
      h(ChartTooltip, { isAnimationActive: false }, {
        content: (props: ChartTooltipSlotProps) => {
          received = props
          return h('div', { 'data-test': 'custom' }, `${props.label}|${props.payload.map(entry => `${entry.name}:${entry.value}`).join(',')}`)
        },
      }),
    ])
    await settle()
    // Pointer slightly right of the top spoke: closest category is N.
    await hover(wrapper, 110, 50)
    expect(wrapper.find('[data-test=custom]').text()).toBe('N|Score:100,Other:50')
    expect(received?.coordinate).toEqual({ x: 110, y: 50 })
    expect(received?.payload[0]).toMatchObject({ color: 'red', stroke: 'red' })
    const dots = wrapper.findAll('[data-slot=chart-active-dot]')
    expect(dots).toHaveLength(2)
    expect(dots[0]!.attributes()).toMatchObject({ cx: '100', cy: '20', r: '4', fill: 'red' })

    await hover(wrapper, 160, 105)
    expect(wrapper.find('[data-test=custom]').text()).toBe('E|Score:50,Other:50')

    // Between spokes and past the outer ring, the tooltip snaps to the nearest spoke.
    await hover(wrapper, 150, 55)
    expect(wrapper.find('[data-test=custom]').text()).toBe('E|Score:50,Other:50')
    await hover(wrapper, 100, 196)
    expect(wrapper.find('[data-test=custom]').text()).toBe('S|Score:100,Other:50')
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe('open')

    await wrapper.find('[data-slot=chart-surface]').trigger('pointerleave')
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe('closed')
    expect(wrapper.find('[data-slot=chart-active-dot]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('keeps the tooltip up while the pointer sweeps around the chart', async () => {
    const wrapper = mountChart(() => [angleAxis(), radar(), h(ChartTooltip, { isAnimationActive: false })])
    await settle()
    const seen: string[] = []
    for (let angle = 80; angle >= -260; angle -= 10) {
      const radians = (angle * Math.PI) / 180
      await hover(wrapper, 100 + 30 * Math.cos(radians), 100 - 30 * Math.sin(radians))
      const tooltip = wrapper.find('[data-slot=chart-tooltip-wrapper]')
      expect(tooltip.attributes('data-state')).toBe('open')
      const name = data.find(row => tooltip.text().startsWith(row.category))!.category
      if (seen.at(-1) !== name)
        seen.push(name)
    }
    expect(seen).toEqual(['N', 'E', 'S', 'W', 'N'])
    wrapper.unmount()
  })

  it('draws no tooltip cursor', async () => {
    const wrapper = mountChart(() => [angleAxis(), radar(), h(ChartTooltip, { isAnimationActive: false })])
    await settle()
    await hover(wrapper, 100, 50)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=chart-cursor]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('moves between spokes with the arrow keys, anchored at the data point', async () => {
    let received: ChartTooltipSlotProps | undefined
    const wrapper = mountChart(() => [angleAxis(), radar(), h(ChartTooltip, { isAnimationActive: false }, {
      content: (props: ChartTooltipSlotProps) => {
        received = props
        return h('div', String(props.label))
      },
    })])
    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    await svg.trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(received?.label).toBe('N')
    // N scores 100: the outer ring, straight up.
    expect(received?.coordinate?.x).toBeCloseTo(100)
    expect(received?.coordinate?.y).toBeCloseTo(20)
    await svg.trigger('keydown', { key: 'End' })
    await settle()
    expect(received?.label).toBe('W')
    // W scores 50: half the radius, left of the center, where the active dot is.
    expect(received?.coordinate?.x).toBeCloseTo(60)
    expect(received?.coordinate?.y).toBeCloseTo(100)
    expect(wrapper.find('[data-slot=chart-active-dot]').attributes('cx')).toBe('60')
    wrapper.unmount()
  })

  it('redraws with fewer spokes when the data shrinks and drops a stale active spoke', async () => {
    const wrapper = mountChart(() => [angleAxis(), radar(), h(ChartTooltip, { isAnimationActive: false })])
    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    await svg.trigger('keydown', { key: 'End' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('W')
    await wrapper.setProps({ data: data.slice(0, 3) })
    await settle()
    // Three spokes, clockwise from 12 o'clock at 120° steps; S (100) sits on the outer ring.
    expect(wrapper.findAll('[data-slot=chart-polar-angle-axis-tick]')).toHaveLength(3)
    const d = wrapper.find('[data-slot=chart-radar-polygon]').attributes('d')!
    expect(d.match(/[ML]/g)).toHaveLength(4)
    expect(d.startsWith('M100,20')).toBe(true)
    expect(wrapper.find('[data-slot=chart-active-dot]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('leaves a hidden radar out of the radius domain', async () => {
    const alone = mountChart(() => [radar({ dataKey: 'other' })])
    await settle()
    const expected = alone.find('[data-slot=chart-radar-polygon]').attributes('d')
    alone.unmount()

    const wrapper = mountChart(() => [radar({ dataKey: 'other' }), radar({ hide: true })])
    await settle()
    expect(wrapper.findAll('[data-slot=chart-radar-polygon]')).toHaveLength(1)
    expect(wrapper.find('[data-slot=chart-radar-polygon]').attributes('d')).toBe(expected)
    wrapper.unmount()
  })
})

describe('RadarChart generated mode', () => {
  // No tweens: shapes land on their final geometry at once.
  beforeAll(() => vi.stubGlobal('matchMedia', () => ({ matches: true })))
  afterAll(() => vi.unstubAllGlobals())

  function mountGenerated(props: Record<string, unknown> = {}, slots: Record<string, any> = {}) {
    return mount(RadarChart, {
      props: { data, index: 'category', width: SIZE, height: SIZE, margin, ...props },
      slots,
      attachTo: document.body,
    })
  }

  const polygons = (wrapper: ReturnType<typeof mountGenerated>) => wrapper.findAll('[data-slot=chart-radar-polygon]')

  it('draws the grid, spoke labels and one radar per numeric key', async () => {
    const wrapper = mountGenerated()
    await settle()
    expect(wrapper.find('[data-slot=chart-polar-grid]').exists()).toBe(true)
    expect(wrapper.findAll('[data-slot=chart-polar-angle-axis-tick] text').map(label => label.text())).toEqual(['N', 'E', 'S', 'W'])
    expect(wrapper.find('[data-slot=chart-polar-radius-axis-tick]').exists()).toBe(false)
    const shapes = polygons(wrapper)
    expect(shapes).toHaveLength(2)
    expect(shapes.map(shape => shape.attributes('stroke'))).toEqual(['var(--chart-3)', 'var(--chart-1)'])
    expect(shapes[0]!.attributes('fill-opacity')).toBe('0.15')
    expect(shapes[0]!.attributes('stroke-width')).toBe('2')
    // Same polygon as the hand-composed radar: score 100 / 50 on a 0–100 radius axis of 80px.
    expect(shapes[0]!.attributes('d')).toBe(polygonPath([{ x: 100, y: 20 }, { x: 140, y: 100 }, { x: 100, y: 180 }, { x: 60, y: 100 }]))
    wrapper.unmount()
  })

  it('takes series config, root defaults and colors', async () => {
    const wrapper = mountGenerated({
      series: { other: { name: 'Other', color: 'red', fillOpacity: 0.5 }, score: {} },
      colors: ['blue', 'green'],
      strokeWidth: 3,
    })
    await settle()
    const shapes = polygons(wrapper)
    expect(shapes.map(shape => shape.attributes('stroke'))).toEqual(['red', 'green'])
    expect(shapes.map(shape => shape.attributes('fill-opacity'))).toEqual(['0.5', '0.15'])
    expect(shapes.map(shape => shape.attributes('stroke-width'))).toEqual(['3', '3'])
    wrapper.unmount()
  })

  it('turns parts on and off and forwards their props', async () => {
    const wrapper = mountGenerated({ grid: false, angleAxis: false, radiusAxis: { angle: 90 }, dot: true })
    await settle()
    expect(wrapper.find('[data-slot=chart-polar-grid]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chart-polar-angle-axis-tick]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chart-polar-radius-axis-tick]').exists()).toBe(true)
    expect(wrapper.findAll('[data-slot=chart-dot]')).toHaveLength(8)
    wrapper.unmount()
  })

  it('forwards the angle-tick slot', async () => {
    const wrapper = mountGenerated({}, { 'angle-tick': (p: { x: number, y: number, text: string }) => h('text', { 'data-test': 'tick', 'x': p.x, 'y': p.y }, `[${p.text}]`) })
    await settle()
    expect(wrapper.findAll('[data-test=tick]').map(tick => tick.text())).toEqual(['[N]', '[E]', '[S]', '[W]'])
    wrapper.unmount()
  })

  it('shows every radar at the focused spoke, with per-series formatters', async () => {
    const wrapper = mountGenerated({
      series: { score: { name: 'Score', valueFormatter: (value: number) => `${value} pts` }, other: { name: 'Other' } },
      valueFormatter: (value: number, key: string) => `${key}:${value}`,
    })
    await settle()
    await wrapper.find('[data-slot=chart-surface]').trigger('keydown', { key: 'ArrowRight' })
    await settle()
    const text = wrapper.find('[data-slot=chart-tooltip-wrapper]').text()
    expect(text).toContain('N')
    expect(text).toContain('100 pts')
    expect(text).toContain('other:50')
    wrapper.unmount()
  })

  it('formats the spoke labels and the tooltip header with indexFormatter', async () => {
    const wrapper = mountGenerated({ indexFormatter: (value: number | string) => `<${value}>` })
    await settle()
    expect(wrapper.findAll('[data-slot=chart-polar-angle-axis-tick] text').map(label => label.text())).toEqual(['<N>', '<E>', '<S>', '<W>'])
    await wrapper.find('[data-slot=chart-surface]').trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('<N>')
    wrapper.unmount()
  })

  it('hides radars from the legend and keeps their colors', async () => {
    const wrapper = mountGenerated({ legend: 'top' })
    await settle()
    expect(wrapper.attributes('data-legend')).toBe('top')
    expect(wrapper.findAll('[data-slot=chart-legend-item]').map(row => row.text())).toEqual(['score', 'other'])
    await wrapper.findAll('[data-slot=chart-legend-trigger]')[0]!.trigger('click')
    await settle()
    expect(wrapper.emitted('update:hidden')?.[0]).toEqual([['score']])
    const shapes = polygons(wrapper)
    expect(shapes).toHaveLength(1)
    expect(shapes[0]!.attributes('stroke')).toBe('var(--chart-1)')
    wrapper.unmount()
  })

  it('replaces the legend through the legend slot', async () => {
    const wrapper = mountGenerated({}, {
      legend: (p: { items: Array<{ key: string }>, toggle: (key: string) => void }) => h('button', { 'data-test': 'legend', 'onClick': () => p.toggle('other') }, p.items.map(item => item.key).join(',')),
    })
    await settle()
    expect(wrapper.attributes('data-legend')).toBe('bottom')
    expect(wrapper.find('[data-test=legend]').text()).toBe('score,other')
    await wrapper.find('[data-test=legend]').trigger('click')
    expect(wrapper.emitted('update:hidden')?.[0]).toEqual([['other']])
    wrapper.unmount()
  })

  it('keeps composition mode when neither index nor series is set', async () => {
    const wrapper = mountChart(() => [radar()])
    await settle()
    expect(wrapper.find('[data-slot=chart-polar-grid]').exists()).toBe(false)
    expect(polygons(wrapper)).toHaveLength(1)
    wrapper.unmount()
  })
})
