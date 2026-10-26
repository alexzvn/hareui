import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProgressCircle from '@/components/progress-circle/ProgressCircle.vue'

describe('ProgressCircle theme', () => {
  it('indeterminate spins the track', () => {
    const wrapper = mount(ProgressCircle, { props: { indeterminate: true, value: 60 } })

    expect(wrapper.get('[data-slot="progress-circle-track"]').classes()).toContain(
      'animate-progress-circle-spin',
    )
  })

  it('ui stroke classes replace the themed stroke colors', () => {
    const wrapper = mount(ProgressCircle, {
      props: { ui: { trackCircle: 'stroke-neutral-200', fillCircle: 'stroke-neutral-700' } },
    })

    const fill = wrapper.get('[data-slot="progress-circle-fill-circle"]')

    expect(wrapper.get('[data-slot="progress-circle-track-circle"]').classes()).toEqual([
      'stroke-neutral-200',
    ])

    expect(fill.classes()).toContain('stroke-neutral-700')
    expect(fill.classes()).not.toContain('stroke-(--progress-circle-stroke)')
  })
})
