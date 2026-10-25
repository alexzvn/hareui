import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import ChartRadialBar from '@/components/chart/ChartRadialBar.vue'
import RadialChart from '@/components/radial-chart/RadialChart.vue'

const data = [
  { name: 'Calories', value: 50, fill: 'var(--chart-4)' },
  { name: 'Steps', value: 100, fill: 'var(--chart-3)' },
]

describe('RadialChart theme', () => {
  it('fills the background tracks with the default surface', async () => {
    const wrapper = mount(RadialChart, {
      props: { data, width: 200, height: 200, margin: { top: 0, right: 0, bottom: 0, left: 0 } },
      slots: {
        default: () => [
          h(ChartRadialBar, { dataKey: 'value', isAnimationActive: false, background: true }),
        ],
      },
      attachTo: document.body,
    })

    await flushPromises()
    await nextTick()
    expect(wrapper.find('[data-slot=chart-radial-bar-track]').classes()).toContain('fill-default')
    wrapper.unmount()
  })
})
