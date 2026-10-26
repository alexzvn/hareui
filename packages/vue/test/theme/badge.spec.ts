import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Badge from '@/components/badge/Badge.vue'

describe('Badge theme', () => {
  it('lands class on a standalone badge, merged over the theme', () => {
    const wrapper = mount(Badge, { props: { content: 'New', class: 'min-w-5' } })
    expect(wrapper.classes()).toContain('min-w-5')
    expect(wrapper.classes()).not.toContain('min-w-7')
  })

  it('applies soft compound colors and placement', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'soft', color: 'success', placement: 'bottom-left' },
      slots: { default: () => 'x' },
    })

    const cls = wrapper.get('[data-slot="badge"]').classes()
    expect(cls).toEqual(
      expect.arrayContaining(['[--badge-bg:var(--success-soft)]', 'bottom-0', 'left-0']),
    )
  })
})
