import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import AvatarGroup from '@/components/avatar-group/AvatarGroup.vue'
import Avatar from '@/components/avatar/Avatar.vue'

const avatars = (n: number) => () =>
  Array.from({ length: n }, (_, i) => h(Avatar, { fallback: `A${i}` }))

describe('AvatarGroup theme', () => {
  it('group size fills in only where the Avatar omits it', () => {
    const wrapper = mount(AvatarGroup, {
      props: { size: 'lg' },
      slots: {
        default: () => [h(Avatar, { fallback: 'A' }), h(Avatar, { fallback: 'B', size: 'sm' })],
      },
    })

    const [first, second] = wrapper.element.children
    expect(first.classList).toContain('h-avatar--lg')
    expect(second.classList).toContain('h-avatar--sm')
    expect(second.classList).not.toContain('h-avatar--lg')
  })

  it('stacks with the clip overlap unless grid is set', () => {
    const stacked = mount(AvatarGroup, { slots: { default: avatars(2) } })
    const grid = mount(AvatarGroup, { props: { grid: true }, slots: { default: avatars(2) } })
    expect(stacked.classes()).toEqual(['h-avatar-group', 'h-avatar-group--clip'])
    expect(grid.classes()).toContain('h-avatar-group--grid')
  })

  it('maps overlap="ring" to the ring modifier', () => {
    const wrapper = mount(AvatarGroup, {
      props: { overlap: 'ring' },
      slots: { default: avatars(2) },
    })

    expect(wrapper.classes()).toContain('h-avatar-group--ring')
    expect(wrapper.classes()).not.toContain('h-avatar-group--clip')
  })
})
