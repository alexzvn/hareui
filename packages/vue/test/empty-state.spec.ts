import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { defineComponent, h } from 'vue'

import EmptyState from '@/components/empty-state/EmptyState.vue'
import TagGroup from '@/components/tag-group/TagGroup.vue'

import { expectAccessible } from './a11y'

const mountAll = (children: () => VNode[]) =>
  mount(
    defineComponent(() => () => h('div', children())),
    { attachTo: document.body },
  )

describe('EmptyState', () => {
  it('renders "No results found" by default with the empty-state slot', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.attributes('data-slot')).toBe('empty-state')
    expect(wrapper.text()).toBe('No results found')
  })

  it('renders slot content', () => {
    const wrapper = mount(EmptyState, { slots: { default: () => 'No team members' } })
    expect(wrapper.text()).toBe('No team members')
  })

  it('renders inside an empty TagGroup list via #empty, and disappears once items exist', async () => {
    const wrapper = mount(TagGroup, {
      props: { 'aria-label': 'Team', items: [] },
      slots: { empty: () => 'No team members' },
    })

    const list = wrapper.get('[data-slot=tag-group-list]')
    expect(list.attributes('data-empty')).toBe('true')
    expect(list.text()).toBe('No team members')
    await wrapper.setProps({ items: [{ id: 'fred', label: 'Fred' }] })
    expect(wrapper.get('[data-slot=tag-group-list]').text()).toBe('Fred')
  })

  it('is accessible with the default and custom content, and can be announced as a status', async () => {
    const wrapper = mountAll(() => [
      h(EmptyState),
      h(EmptyState, { role: 'status' }, () => 'No team members'),
    ])

    expect(wrapper.get('[role=status]').text()).toBe('No team members')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
