import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { defineComponent, h } from 'vue'

import AvatarGroup from '@/components/avatar-group/AvatarGroup.vue'
import Avatar from '@/components/avatar/Avatar.vue'

import { expectAccessible } from './a11y'

const avatars = (n: number) => () =>
  Array.from({ length: n }, (_, i) => h(Avatar, { fallback: `A${i}` }))

const mountAll = (children: () => VNode[]) =>
  mount(
    defineComponent(() => () => h('div', children())),
    { attachTo: document.body },
  )

describe('AvatarGroup', () => {
  it('max truncates avatars and appends an automatic +N count', () => {
    const wrapper = mount(AvatarGroup, { props: { max: 3 }, slots: { default: avatars(5) } })
    const children = wrapper.element.children
    expect(children).toHaveLength(4)
    expect(children[3].getAttribute('data-slot')).toBe('avatar-group-count')
    expect(children[3].textContent).toBe('+2')
  })

  it('renders no count when max covers every avatar', () => {
    const wrapper = mount(AvatarGroup, { props: { max: 5 }, slots: { default: avatars(5) } })
    expect(wrapper.find('[data-slot="avatar-group-count"]').exists()).toBe(false)
  })

  it('#count replaces the automatic count and is not truncated by max', () => {
    const wrapper = mount(AvatarGroup, {
      props: { max: 2 },
      slots: { default: avatars(5), count: () => '+9' },
    })

    const counts = wrapper.findAll('[data-slot="avatar-group-count"]')
    expect(counts).toHaveLength(1)
    expect(counts[0].text()).toBe('+9')
    expect(wrapper.element.children).toHaveLength(3)
  })

  it('is accessible as a labelled group with an overflow count, and as a plain stack', async () => {
    const wrapper = mountAll(() => [
      h(AvatarGroup, { max: 3, role: 'group', 'aria-label': 'Assignees' }, avatars(5)),
      h(AvatarGroup, { grid: true }, avatars(2)),
    ])

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('forwards role and name to the root and exposes only the visible avatars plus the count', () => {
    const wrapper = mount(AvatarGroup, {
      props: { max: 2 },
      attrs: { role: 'group', 'aria-label': 'Viewers' },
      slots: { default: avatars(4) },
    })

    expect(wrapper.attributes()).toMatchObject({ role: 'group', 'aria-label': 'Viewers' })
    expect(wrapper.text()).toBe('A0A1+2')
    wrapper.unmount()
  })
})
