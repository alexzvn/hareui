import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ChartLegend from '@/components/chart-legend/ChartLegend.vue'

describe('ChartLegend theme', () => {
  it('merges class and ui overrides', () => {
    const wrapper = mount(ChartLegend, {
      props: { series: ['a'], class: 'mt-4', ui: { label: 'text-danger' } },
    })

    expect(wrapper.classes()).toContain('mt-4')
    expect(wrapper.get('[data-slot="chart-legend-label"]').classes()).toContain('text-danger')
  })
})
