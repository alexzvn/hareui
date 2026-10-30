import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import EmptyState from '@/components/empty-state/EmptyState.vue'

describe('EmptyState theme', () => {
  it('applies the default padding and muted text', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['p-2', 'text-sm', 'text-muted']))
  })

  it('merges class over the theme padding', () => {
    const wrapper = mount(EmptyState, { props: { class: 'p-1' } })
    expect(wrapper.classes()).toContain('p-1')
    expect(wrapper.classes()).not.toContain('p-2')
  })
})
