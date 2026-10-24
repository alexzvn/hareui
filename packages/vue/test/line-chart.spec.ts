import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import ChartLine from '../src/components/chart/ChartLine.vue'
import ChartTooltip from '../src/components/chart/ChartTooltip.vue'
import ChartXAxis from '../src/components/chart/ChartXAxis.vue'
import LineChart from '../src/components/line-chart/LineChart.vue'
import { expectAccessible } from './a11y'

const WIDTH = 400
const HEIGHT = 200
const margin = { top: 0, right: 0, bottom: 0, left: 0 }

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
  { month: 'Jan', organic: 0, paid: 10 },
  { month: 'Feb', organic: 10, paid: 5 },
  { month: 'Mar', organic: 20, paid: 0 },
]

function mountChart(children: () => any[], props: Record<string, unknown> = {}) {
  return mount(LineChart, {
    props: { data, width: WIDTH, height: HEIGHT, margin, ...props },
    slots: { default: children },
    attachTo: document.body,
  })
}

describe('LineChart', () => {
  it('draws one path per series across the plot area', async () => {
    const wrapper = mountChart(() => [
      h(ChartLine, { dataKey: 'organic', type: 'linear', dot: false, isAnimationActive: false }),
      h(ChartLine, { dataKey: 'paid', type: 'linear', dot: false, isAnimationActive: false }),
    ])
    await settle()
    const paths = wrapper.findAll('[data-slot=chart-line-curve]')
    expect(paths).toHaveLength(2)
    // Point scale over [0, 400]; implicit y domain [0, 20] over [200, 0].
    expect(paths[0].attributes('d')).toBe('M0,200L200,100L400,0')
    expect(paths[1].attributes('d')).toBe('M0,100L200,150L400,200')
    wrapper.unmount()
  })

  it('applies stroke, width and dash props to the path', async () => {
    const wrapper = mountChart(() => [
      h(ChartLine, {
        dataKey: 'organic',
        stroke: 'var(--chart-2)',
        strokeWidth: 2,
        strokeDasharray: '5 5',
        dot: false,
        isAnimationActive: false,
      }),
    ])
    await settle()
    const path = wrapper.find('[data-slot=chart-line-curve]')
    expect(path.attributes('stroke')).toBe('var(--chart-2)')
    expect(path.attributes('stroke-width')).toBe('2')
    expect(path.attributes('stroke-dasharray')).toBe('5 5')
    wrapper.unmount()
  })

  it('renders a dot per datum when dot is set', async () => {
    const wrapper = mountChart(() => [
      h(ChartLine, {
        dataKey: 'organic',
        dot: { r: 3, fill: 'red', strokeWidth: 0 },
        isAnimationActive: false,
      }),
    ])
    await settle()
    const dots = wrapper.findAll('[data-slot=chart-dot]')
    expect(dots).toHaveLength(3)
    expect(dots[0].attributes('r')).toBe('3')
    expect(dots[0].attributes('fill')).toBe('red')
    wrapper.unmount()
  })

  it('hovering shows a tooltip with the payload of the nearest point', async () => {
    const wrapper = mountChart(() => [
      h(ChartXAxis, { dataKey: 'month', hide: true }),
      h(ChartLine, { dataKey: 'organic', name: 'Organic', dot: false, isAnimationActive: false }),
      h(ChartLine, { dataKey: 'paid', name: 'Paid', dot: false, isAnimationActive: false }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    // Between Feb (x=200) and Mar (x=400), nearer Feb.
    await hover(wrapper, 290, 50)
    const panel = wrapper.find('[data-slot=chart-tooltip]')
    expect(panel.find('[data-slot=chart-tooltip-header]').text()).toBe('Feb')
    expect(panel.findAll('[data-slot=chart-tooltip-label]').map((label) => label.text())).toEqual([
      'Organic',
      'Paid',
    ])
    expect(panel.findAll('[data-slot=chart-tooltip-value]').map((value) => value.text())).toEqual([
      '10',
      '5',
    ])
    wrapper.unmount()
  })

  it('passes label and payload to the #content slot of ChartTooltip', async () => {
    const seen: Array<{
      label: unknown
      payload: Array<{ dataKey: string; value: unknown; color: string }>
    }> = []
    const wrapper = mountChart(() => [
      h(ChartXAxis, { dataKey: 'month', hide: true }),
      h(ChartLine, {
        dataKey: 'organic',
        stroke: 'var(--chart-3)',
        dot: false,
        isAnimationActive: false,
      }),
      h(
        ChartTooltip,
        { isAnimationActive: false },
        {
          content: (props: any) => {
            if (props.active) seen.push({ label: props.label, payload: props.payload })
            return h('div', { class: 'custom' }, String(props.label))
          },
        },
      ),
    ])
    await settle()
    await hover(wrapper, 395, 10)
    const last = seen.at(-1)!
    expect(last.label).toBe('Mar')
    expect(last.payload[0]).toMatchObject({
      dataKey: 'organic',
      value: 20,
      color: 'var(--chart-3)',
    })
    wrapper.unmount()
  })

  it('arrow keys move the active point when the chart has a tooltip', async () => {
    const wrapper = mountChart(() => [
      h(ChartXAxis, { dataKey: 'month', hide: true }),
      h(ChartLine, { dataKey: 'organic', name: 'Organic', dot: false, isAnimationActive: false }),
      h(ChartTooltip, { isAnimationActive: false }),
    ])
    await settle()
    const surface = wrapper.find('[data-slot=chart-surface]')
    // Keyboard focus activates the first point; arrows move from there.
    ;(surface.element as SVGElement).focus()
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip]').text()).toContain('Jan')
    await surface.trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip]').text()).toContain('Feb')
    await surface.trigger('keydown', { key: 'End' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip]').text()).toContain('Mar')
    await surface.trigger('keydown', { key: 'Escape' })
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').attributes('data-state')).toBe(
      'closed',
    )
    wrapper.unmount()
  })

  it('is accessible idle, with a hidden series, and with a point focused', async () => {
    const wrapper = mount(LineChart, {
      props: {
        data: data,
        index: 'month',
        width: WIDTH,
        height: HEIGHT,
        legend: true,
        hidden: ['paid'],
        'aria-label': 'Sessions per month',
      },
      attachTo: document.body,
    })
    await settle()
    await expectAccessible(wrapper)
    ;(wrapper.find('[data-slot=chart-surface]').element as SVGElement).focus()
    await settle()
    const live = wrapper.find('[data-slot=chart-tooltip-wrapper]')
    expect(live.attributes('role')).toBe('status')
    expect(live.text()).toContain('Jan')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  describe('mount animation', () => {
    // The prototype jsdom actually gives `<path>` (SVGPathElement when present, else SVGElement).
    const proto = Object.getPrototypeOf(
      document.createElementNS('http://www.w3.org/2000/svg', 'path'),
    ) as { getTotalLength?: () => number }
    const hadLength = Object.prototype.hasOwnProperty.call(proto, 'getTotalLength')

    afterEach(() => {
      vi.unstubAllGlobals()
      vi.restoreAllMocks()
      if (!hadLength) delete proto.getTotalLength
    })

    it('measures the path length once per series, not every frame of the reveal', async () => {
      if (!hadLength) proto.getTotalLength = () => 0
      const getTotalLength = vi
        .spyOn(proto as Required<typeof proto>, 'getTotalLength')
        .mockReturnValue(500)
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
        h(ChartLine, {
          dataKey: 'organic',
          dot: false,
          animationDuration: 1000,
          animationEasing: 'linear',
        }),
        h(ChartLine, {
          dataKey: 'paid',
          dot: false,
          animationDuration: 1000,
          animationEasing: 'linear',
        }),
      ])
      await settle()
      for (const time of [100, 200, 300, 400, 500, 600]) {
        frame(time)
        await settle()
      }
      // Still drawing on: the dash grows with the reveal.
      const [dash, gap] = wrapper
        .find('[data-slot=chart-line-curve]')
        .attributes('stroke-dasharray')!
        .split(' ')
      expect(Number.parseFloat(dash!)).toBeCloseTo(300, 3)
      expect(gap).toBe('500px')
      expect(getTotalLength.mock.calls.length).toBeLessThanOrEqual(2)
      wrapper.unmount()
    })
  })
})
