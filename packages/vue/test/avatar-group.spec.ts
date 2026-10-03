import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Avatar from '../src/components/Avatar.vue'
import AvatarGroup from '../src/components/AvatarGroup.vue'

const avatars = (n: number) => () => Array.from({ length: n }, (_, i) => h(Avatar, { fallback: `A${i}` }))

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
    const wrapper = mount(AvatarGroup, { props: { max: 2 }, slots: { default: avatars(5), count: () => '+9' } })
    const counts = wrapper.findAll('[data-slot="avatar-group-count"]')
    expect(counts).toHaveLength(1)
    expect(counts[0].text()).toBe('+9')
    expect(wrapper.element.children).toHaveLength(3)
  })

  it('group size fills in only where the Avatar omits it', () => {
    const wrapper = mount(AvatarGroup, {
      props: { size: 'lg' },
      slots: { default: () => [h(Avatar, { fallback: 'A' }), h(Avatar, { fallback: 'B', size: 'sm' })] },
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
