import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Avatar from '../src/components/avatar/Avatar.vue'

describe('Avatar', () => {
  it('forwards image attributes to the <img>, not the root', async () => {
    const wrapper = mount(Avatar, {
      props: { src: '/a.jpg', srcset: '/a.jpg 1x, /a@2x.jpg 2x', sizes: '40px', loading: 'lazy', crossOrigin: 'anonymous' },
    })
    await nextTick()
    const img = wrapper.find('img')
    expect(img.attributes()).toMatchObject({ srcset: '/a.jpg 1x, /a@2x.jpg 2x', sizes: '40px', loading: 'lazy', crossorigin: 'anonymous' })
    expect(wrapper.attributes('loading')).toBeUndefined()
  })

  it('#image replaces the <img> with the slotted element, keeping src and image classes', async () => {
    const wrapper = mount(Avatar, {
      props: { src: '/a.jpg', fallback: 'JD' },
      slots: { image: () => h('picture-img', { alt: 'custom' }) },
    })
    await nextTick()
    const custom = wrapper.find('picture-img')
    expect(custom.attributes('src')).toBe('/a.jpg')
    expect(custom.classes()).toContain('absolute')
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
