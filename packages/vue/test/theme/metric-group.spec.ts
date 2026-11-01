import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MetricGroup from '@/components/metric-group/MetricGroup.vue'

describe('MetricGroup theme', () => {
  it('clips a horizontal row to one line', () => {
    const classes = mount(MetricGroup).classes()

    expect(classes).toContain('flex-row')
    expect(classes).toContain('overflow-hidden')
  })

  it('lets each card shrink to an equal share of the row', () => {
    const classes = mount(MetricGroup).classes()

    expect(classes).toContain('[&>[data-slot=metric]]:flex-1')
    expect(classes).toContain('[&>[data-slot=metric]]:min-w-0')
  })
})
