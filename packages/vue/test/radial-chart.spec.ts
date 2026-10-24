import { flushPromises, mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import ChartCell from '@/components/chart/ChartCell.vue'
import ChartPolarAngleAxis from '@/components/chart/ChartPolarAngleAxis.vue'
import ChartRadialBar from '@/components/chart/ChartRadialBar.vue'
import type { ChartTooltipSlotProps } from '@/components/chart/ChartTooltip.vue'
import ChartTooltip from '@/components/chart/ChartTooltip.vue'
import { bandBarPositions } from '@/components/chart/polar'
import RadialChart from '@/components/radial-chart/RadialChart.vue'

import { expectAccessible } from './a11y'

// 200 × 200 without margins: center (100, 100); inner radius 30% = 30px, outer 80% = 80px.
// Two rings → bands of 25px; a 10px bar is centered in its band: 37–47 and 62–72.
const SIZE = 200
const margin = { top: 0, right: 0, bottom: 0, left: 0 }

const data = [
  { name: 'Calories', value: 50, fill: 'var(--chart-4)' },
  { name: 'Steps', value: 100, fill: 'var(--chart-3)' },
]

const settle = async () => {
  await flushPromises()
  await nextTick()
}

const mountChart = (children: () => any[], props: Record<string, unknown> = {}) => {
  return mount(RadialChart, {
    props: { data, width: SIZE, height: SIZE, margin, ...props },
    slots: { default: children },
    attachTo: document.body,
  })
}

const hover = async (wrapper: ReturnType<typeof mountChart>, clientX: number, clientY: number) => {
  wrapper
    .find('[data-slot=chart-surface]')
    .element.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY, bubbles: true }))
  await settle()
}

const bar = (props: Record<string, unknown> = {}, cells?: () => any[]) =>
  h(
    ChartRadialBar,
    { dataKey: 'value', isAnimationActive: false, ...props },
    cells ? { default: cells } : undefined,
  )

describe('radial bar bands', () => {
  it('centers fixed-size bars in their band', () => {
    expect(bandBarPositions(25, [{}], { barSize: 10, barGap: 4 })).toEqual([
      { offset: 7, size: 10 },
    ])
    expect(bandBarPositions(19, [{}], { barSize: 10, barGap: 4 })).toEqual([
      { offset: 4, size: 10 },
    ])
  })

  it('shares the band between bars without a size, minus the category gap', () => {
    expect(bandBarPositions(100, [{}, {}], { barGap: 4, barCategoryGap: '10%' })).toEqual([
      { offset: 10, size: 38 },
      { offset: 52, size: 38 },
    ])
  })

  it('caps bars at maxBarSize', () => {
    expect(bandBarPositions(100, [{ maxBarSize: 20 }], { barCategoryGap: 0 })).toEqual([
      { offset: 40, size: 20 },
    ])
  })

  it('never returns a negative bar size when gaps fill the band', () => {
    const [first] = bandBarPositions(10, [{}, {}], { barGap: 20, barCategoryGap: 6 })
    expect(first!.size).toBe(0)
  })
})

describe('RadialChart', () => {
  it('renders the root with data-slot and the default height', () => {
    const wrapper = mount(RadialChart, { props: { data } })
    expect(wrapper.attributes('data-slot')).toBe('radial-chart')
    expect(wrapper.attributes('style')).toContain('height: 300px')
    wrapper.unmount()
  })

  it('draws one ring per datum, the first one innermost, colored by the datum fill', async () => {
    const wrapper = mountChart(() => [bar()])
    await settle()
    const sectors = wrapper.findAll('[data-slot=chart-radial-bar-sector]')
    expect(sectors).toHaveLength(2)
    expect(sectors[0]!.attributes('transform')).toBe('translate(100, 100)')
    expect(sectors[0]!.attributes('d')).toContain('A47,47')
    expect(sectors[0]!.attributes('d')).toContain('A37,37')
    expect(sectors[1]!.attributes('d')).toContain('A72,72')
    expect(sectors[1]!.attributes('d')).toContain('A62,62')
    expect(sectors.map((sector) => sector.attributes('fill'))).toEqual([
      'var(--chart-4)',
      'var(--chart-3)',
    ])
    wrapper.unmount()
  })

  it("fills a full turn with the largest value and starts at 12 o'clock", async () => {
    const wrapper = mountChart(() => [bar()])
    await settle()
    const [half, full] = wrapper
      .findAll('[data-slot=chart-radial-bar-sector]')
      .map((sector) => sector.attributes('d')!)
    // 50 of 100: from the top (0, -47) clockwise to the bottom (0, 47).
    expect(half).toMatch(/^M[-\d.e]+,-47A47,47,0,1,1,[-\d.e]+,47/)
    // 100 of 100: a full annulus.
    expect(full!.match(/A72,72/g)).toHaveLength(2)
    wrapper.unmount()
  })

  it('measures against a fixed angle-axis domain', async () => {
    const wrapper = mountChart(() => [
      h(ChartPolarAngleAxis, { type: 'number', domain: [0, 200], tick: false }),
      bar(),
    ])
    await settle()
    const [quarter, half] = wrapper
      .findAll('[data-slot=chart-radial-bar-sector]')
      .map((sector) => sector.attributes('d')!)
    // 50 of 200: top to 3 o'clock (47, 0). 100 of 200: top to bottom.
    expect(quarter).toMatch(/A47,47,0,0,1,47,[-\d.e]+/)
    expect(half).toMatch(/A72,72,0,1,1,[-\d.e]+,72/)
    wrapper.unmount()
  })

  it('draws full-length tracks behind the bars with `background`', async () => {
    const wrapper = mountChart(() => [bar({ background: true })])
    await settle()
    const tracks = wrapper.findAll('[data-slot=chart-radial-bar-track]')
    expect(tracks).toHaveLength(2)
    expect(tracks[0]!.attributes('d')!.match(/A47,47/g)).toHaveLength(2)
    expect(tracks[0]!.classes()).toContain('fill-default')
    wrapper.unmount()

    const custom = mountChart(() => [bar({ background: { fill: 'pink' } })])
    await settle()
    expect(custom.find('[data-slot=chart-radial-bar-track]').attributes('style')).toContain(
      'fill: pink',
    )
    custom.unmount()
  })

  it('rounds the bar ends up to half the bar thickness', async () => {
    const wrapper = mountChart(() => [bar({ cornerRadius: 12 })])
    await settle()
    const [half, full] = wrapper
      .findAll('[data-slot=chart-radial-bar-sector]')
      .map((sector) => sector.attributes('d')!)
    expect(half).toContain('A5,5')
    expect(full).not.toContain('A5,5')
    wrapper.unmount()
  })

  it('opens a gauge between start and end angles', async () => {
    const wrapper = mountChart(
      () => [
        h(ChartPolarAngleAxis, { type: 'number', domain: [0, 100], tick: false }),
        bar({ background: true }),
        h(ChartTooltip, { isAnimationActive: false }),
      ],
      { data: [{ name: 'Active', value: 100 }], startAngle: 225, endAngle: -45 },
    )
    await settle()
    // 270° sweep: the track is open at the bottom, so it is not a full annulus.
    const track = wrapper.find('[data-slot=chart-radial-bar-track]').attributes('d')!
    expect(track.match(/A\d+,\d+,0,1,1/g)).toHaveLength(1)
    // Pointer in the gap at the bottom: no tooltip. On the left side of the ring: tooltip.
    await hover(wrapper, 100, 160)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').exists()).toBe(false)
    await hover(wrapper, 40, 100)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('Active')
    wrapper.unmount()
  })

  it('colors rings with ChartCell before the datum fill', async () => {
    const wrapper = mountChart(() => [bar({}, () => [h(ChartCell, { fill: 'red' })])])
    await settle()
    expect(
      wrapper
        .findAll('[data-slot=chart-radial-bar-sector]')
        .map((sector) => sector.attributes('fill')),
    ).toEqual(['red', 'var(--chart-3)'])
    wrapper.unmount()
  })

  it('shows the ring under the pointer in the tooltip', async () => {
    let received: ChartTooltipSlotProps | undefined
    const wrapper = mountChart(() => [
      bar(),
      h(
        ChartTooltip,
        { isAnimationActive: false },
        {
          content: (props: ChartTooltipSlotProps) => {
            received = props
            return h(
              'div',
              { 'data-test': 'custom' },
              props.payload.map((entry) => `${entry.name}:${entry.value}`).join(','),
            )
          },
        },
      ),
    ])
    await settle()
    // Radius 40: first band (30–55).
    await hover(wrapper, 100, 60)
    expect(wrapper.find('[data-test=custom]').text()).toBe('Calories:50')
    expect(received?.payload[0]).toMatchObject({ color: 'var(--chart-4)', fill: 'var(--chart-4)' })
    expect(received?.label).toBeUndefined()
    expect(received?.coordinate).toEqual({ x: 100, y: 60 })
    expect(
      wrapper.find('[data-slot=chart-radial-bar-sector][data-index="0"]').attributes('data-active'),
    ).toBe('true')
    // Radius 70: second band.
    await hover(wrapper, 30, 100)
    expect(wrapper.find('[data-test=custom]').text()).toBe('Steps:100')
    // Center hole and outside the rings: the tooltip hides.
    await hover(wrapper, 100, 100)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe(
      'closed',
    )
    await hover(wrapper, 30, 100)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe('open')
    await hover(wrapper, 100, 5)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe(
      'closed',
    )
    wrapper.unmount()
  })

  it('moves between rings with the arrow keys', async () => {
    const wrapper = mountChart(() => [bar(), h(ChartTooltip, { isAnimationActive: false })])
    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    await svg.trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('Calories')
    await svg.trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('Steps')
    wrapper.unmount()
  })

  it('re-bands the rings when the data length changes and drops a stale active ring', async () => {
    const wrapper = mountChart(() => [bar(), h(ChartTooltip, { isAnimationActive: false })])
    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    await svg.trigger('keydown', { key: 'End' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('Steps')

    await wrapper.setProps({ data: data.slice(0, 1) })
    await settle()
    expect(wrapper.findAll('[data-slot=chart-radial-bar-sector]')).toHaveLength(1)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe(
      'closed',
    )

    await wrapper.setProps({
      data: [...data, { name: 'Exercise', value: 25, fill: 'var(--chart-5)' }],
    })
    await settle()
    expect(wrapper.findAll('[data-slot=chart-radial-bar-sector]')).toHaveLength(3)
    // Three rings share 30–80px: bands of 50 / 3 px, the last one outermost.
    await hover(wrapper, 100, 100 - 75)
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('Exercise')
    wrapper.unmount()
  })
})

describe('RadialChart generated mode', () => {
  // No tweens: shapes land on their final geometry at once.
  beforeAll(() => vi.stubGlobal('matchMedia', () => ({ matches: true })))
  afterAll(() => vi.unstubAllGlobals())

  const goals = [
    { name: 'Move', progress: 40 },
    { name: 'Exercise', progress: 80 },
  ]

  const mountGenerated = (props: Record<string, unknown> = {}, slots: Record<string, any> = {}) => {
    return mount(RadialChart, {
      props: { data: goals, index: 'name', width: SIZE, height: SIZE, margin, ...props },
      slots,
      attachTo: document.body,
    })
  }

  const mountComposed = (children: () => any[], props: Record<string, unknown> = {}) => {
    return mount(RadialChart, {
      props: { data: goals, width: SIZE, height: SIZE, margin, ...props },
      slots: { default: children },
      attachTo: document.body,
    })
  }

  const paths = (wrapper: ReturnType<typeof mountComposed>, slot: string) =>
    wrapper.findAll(`[data-slot=${slot}]`).map((path) => path.attributes('d'))

  it('draws rounded rings with tracks, colored from the palette, like the hand-composed parts', async () => {
    const generated = mountGenerated()
    const composed = mountComposed(() => [
      h(ChartRadialBar, {
        dataKey: 'progress',
        background: true,
        cornerRadius: 12,
        isAnimationActive: false,
      }),
    ])
    await settle()
    expect(
      generated
        .findAll('[data-slot=chart-radial-bar-sector]')
        .map((sector) => sector.attributes('fill')),
    ).toEqual(['var(--chart-3)', 'var(--chart-1)'])
    expect(paths(generated, 'chart-radial-bar-sector')).toEqual(
      paths(composed, 'chart-radial-bar-sector'),
    )
    expect(paths(generated, 'chart-radial-bar-track')).toHaveLength(2)
    expect(paths(generated, 'chart-radial-bar-track')).toEqual(
      paths(composed, 'chart-radial-bar-track'),
    )
    generated.unmount()
    composed.unmount()
  })

  it('scales a full bar to max and draws a gauge', async () => {
    const generated = mountGenerated({ max: 100, gauge: true, background: false })
    const composed = mountComposed(
      () => [
        h(ChartPolarAngleAxis, { type: 'number', domain: [0, 100], tick: false }),
        h(ChartRadialBar, { dataKey: 'progress', cornerRadius: 12, isAnimationActive: false }),
      ],
      { startAngle: 225, endAngle: -45 },
    )
    await settle()
    expect(paths(generated, 'chart-radial-bar-sector')).toEqual(
      paths(composed, 'chart-radial-bar-sector'),
    )
    expect(generated.find('[data-slot=chart-radial-bar-track]').exists()).toBe(false)
    // Explicit angles win over `gauge`.
    await generated.setProps({ startAngle: 90, endAngle: -270 })
    await settle()
    expect(paths(generated, 'chart-radial-bar-sector')).not.toEqual(
      paths(composed, 'chart-radial-bar-sector'),
    )
    generated.unmount()
    composed.unmount()
  })

  it('hides rings from the legend without rescaling the others', async () => {
    const wrapper = mountGenerated({ legend: true })
    await settle()
    const before = paths(wrapper, 'chart-radial-bar-sector')
    await wrapper.findAll('[data-slot=chart-legend-trigger]')[0]!.trigger('click')
    await settle()
    expect(wrapper.emitted('update:hidden')?.[0]).toEqual([['Move']])
    const sectors = wrapper.findAll('[data-slot=chart-radial-bar-sector]')
    expect(sectors).toHaveLength(1)
    expect(sectors[0]!.attributes('fill')).toBe('var(--chart-1)')
    // Exercise fills the same share of the sweep (80 of 80) on a wider band.
    expect(sectors[0]!.attributes('d')).not.toBe(before[1])
    wrapper.unmount()
  })

  it('shows the ring under keyboard focus in the tooltip, formatted', async () => {
    const wrapper = mountGenerated({ valueFormatter: (value: number) => `${value}%` })
    await settle()
    await wrapper.find('[data-slot=chart-surface]').trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').text()).toContain('40%')
    wrapper.unmount()
  })

  it('formats legend values with the root valueFormatter', async () => {
    const wrapper = mountGenerated({
      valueFormatter: (value: number, name: string) => `${name} ${value}%`,
      legend: { showValue: true },
    })
    await settle()
    expect(wrapper.findAll('[data-slot=chart-legend-value]').map((value) => value.text())).toEqual([
      'Move 40%',
      'Exercise 80%',
    ])
    wrapper.unmount()
  })

  it('renders #center with the total and the active ring', async () => {
    const wrapper = mountGenerated(
      {},
      {
        center: (p: { total: number; active: { name: string } | null }) =>
          h('span', { 'data-test': 'center' }, `${p.total}:${p.active?.name ?? '-'}`),
      },
    )
    await settle()
    expect(wrapper.find('[data-slot=chart-center]').attributes('style')).toContain('left: 100px')
    expect(wrapper.find('[data-test=center]').text()).toBe('120:-')
    await wrapper.find('[data-slot=chart-surface]').trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(wrapper.find('[data-test=center]').text()).toBe('120:Move')
    wrapper.unmount()
  })

  it('activates the first ring on keyboard focus and walks to the last with End', async () => {
    const wrapper = mountGenerated({ 'aria-label': 'Goal progress' })
    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    const live = () => wrapper.find('[data-slot=chart-tooltip-wrapper]').text()
    ;(svg.element as SVGElement).focus()
    await settle()
    expect(live()).toContain('Move')
    await svg.trigger('keydown', { key: 'End' })
    await settle()
    expect(live()).toContain('Exercise')
    await svg.trigger('keydown', { key: 'Home' })
    await settle()
    expect(live()).toContain('Move')
    wrapper.unmount()
  })

  it('is accessible idle and with a ring focused, with legend and center', async () => {
    const wrapper = mountGenerated(
      { legend: true, 'aria-label': 'Goal progress' },
      {
        center: (p: { total: number }) => h('span', `${p.total} points`),
      },
    )
    await settle()
    await expectAccessible(wrapper)
    ;(wrapper.find('[data-slot=chart-surface]').element as SVGElement).focus()
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe('open')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('keeps composition mode when index is not set', async () => {
    const wrapper = mountComposed(() => [])
    await settle()
    expect(wrapper.find('[data-slot=chart-radial-bar-sector]').exists()).toBe(false)
    wrapper.unmount()
  })
})
