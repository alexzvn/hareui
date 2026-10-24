import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { defineComponent, h } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'
import Badge from '@/components/badge/Badge.vue'

import { expectAccessible } from './a11y'

const mountAll = (children: () => VNode[]) =>
  mount(
    defineComponent(() => () => h('div', children())),
    { attachTo: document.body },
  )

describe('Badge', () => {
  it('anchors the badge after the default slot and wraps content in a label', () => {
    const wrapper = mount(Badge, { props: { content: 5 }, slots: { default: () => h('img') } })
    const anchor = wrapper.element
    expect(anchor.getAttribute('data-slot')).toBe('badge-anchor')
    expect(
      [...anchor.children].map((c) => c.getAttribute('data-slot') ?? c.tagName.toLowerCase()),
    ).toEqual(['img', 'badge'])
    expect(wrapper.get('[data-slot="badge-label"]').text()).toBe('5')
  })

  it('renders a dot with no label when there is no content', () => {
    const wrapper = mount(Badge, { slots: { default: () => h('img') } })
    expect(wrapper.get('[data-slot="badge"]').element.children).toHaveLength(0)
  })

  it('renders #content without the label wrapper', () => {
    const wrapper = mount(Badge, { slots: { default: () => h('img'), content: () => h('svg') } })
    expect(wrapper.find('[data-slot="badge-label"]').exists()).toBe(false)
    expect(wrapper.find('[data-slot="badge"] svg').exists()).toBe(true)
  })

  it('renders standalone without an anchor, class landing on the badge', () => {
    const wrapper = mount(Badge, { props: { content: 'New', class: 'min-w-5' } })
    expect(wrapper.attributes('data-slot')).toBe('badge')
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

  it('is accessible anchored with content, as a dot, with icon content and standalone', async () => {
    const wrapper = mountAll(() => [
      h(Badge, { content: 5, color: 'danger' }, () => h(Avatar, { fallback: 'JD' })),
      h(Badge, { color: 'success' }, () => h(Avatar, { fallback: 'AB' })),
      h(Badge, null, {
        default: () => h('button', { type: 'button' }, 'Inbox'),
        content: () => h('svg', { 'aria-hidden': 'true', viewBox: '0 0 16 16' }),
      }),
      h(Badge, { content: 'New' }),
    ])
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it("content is part of the anchor's text, and #content can give a dot badge a visually hidden name", () => {
    const counted = mount(Badge, {
      props: { content: 3 },
      slots: { default: () => h('span', 'Messages') },
    })
    expect(counted.text()).toBe('Messages3')
    counted.unmount()

    const dot = mount(Badge, {
      slots: {
        default: () => h(Avatar, { fallback: 'JD' }),
        content: () => h('span', { class: 'sr-only' }, 'Online'),
      },
    })
    expect(dot.get('[data-slot=badge]').text()).toBe('Online')
    dot.unmount()
  })
})
