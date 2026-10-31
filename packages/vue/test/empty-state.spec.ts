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

describe('EmptyState parts', () => {
  const Glyph = defineComponent(() => () => h('svg', { 'data-testid': 'glyph' }))

  it('renders the title as a heading and the description, without the default text', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No projects', description: 'Create one.' },
    })

    expect(wrapper.get('h3').text()).toBe('No projects')
    expect(wrapper.get('[data-slot=empty-state-description]').text()).toBe('Create one.')
    expect(wrapper.text()).not.toContain('No results found')
  })

  it('renders the icon decoratively in the media area', () => {
    const wrapper = mount(EmptyState, { props: { icon: Glyph, title: 'Empty' } })
    const media = wrapper.get('[data-slot=empty-state-media]')
    expect(media.attributes('data-variant')).toBe('icon')
    expect(media.get('[data-testid=glyph]').attributes('aria-hidden')).toBe('true')
  })

  it('renders the avatar in the media area instead of the icon', () => {
    const wrapper = mount(EmptyState, { props: { avatar: { fallback: 'JD' }, icon: Glyph } })
    const media = wrapper.get('[data-slot=empty-state-media]')
    expect(media.attributes('data-variant')).toBe('default')
    expect(media.text()).toBe('JD')
    expect(wrapper.find('[data-testid=glyph]').exists()).toBe(false)
  })

  it('renders actions as buttons with their props and click handlers', async () => {
    const clicks: string[] = []
    const wrapper = mount(EmptyState, {
      props: {
        actions: [
          { label: 'Create', onClick: () => clicks.push('create') },
          { label: 'Import', disabled: true },
        ],
      },
    })

    const buttons = wrapper.findAll('[data-slot=empty-state-actions] button')
    expect(buttons.map((button) => button.text())).toEqual(['Create', 'Import'])
    expect(buttons[1].attributes('disabled')).toBeDefined()
    await buttons[0].trigger('click')
    expect(clicks).toEqual(['create'])
  })

  it('lets the slots replace the media, title, description and actions', () => {
    const wrapper = mount(EmptyState, {
      props: {
        icon: Glyph,
        title: 'Prop title',
        description: 'Prop text',
        actions: [{ label: 'Prop action' }],
      },
      slots: {
        leading: () => h('span', 'Custom media'),
        title: () => 'Slot title',
        description: () => 'Slot text',
        actions: () => h('a', { href: '#' }, 'Slot action'),
      },
    })

    expect(wrapper.get('[data-slot=empty-state-media]').text()).toBe('Custom media')
    expect(wrapper.find('[data-testid=glyph]').exists()).toBe(false)
    expect(wrapper.get('h3').text()).toBe('Slot title')
    expect(wrapper.get('[data-slot=empty-state-description]').text()).toBe('Slot text')
    expect(wrapper.get('[data-slot=empty-state-actions]').text()).toBe('Slot action')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('reflects size and variant as data attributes, md and default by default', async () => {
    const wrapper = mount(EmptyState, { props: { title: 'Empty' } })
    expect(wrapper.attributes('data-size')).toBe('md')
    expect(wrapper.attributes('data-variant')).toBe('default')
    await wrapper.setProps({ size: 'lg', variant: 'outline' })
    expect(wrapper.attributes('data-size')).toBe('lg')
    expect(wrapper.attributes('data-variant')).toBe('outline')
  })

  it('keeps the plain default-slot rendering when no part is set', () => {
    const wrapper = mount(EmptyState, {
      props: { size: 'lg' },
      slots: { default: () => 'No team members' },
    })

    expect(wrapper.element.children).toHaveLength(0)
    expect(wrapper.text()).toBe('No team members')
    expect(wrapper.attributes('data-size')).toBeUndefined()
  })

  it('is accessible with every part set', async () => {
    const wrapper = mountAll(() => [
      h(EmptyState, {
        icon: Glyph,
        title: 'No projects',
        description: 'Create one to start.',
        actions: [{ label: 'Create' }],
      }),
    ])

    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
