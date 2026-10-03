import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import EmptyState from '../src/components/EmptyState.vue'
import TagGroup from '../src/components/TagGroup.vue'

describe('EmptyState', () => {
  it('renders "No results found" by default with the empty-state slot', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.attributes('data-slot')).toBe('empty-state')
    expect(wrapper.text()).toBe('No results found')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['p-2', 'text-sm', 'text-muted']))
  })

  it('renders slot content and merges class over the theme padding', () => {
    const wrapper = mount(EmptyState, { props: { class: 'p-1' }, slots: { default: () => 'No team members' } })
    expect(wrapper.text()).toBe('No team members')
    expect(wrapper.classes()).toContain('p-1')
    expect(wrapper.classes()).not.toContain('p-2')
  })

  it('renders inside an empty TagGroup list via #empty, and disappears once items exist', async () => {
    const wrapper = mount(TagGroup, {
      props: { 'aria-label': 'Team', 'items': [] },
      slots: { empty: () => 'No team members' },
    })
    const list = wrapper.get('[data-slot=tag-group-list]')
    expect(list.attributes('data-empty')).toBe('true')
    expect(list.text()).toBe('No team members')
    await wrapper.setProps({ items: [{ id: 'fred', label: 'Fred' }] })
    expect(wrapper.get('[data-slot=tag-group-list]').text()).toBe('Fred')
  })
})
