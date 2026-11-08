import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import type { ChatListViewItem } from '@/components/chat-list-view'
import { ChatListView } from '@/components/chat-list-view'

import { expectAccessible } from './a11y'

const items: ChatListViewItem[] = [
  {
    value: 'lisbon',
    label: 'Weekend in Lisbon',
    description: 'Book the tram tour',
    meta: '2h ago',
  },
  {
    value: 'sourdough',
    label: 'Sourdough starter',
    description: 'Why is it so runny?',
    meta: 'Mon',
  },
]

const mountList = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(ChatListView, {
    props: { items, ariaLabel: 'Recent chats', ...props },
    slots,
    attachTo: document.body,
  })

const rows = (wrapper: ReturnType<typeof mountList>) => wrapper.findAll('[role=row]')

describe('ChatListView', () => {
  it('renders each thread with its title, preview and meta', async () => {
    const wrapper = mountList()
    const [first] = rows(wrapper)

    expect(rows(wrapper)).toHaveLength(2)
    expect(first!.get('[data-slot=chat-list-view-title]').text()).toBe('Weekend in Lisbon')
    expect(first!.get('[data-slot=chat-list-view-preview]').text()).toBe('Book the tram tour')
    expect(first!.get('[data-slot=chat-list-view-meta]').text()).toBe('2h ago')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('keeps only the title with density="compact"', () => {
    const wrapper = mountList({ density: 'compact' })

    expect(wrapper.find('[data-slot=chat-list-view-preview]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chat-list-view-meta]').exists()).toBe(false)
    expect(rows(wrapper)[1]!.text()).toBe('Sourdough starter')
    wrapper.unmount()
  })

  it('emits action with the thread value when a row is pressed', async () => {
    const wrapper = mount(ChatListView, {
      props: { items, ariaLabel: 'Recent chats', onAction: () => {} },
      attachTo: document.body,
    })

    await rows(wrapper)[1]!.trigger('click')

    expect(wrapper.emitted('action')).toEqual([['sourdough']])
    wrapper.unmount()
  })

  it('selects the open thread without a checkbox, replacing the previous one', async () => {
    const wrapper = mountList({ selectable: true, modelValue: 'lisbon' })

    expect(rows(wrapper)[0]!.attributes('aria-selected')).toBe('true')

    await rows(wrapper)[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['sourdough']])
    wrapper.unmount()
  })

  it('renders a custom meta through the item-meta slot', () => {
    const wrapper = mountList(
      {},
      { 'item-meta': ({ item }: { item: ChatListViewItem }) => h('b', `${item.meta}!`) },
    )

    expect(rows(wrapper)[0]!.get('[data-slot=chat-list-view-meta]').text()).toBe('2h ago!')
    wrapper.unmount()
  })

  it('keeps the open thread when its row is pressed again', async () => {
    const wrapper = mountList({ selectable: true, defaultValue: 'lisbon' })

    await rows(wrapper)[0]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(rows(wrapper)[0]!.attributes('aria-selected')).toBe('true')
    wrapper.unmount()
  })

  it('shows a chat icon on every thread unless the list or item sets another', () => {
    const custom = [{ ...items[0]!, icon: 'i-test' }, items[1]!]
    const wrapper = mountList({ items: custom })
    const [first, second] = rows(wrapper)

    expect(first!.get('[data-slot=chat-list-view-icon]').element.tagName).toBe('SPAN')
    expect(second!.get('[data-slot=chat-list-view-icon]').element.tagName).toBe('svg')
    wrapper.unmount()

    const hidden = mountList({ icon: false })

    expect(hidden.find('[data-slot=chat-list-view-icon]').exists()).toBe(false)
    hidden.unmount()
  })
})
