import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { h, nextTick } from 'vue'

import AreaChart from '@/components/area-chart/AreaChart.vue'
import ChartArea from '@/components/chart/ChartArea.vue'
import ChartYAxis from '@/components/chart/ChartYAxis.vue'

const data = [
  { month: 'Jan', organic: 0, paid: 10 },
  { month: 'Feb', organic: 10, paid: 10 },
  { month: 'Mar', organic: 20, paid: 0 },
]

const settle = async () => {
  await flushPromises()
  await nextTick()
}

const mountChart = (props: Record<string, unknown> = {}) => {
  const children = (): VNode[] => [
    h(ChartYAxis, { width: 40 }),
    h(ChartArea, { dataKey: 'organic', isAnimationActive: false }),
  ]

  return mount(AreaChart, {
    props: { data, width: 400, height: 200, ...props },
    slots: { default: children },
    attachTo: document.body,
  })
}

describe('AreaChart theme', () => {
  it('hides the axis line by default', async () => {
    const wrapper = mountChart({ margin: { top: 10, right: 0, bottom: 10, left: 0 } })

    await settle()
    expect(wrapper.find('[data-slot=chart-axis-line]').classes()).toContain('stroke-none')
    wrapper.unmount()
  })

  it('applies ui overrides to the drawn parts', async () => {
    const wrapper = mountChart({
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      ui: { tick: 'fill-foreground', series: 'custom-series' },
    })

    await settle()
    expect(wrapper.find('[data-slot=chart-tick]').classes()).toContain('fill-foreground')
    expect(wrapper.find('[data-slot=chart-area]').classes()).toContain('custom-series')
    wrapper.unmount()
  })
})
