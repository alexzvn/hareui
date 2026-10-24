import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { VNode } from 'vue'
import { h, nextTick } from 'vue'

import AreaChart from '@/components/area-chart/AreaChart.vue'
import ChartArea from '@/components/chart/ChartArea.vue'
import ChartGrid from '@/components/chart/ChartGrid.vue'
import type { ChartTooltipSlotProps } from '@/components/chart/ChartTooltip.vue'
import ChartTooltip from '@/components/chart/ChartTooltip.vue'
import ChartXAxis from '@/components/chart/ChartXAxis.vue'
import ChartYAxis from '@/components/chart/ChartYAxis.vue'

import { expectAccessible } from './a11y'

const WIDTH = 400
const HEIGHT = 200
const margin = { top: 0, right: 0, bottom: 0, left: 0 }

const data = [
  { month: 'Jan', organic: 0, paid: 10 },
  { month: 'Feb', organic: 10, paid: 10 },
  { month: 'Mar', organic: 20, paid: 0 },
]

const settle = async () => {
  await flushPromises()
  await nextTick()
}

const mountChart = (children: () => VNode[], props: Record<string, unknown> = {}) => {
  return mount(AreaChart, {
    props: { data, width: WIDTH, height: HEIGHT, margin, ...props },
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

const press = async (wrapper: ReturnType<typeof mountChart>, key: string) => {
  await wrapper.find('[data-slot=chart-surface]').trigger('keydown', { key })
  await settle()
}

// A hidden category axis names the tooltip header without taking space.
const monthAxis = () => h(ChartXAxis, { dataKey: 'month', hide: true })

describe('AreaChart', () => {
  it('draws the area and its curve across the plot (point scale, y domain from 0)', async () => {
    const wrapper = mountChart(() => [
      h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
    ])

    await settle()

    expect(wrapper.find('[data-slot=chart-area-curve]').attributes('d')).toBe(
      'M0,200L200,100L400,0',
    )

    const fill = wrapper.find('[data-slot=chart-area-fill]')
    expect(fill.attributes('d')).toBe('M0,200L200,100L400,0L400,200L200,200L0,200Z')
    expect(fill.attributes('fill-opacity')).toBe('0.6')
    expect(fill.attributes('fill')).toBe('var(--chart-3)')
    wrapper.unmount()
  })

  it('passes stroke, fill and gradient urls through', async () => {
    const wrapper = mountChart(() => [
      h('defs', [h('linearGradient', { id: 'g' })]),
      h(ChartArea, {
        dataKey: 'organic',
        stroke: 'var(--chart-1)',
        strokeWidth: 2,
        fill: 'url(#g)',
        fillOpacity: 1,
        isAnimationActive: false,
      }),
    ])

    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    expect(svg.find('#g').exists()).toBe(true)
    expect(wrapper.find('[data-slot=chart-area-curve]').attributes('stroke')).toBe('var(--chart-1)')
    expect(wrapper.find('[data-slot=chart-area-curve]').attributes('stroke-width')).toBe('2')
    expect(wrapper.find('[data-slot=chart-area-fill]').attributes('fill')).toBe('url(#g)')
    wrapper.unmount()
  })

  it('skips the curve with stroke="none"', async () => {
    const wrapper = mountChart(() => [
      h(ChartArea, { dataKey: 'organic', stroke: 'none', isAnimationActive: false }),
    ])

    await settle()
    expect(wrapper.find('[data-slot=chart-area-curve]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chart-area-fill]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('stacks areas that share a stackId', async () => {
    const wrapper = mountChart(() => [
      h(ChartArea, { dataKey: 'organic', stackId: 'a', type: 'linear', isAnimationActive: false }),
      h(ChartArea, { dataKey: 'paid', stackId: 'a', type: 'linear', isAnimationActive: false }),
    ])

    await settle()

    // Totals [10, 20, 20] → y domain [0, 20]; the second area sits on top of the first.
    const curves = wrapper.findAll('[data-slot=chart-area-curve]')
    expect(curves[0].attributes('d')).toBe('M0,200L200,100L400,0')
    expect(curves[1].attributes('d')).toBe('M0,100L200,0L400,0')

    expect(wrapper.findAll('[data-slot=chart-area-fill]')[1].attributes('d')).toBe(
      'M0,100L200,0L400,0L400,0L200,100L0,200Z',
    )

    wrapper.unmount()
  })

  it('renders y axis ticks with nice values and hidden axis lines', async () => {
    // Vertical margin leaves room for the labels at both ends of the axis.
    const wrapper = mountChart(
      () => [
        h(ChartYAxis, { width: 40 }),
        h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
      ],
      { margin: { top: 10, right: 0, bottom: 10, left: 0 } },
    )

    await settle()
    const ticks = wrapper.findAll('[data-slot=chart-tick]')
    expect(ticks.map((tick) => tick.text())).toEqual(['0', '5', '10', '15', '20'])
    expect(ticks[0].attributes('text-anchor')).toBe('end')

    // Axis width shifts the plot: the first point sits at x = 40.
    expect(wrapper.find('[data-slot=chart-area-curve]').attributes('d')).toMatch(/^M40,190/)
    expect(wrapper.find('[data-slot=chart-axis-line]').classes()).toContain('stroke-none')
    wrapper.unmount()
  })

  it('draws horizontal grid lines at the y ticks', async () => {
    const wrapper = mountChart(() => [
      h(ChartGrid, { vertical: false }),
      h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
    ])

    await settle()
    const lines = wrapper.findAll('[data-slot=chart-grid-line]')
    expect(lines.map((line) => line.attributes('y1'))).toEqual(['200', '150', '100', '50', '0'])
    expect(lines.every((line) => line.attributes('data-direction') === 'horizontal')).toBe(true)
    wrapper.unmount()
  })

  it('adds grid lines along the plot edges unless synced with the ticks', async () => {
    const wrapper = mountChart(() => [
      // No axis has this id: only the edge lines remain.
      h(ChartGrid, { vertical: false, yAxisId: 'missing' }),
      h(ChartGrid, { horizontal: false, xAxisId: 'missing', syncWithTicks: true }),
      h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
    ])

    await settle()
    const lines = wrapper.findAll('[data-slot=chart-grid-line]')
    expect(lines.map((line) => [line.attributes('data-direction'), line.attributes('y1')])).toEqual(
      [
        ['horizontal', '0'],
        ['horizontal', '200'],
      ],
    )

    wrapper.unmount()
  })

  it('shows the tooltip, cursor and active dot for the hovered datum', async () => {
    const wrapper = mountChart(() => [
      monthAxis(),
      h(ChartArea, {
        dataKey: 'organic',
        name: 'Organic',
        stroke: 'var(--chart-3)',
        isAnimationActive: false,
      }),
      h(ChartArea, {
        dataKey: 'paid',
        name: 'Paid',
        stroke: 'var(--chart-1)',
        isAnimationActive: false,
      }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])

    await settle()
    await hover(wrapper, 190, 120)
    const tooltip = wrapper.find('[data-slot=chart-tooltip-wrapper]')
    expect(tooltip.exists()).toBe(true)

    // Mounted from inside the <svg>, the panel must still be an HTML element to render.
    expect(tooltip.element.namespaceURI).toBe('http://www.w3.org/1999/xhtml')
    expect(tooltip.text()).toContain('Feb')
    expect(tooltip.text()).toContain('Organic')
    expect(tooltip.text()).toContain('Paid')
    expect(wrapper.find('[data-slot=chart-cursor]').attributes('d')).toBe('M200,0L200,200')
    const dots = wrapper.findAll('[data-slot=chart-active-dot]')
    expect(dots).toHaveLength(2)
    expect(dots[0].attributes('cx')).toBe('200')
    expect(dots[0].attributes('cy')).toBe('100')

    const surface = wrapper.find('[data-slot=chart-surface]')
    surface.element.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }))
    await settle()

    // Hidden, not unmounted: the next hover slides the same panel from here.
    expect(tooltip.attributes('data-state')).toBe('closed')
    expect(tooltip.isVisible()).toBe(false)
    expect(wrapper.find('[data-slot=chart-cursor]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chart-active-dot]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('keeps the tooltip while the pointer moves between points, snapping to the nearest one', async () => {
    const wrapper = mountChart(() => [
      monthAxis(),
      h(ChartArea, { dataKey: 'organic', name: 'Organic', isAnimationActive: false }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])

    await settle()

    // Points sit at x = 0, 200 and 400.
    await hover(wrapper, 130, 190)
    const tooltip = wrapper.find('[data-slot=chart-tooltip-wrapper]')
    expect(tooltip.attributes('data-state')).toBe('open')
    expect(tooltip.find('[data-slot=chart-tooltip-header]').text()).toBe('Feb')
    expect(wrapper.find('[data-slot=chart-cursor]').attributes('d')).toBe('M200,0L200,200')
    await hover(wrapper, 90, 190)
    const moved = wrapper.find('[data-slot=chart-tooltip-wrapper]')

    // Same element: the panel moves instead of being re-mounted.
    expect(moved.element).toBe(tooltip.element)
    expect(moved.attributes('data-state')).toBe('open')
    expect(moved.find('[data-slot=chart-tooltip-header]').text()).toBe('Jan')
    expect(wrapper.find('[data-slot=chart-cursor]').attributes('d')).toBe('M0,0L0,200')
    expect(wrapper.find('[data-slot=chart-active-dot]').attributes('cx')).toBe('0')
    wrapper.unmount()
  })

  it('slides the panel between positions and hides it outside the plot area', async () => {
    const wrapper = mountChart(
      () => [
        monthAxis(),
        h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
        h(ChartTooltip, { animationDuration: 250 }),
      ],
      { margin: { top: 10, right: 10, bottom: 10, left: 10 } },
    )

    await settle()
    await hover(wrapper, 100, 100)
    const tooltip = wrapper.find('[data-slot=chart-tooltip-wrapper]')
    expect((tooltip.element as HTMLElement).style.transition).toBe('transform 250ms ease')

    // Inside the svg but in the margin: no datum.
    await hover(wrapper, 100, 5)
    expect(tooltip.attributes('data-state')).toBe('closed')
    expect((tooltip.element as HTMLElement).style.transition).toBe('')
    wrapper.unmount()
  })

  it('passes label, payload and coordinate to the #content slot', async () => {
    let received: ChartTooltipSlotProps | undefined
    const wrapper = mountChart(() => [
      monthAxis(),
      h(ChartArea, {
        dataKey: 'organic',
        name: 'Organic',
        stroke: 'var(--chart-3)',
        fill: 'url(#g)',
        isAnimationActive: false,
      }),
      h(ChartArea, { dataKey: 'paid', tooltipType: 'none', isAnimationActive: false }),
      h(ChartArea, { dataKey: 'paid', hide: true, isAnimationActive: false }),
      h(
        ChartTooltip,
        { isAnimationActive: false },
        {
          content: (props: ChartTooltipSlotProps) => {
            received = props
            return h('div', { 'data-test': 'custom' }, String(props.label))
          },
        },
      ),
    ])

    await settle()
    await hover(wrapper, 390, 50)
    expect(wrapper.find('[data-test=custom]').text()).toBe('Mar')
    expect(received?.active).toBe(true)
    expect(received?.coordinate).toEqual({ x: 400, y: 50 })
    expect(received?.payload).toHaveLength(1)

    expect(received?.payload[0]).toMatchObject({
      dataKey: 'organic',
      name: 'Organic',
      value: 20,
      color: 'var(--chart-3)',
      stroke: 'var(--chart-3)',
      fill: 'url(#g)',
    })

    expect(received?.payload[0]?.payload).toEqual(data[2])
    wrapper.unmount()
  })

  it('moves the active datum with the keyboard', async () => {
    const wrapper = mountChart(() => [
      monthAxis(),
      h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])

    await settle()
    const header = () => wrapper.find('[data-slot=chart-tooltip-header]').text()
    expect(wrapper.find('[data-slot=chart-surface]').attributes('tabindex')).toBe('0')
    await press(wrapper, 'ArrowRight')
    expect(header()).toBe('Jan')
    await press(wrapper, 'ArrowDown')
    expect(header()).toBe('Feb')
    expect(wrapper.find('[data-slot=chart-tooltip-value]').text()).toBe('10')
    await press(wrapper, 'End')
    expect(header()).toBe('Mar')
    await press(wrapper, 'ArrowRight')
    expect(header()).toBe('Mar')
    await press(wrapper, 'ArrowUp')
    expect(header()).toBe('Feb')
    await press(wrapper, 'Home')
    expect(header()).toBe('Jan')
    await press(wrapper, 'ArrowLeft')
    expect(header()).toBe('Jan')
    await press(wrapper, 'Escape')
    const tooltip = wrapper.find('[data-slot=chart-tooltip-wrapper]')
    expect(tooltip.attributes('data-state')).toBe('closed')
    expect(tooltip.isVisible()).toBe(false)
    await press(wrapper, 'ArrowLeft')

    // From nothing, ArrowLeft starts at the last datum.
    expect(header()).toBe('Mar')
    await wrapper.find('[data-slot=chart-surface]').trigger('blur')
    await settle()
    expect(tooltip.attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('activates the first datum on keyboard focus, not on pointer focus', async () => {
    const wrapper = mountChart(() => [
      monthAxis(),
      h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])

    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    ;(svg.element as SVGElement).focus()
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-header]').text()).toBe('Jan')
    expect(wrapper.find('[data-slot=chart-active-dot]').attributes('cx')).toBe('0')
    ;(svg.element as SVGElement).blur()
    await settle()
    expect(wrapper.find('[data-slot=chart-active-dot]').exists()).toBe(false)

    // A press focuses the chart too: the pressed datum wins, focus doesn't reset it to the first.
    svg.element.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 390, clientY: 100, bubbles: true }),
    )

    ;(svg.element as SVGElement).focus()
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-header]').text()).toBe('Mar')
    wrapper.unmount()
  })

  describe('data change animation', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
      vi.restoreAllMocks()
    })

    it('tweens from the drawn shape when the number of points changes', async () => {
      let queue: FrameRequestCallback[] = []
      vi.spyOn(performance, 'now').mockReturnValue(0)

      vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
        queue.push(callback),
      )

      vi.stubGlobal('cancelAnimationFrame', () => {
        queue = []
      })

      const frame = (time: number) => {
        const run = queue
        queue = []
        run.forEach((callback) => callback(time))
      }

      const wrapper = mountChart(() => [
        h(ChartArea, { dataKey: 'organic', animationDuration: 100, animationEasing: 'linear' }),
      ])

      await settle()
      frame(100)
      await settle()
      const curve = () => wrapper.find('[data-slot=chart-area-curve]').attributes('d')
      expect(curve()).toBe('M0,200L200,100L400,0')

      // Three points become two: each new point starts from the old point at the same relative position.
      await wrapper.setProps({
        data: [
          { month: 'Jan', organic: 0 },
          { month: 'Mar', organic: 20 },
        ],
      })

      await settle()
      expect(curve()).toBe('M0,200L200,100')
      frame(50)
      await settle()
      expect(curve()).toBe('M0,200L300,50')
      frame(100)
      await settle()
      expect(curve()).toBe('M0,200L400,0')
      wrapper.unmount()
    })
  })

  it('exposes the focusable chart as an application with a live tooltip', async () => {
    const wrapper = mountChart(
      () => [
        monthAxis(),
        h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
        h(ChartTooltip, { isAnimationActive: false }),
      ],
      { 'aria-label': 'Organic sessions per month', id: 'sessions' },
    )

    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    expect(svg.attributes('role')).toBe('application')
    expect(svg.attributes('aria-label')).toBe('Organic sessions per month')

    // Other attributes stay on the container.
    expect(wrapper.attributes('id')).toBe('sessions')
    expect(wrapper.attributes('aria-label')).toBeUndefined()

    expect(
      svg.findAll('[data-layer]').every((layer) => layer.attributes('aria-hidden') === 'true'),
    ).toBe(true)

    await press(wrapper, 'ArrowRight')
    const tooltip = wrapper.find('[data-slot=chart-tooltip-wrapper]')
    expect(tooltip.attributes('role')).toBe('status')
    expect(tooltip.attributes('aria-live')).toBe('polite')
    wrapper.unmount()
  })

  it('tracks hover and announces the value without a panel', async () => {
    const wrapper = mountChart(() => [
      monthAxis(),
      h(ChartArea, { dataKey: 'organic', name: 'Organic', isAnimationActive: false }),
      h(ChartTooltip, { cursor: false, panel: false, isAnimationActive: false }),
    ])

    await settle()
    await hover(wrapper, 190, 100)
    expect(wrapper.find('[data-slot=chart-active-dot]').attributes('cx')).toBe('200')
    expect(wrapper.find('[data-slot=chart-cursor]').exists()).toBe(false)
    const live = wrapper.find('[data-slot=chart-tooltip-wrapper]')
    expect(live.attributes('role')).toBe('status')
    expect(live.attributes('data-panel')).toBe('false')

    // Visually hidden, not positioned: no floating panel.
    expect(live.classes()).toContain('sr-only')
    expect(live.attributes('style')).toBeUndefined()
    expect(live.text()).toContain('Feb')
    expect(live.text()).toContain('Organic')
    expect(live.text()).toContain('10')

    wrapper
      .find('[data-slot=chart-surface]')
      .element.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }))

    await settle()
    expect(live.text()).toBe('')
    expect(wrapper.find('[data-slot=chart-active-dot]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('is not focusable and ignores the pointer without a tooltip', async () => {
    const wrapper = mountChart(() => [
      h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
    ])

    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    expect(svg.attributes('tabindex')).toBeUndefined()
    expect(svg.attributes('role')).toBeUndefined()
    await hover(wrapper, 200, 100)
    expect(wrapper.find('[data-slot=chart-active-dot]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('is accessible idle and with a datum focused, legend included', async () => {
    const wrapper = mount(AreaChart, {
      props: {
        data: data,
        index: 'month',
        width: WIDTH,
        height: HEIGHT,
        legend: 'top',
        'aria-label': 'Sessions per month',
      },
      attachTo: document.body,
    })

    await settle()
    await expectAccessible(wrapper)
    await press(wrapper, 'ArrowRight')
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe('open')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('exposes a named sparkline as one image', async () => {
    const wrapper = mount(AreaChart, {
      props: {
        data: data,
        index: 'month',
        width: WIDTH,
        height: 40,
        sparkline: true,
        role: 'img',
        'aria-label': 'Organic sessions, rising',
      },
      attachTo: document.body,
    })

    await settle()
    const svg = wrapper.find('[data-slot=chart-surface]')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('tabindex')).toBeUndefined()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('renders a sparkline without axes or grid filling the whole box', async () => {
    const wrapper = mountChart(
      () => [h(ChartArea, { dataKey: 'organic', isAnimationActive: false })],
      { height: 40 },
    )

    await settle()
    expect(wrapper.find('[data-slot=chart-x-axis]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chart-grid]').exists()).toBe(false)

    // organic = [0, 10, 20] → y domain [0, 20] over [40, 0].
    expect(wrapper.find('[data-slot=chart-area-curve]').attributes('d')).toBe('M0,40L200,20L400,0')
    wrapper.unmount()
  })

  it('applies ui overrides to the drawn parts', async () => {
    const wrapper = mountChart(
      () => [
        h(ChartYAxis, { width: 40 }),
        h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
      ],
      { ui: { tick: 'fill-foreground', series: 'custom-series' } },
    )

    await settle()
    expect(wrapper.find('[data-slot=chart-tick]').classes()).toContain('fill-foreground')
    expect(wrapper.find('[data-slot=chart-area]').classes()).toContain('custom-series')
    wrapper.unmount()
  })

  it('updates the geometry when data changes', async () => {
    const wrapper = mountChart(() => [
      h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
    ])

    await settle()
    await wrapper.setProps({ data: data.map((row) => ({ ...row, organic: row.organic * 2 })) })
    await settle()

    // y domain grows to [0, 40] with the data, so the shape keeps its pixels.
    expect(wrapper.find('[data-slot=chart-area-curve]').attributes('d')).toBe(
      'M0,200L200,100L400,0',
    )

    await wrapper.setProps({ data: data.map((row) => ({ ...row, organic: 5 })) })
    await settle()

    // Constant 5 → nice ticks 0…8 (step 2): the line sits at 5/8 of the height.
    expect(wrapper.find('[data-slot=chart-area-curve]').attributes('d')).toBe('M0,75L200,75L400,75')
    wrapper.unmount()
  })
})
