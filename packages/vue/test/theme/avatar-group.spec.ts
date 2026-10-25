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
    expect(first.className).toContain('size-12')
    expect(second.className).toContain('size-8')
    expect(second.className).not.toContain('size-12')
  })

  it('grid drops the stacked overlap', () => {
    const stacked = mount(AvatarGroup, { slots: { default: avatars(2) } })
    const grid = mount(AvatarGroup, { props: { grid: true }, slots: { default: avatars(2) } })
    expect(stacked.classes().join(' ')).toContain('mask-image')
    expect(grid.classes().join(' ')).not.toContain('mask-image')
    expect(grid.classes()).toContain('flex-wrap')
  })
})
