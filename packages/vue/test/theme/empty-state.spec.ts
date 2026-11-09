import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import EmptyState from '@/components/empty-state/EmptyState.vue'

describe('EmptyState theme', () => {
  it('renders the plain line without the structured layout', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.classes()).toEqual(['h-empty-state'])
  })

  it('switches to the structured layout with any part beyond the default slot', () => {
    const wrapper = mount(EmptyState, { props: { title: 'No files', size: 'sm' } })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['h-empty-state', 'h-empty-state--structured', 'h-empty-state--sm']),
    )
  })

  it('marks icon media for the muted circle only', () => {
    const icon = mount(EmptyState, { props: { icon: 'i-folder' } })
    expect(icon.get('[data-slot=empty-state-media]').classes()).toContain(
      'h-empty-state__media--icon',
    )

    const avatar = mount(EmptyState, { props: { avatar: { fallback: 'JD' } } })
    expect(avatar.get('[data-slot=empty-state-media]').classes()).not.toContain(
      'h-empty-state__media--icon',
    )
  })

  it('keeps a class utility next to the component class', () => {
    const wrapper = mount(EmptyState, { props: { class: 'p-1' } })
    expect(wrapper.classes()).toEqual(['h-empty-state', 'p-1'])
  })
})
