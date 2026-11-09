import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProgressCircle from '@/components/progress-circle/ProgressCircle.vue'

describe('ProgressCircle theme', () => {
  // progress-circle.css spins the track of a root without `aria-valuenow`
  it('indeterminate drops aria-valuenow, which spins the track', () => {
    const wrapper = mount(ProgressCircle, { props: { indeterminate: true, value: 60 } })
    const root = wrapper.get('[data-slot="progress-circle"]')

    expect(root.attributes('aria-valuenow')).toBeUndefined()

    expect(wrapper.get('[data-slot="progress-circle-track"]').classes()).toEqual([
      'h-progress-circle__track',
    ])
  })

  it('maps size and color to modifier classes', () => {
    const wrapper = mount(ProgressCircle, { props: { size: 'lg', color: 'success' } })

    expect(wrapper.get('[data-slot="progress-circle"]').classes()).toEqual([
      'h-progress-circle',
      'h-progress-circle--success',
      'h-progress-circle--lg',
    ])
  })

  it('ui stroke classes sit next to the component classes', () => {
    const wrapper = mount(ProgressCircle, {
      props: { ui: { trackCircle: 'stroke-neutral-200', fillCircle: 'stroke-neutral-700' } },
    })

    expect(wrapper.get('[data-slot="progress-circle-track-circle"]').classes()).toEqual([
      'h-progress-circle__track-circle',
      'stroke-neutral-200',
    ])

    expect(wrapper.get('[data-slot="progress-circle-fill-circle"]').classes()).toEqual([
      'h-progress-circle__fill-circle',
      'stroke-neutral-700',
    ])
  })
})
