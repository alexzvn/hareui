import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import MetricGroup from '@/components/metric-group/MetricGroup.vue'
import Metric from '@/components/metric/Metric.vue'

import { expectAccessible } from './a11y'

const metrics = () => [
  h(Metric, { title: 'Orders', value: 120 }),
  h(Metric, { title: 'Refunds', value: 4 }),
]

describe('MetricGroup', () => {
  it('is accessible with several metrics', async () => {
    const wrapper = mount(MetricGroup, { slots: { default: metrics }, attachTo: document.body })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it.each([true, 'sm', 'md', 'lg', 'xl'] as const)(
    'exposes stacked=%s as data-stacked',
    (stacked) => {
      const wrapper = mount(MetricGroup, { props: { stacked }, slots: { default: metrics } })

      expect(wrapper.attributes('data-stacked')).toBe(String(stacked))
      wrapper.unmount()
    },
  )

  it('leaves data-stacked off by default', () => {
    const wrapper = mount(MetricGroup, { slots: { default: metrics } })
    expect(wrapper.attributes('data-stacked')).toBeUndefined()
    wrapper.unmount()
  })

  it('renders its metrics without separator elements', () => {
    const wrapper = mount(MetricGroup, { slots: { default: metrics } })
    expect(wrapper.findAll('dl')).toHaveLength(2)
    expect(wrapper.find('[role="separator"]').exists()).toBe(false)
    wrapper.unmount()
  })
})
