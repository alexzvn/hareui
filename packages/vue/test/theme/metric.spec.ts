import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Metric from '@/components/metric/Metric.vue'

describe('Metric theme', () => {
  it('makes an inline chart 70px high', () => {
    const wrapper = mount(Metric, {
      props: { value: 1, chartPlacement: 'inline' },
      slots: { chart: () => h('svg') },
    })

    expect(wrapper.get('[data-slot="metric-chart"]').classes()).toContain('h-[70px]')
  })
})
