import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'

describe('Avatar theme', () => {
  it('#image keeps the image classes on the slotted element', async () => {
    const wrapper = mount(Avatar, {
      props: { src: '/a.jpg', fallback: 'JD' },
      slots: { image: () => h('picture-img', { alt: 'custom' }) },
    })

    await nextTick()
    expect(wrapper.find('picture-img').classes()).toContain('absolute')
  })
})
