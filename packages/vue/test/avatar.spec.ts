import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { VNode } from 'vue'
import { defineComponent, h, nextTick } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'

import { expectAccessible } from './a11y'

// happy-dom never loads images: capture the probe images reka creates and settle them by hand.
const NativeImage = window.Image

function stubImages() {
  const probes: HTMLImageElement[] = []
  vi.spyOn(window, 'Image').mockImplementation(function () {
    const img = new NativeImage()
    probes.push(img)
    return img
  })
  return {
    async load() {
      for (const img of probes) {
        Object.defineProperty(img, 'naturalWidth', { value: 40, configurable: true })
        img.dispatchEvent(new Event('load'))
      }
      await nextTick()
    },
    async fail() {
      probes.forEach((img) => img.dispatchEvent(new Event('error')))
      await nextTick()
    },
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

const mountAll = (children: () => VNode[]) =>
  mount(
    defineComponent(() => () => h('div', children())),
    { attachTo: document.body },
  )

describe('Avatar', () => {
  it('forwards image attributes to the <img>, not the root', async () => {
    const wrapper = mount(Avatar, {
      props: {
        src: '/a.jpg',
        srcset: '/a.jpg 1x, /a@2x.jpg 2x',
        sizes: '40px',
        loading: 'lazy',
        crossOrigin: 'anonymous',
      },
    })
    await nextTick()
    const img = wrapper.find('img')
    expect(img.attributes()).toMatchObject({
      srcset: '/a.jpg 1x, /a@2x.jpg 2x',
      sizes: '40px',
      loading: 'lazy',
      crossorigin: 'anonymous',
    })
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

  it('is accessible with initials only, with a loaded image and its alt, and once the image fails', async () => {
    const images = stubImages()
    const wrapper = mountAll(() => [
      h(Avatar, { fallback: 'JD' }),
      h(Avatar, { src: '/kate.jpg', alt: 'Kate Wilson', fallback: 'KW' }),
    ])
    await nextTick()
    await expectAccessible(wrapper)
    await images.load()
    await expectAccessible(wrapper)
    wrapper.unmount()

    const failed = stubImages()
    const broken = mount(Avatar, {
      props: { src: '/missing.jpg', alt: 'Kate Wilson', fallback: 'KW' },
      attachTo: document.body,
    })
    await nextTick()
    await failed.fail()
    await expectAccessible(broken)
    broken.unmount()
  })

  it('exposes the image with its alt only once loaded, and the fallback text until then', async () => {
    const images = stubImages()
    const wrapper = mount(Avatar, {
      props: { src: '/kate.jpg', alt: 'Kate Wilson', fallback: 'KW' },
      attachTo: document.body,
    })
    await nextTick()
    const img = wrapper.get('img')
    expect(img.attributes('alt')).toBe('Kate Wilson')
    expect((img.element as HTMLElement).style.display).toBe('none')
    expect(wrapper.get('[data-slot=avatar-fallback]').text()).toBe('KW')
    await images.load()
    expect((img.element as HTMLElement).style.display).toBe('')
    expect(wrapper.find('[data-slot=avatar-fallback]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders the <img> without an explicit role, so an empty alt stays decorative', async () => {
    const images = stubImages()
    const wrapper = mountAll(() => [
      h(Avatar, { src: '/kate.jpg', alt: 'Kate Wilson', fallback: 'KW' }),
      h(Avatar, { src: '/deco.jpg', alt: '', fallback: 'DE' }),
    ])
    await nextTick()
    await images.load()
    const [named, decorative] = wrapper.findAll('img')
    expect(named.attributes('role')).toBeUndefined()
    expect(named.attributes('alt')).toBe('Kate Wilson')
    expect(decorative.attributes('role')).toBeUndefined()
    expect(decorative.attributes('alt')).toBe('')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('an icon-only fallback can be named with role="img" and aria-label on the root', async () => {
    const wrapper = mount(Avatar, {
      attrs: { role: 'img', 'aria-label': 'Unknown user' },
      slots: { fallback: () => h('svg', { 'aria-hidden': 'true', viewBox: '0 0 16 16' }) },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.attributes()).toMatchObject({ role: 'img', 'aria-label': 'Unknown user' })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
