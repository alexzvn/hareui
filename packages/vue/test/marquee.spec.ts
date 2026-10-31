import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'

import Marquee from '@/components/marquee/Marquee.vue'

import { expectAccessible } from './a11y'

const content = () => [h('span', 'Docker'), h('span', 'Figma'), h('span', 'Notion')]

const linkContent = () => [h('a', { href: '/customers/figma' }, 'Figma')]

const copies = (root: Element) => [...root.querySelectorAll('[data-slot="marquee-content"]')]

describe('Marquee', () => {
  it('renders four copies of the content by default', () => {
    const wrapper = mount(Marquee, { slots: { default: content } })

    const rendered = copies(wrapper.element)
    expect(rendered).toHaveLength(4)
    for (const copy of rendered) expect(copy.textContent).toBe('DockerFigmaNotion')
  })

  it('renders as many copies as repeat asks for', () => {
    const wrapper = mount(Marquee, { props: { repeat: 6 }, slots: { default: content } })

    expect(copies(wrapper.element)).toHaveLength(6)
  })

  it('hides every copy after the first from assistive technology', () => {
    const wrapper = mount(Marquee, { props: { repeat: 3 }, slots: { default: content } })

    const [first, ...rest] = copies(wrapper.element)
    expect(first!.hasAttribute('aria-hidden')).toBe(false)
    for (const copy of rest) expect(copy.getAttribute('aria-hidden')).toBe('true')
  })

  it('exposes the content once and passes axe', async () => {
    const wrapper = mount(Marquee, { slots: { default: content }, attachTo: document.body })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('keeps a link in the content focusable only in the first copy', () => {
    const wrapper = mount(Marquee, {
      props: { repeat: 3 },
      slots: { default: linkContent },
    })

    const [first, ...rest] = copies(wrapper.element)
    expect(first!.querySelector('a')!.hasAttribute('tabindex')).toBe(false)
    for (const copy of rest) expect(copy.querySelector('a')!.getAttribute('tabindex')).toBe('-1')
  })

  it('removes links added to the content later from the tab order of the copies', async () => {
    const hasLink = ref(false)
    const wrapper = mount(Marquee, {
      slots: { default: () => (hasLink.value ? linkContent() : content()) },
    })

    hasLink.value = true
    await flushPromises()

    const [, ...rest] = copies(wrapper.element)
    for (const copy of rest) expect(copy.querySelector('a')!.getAttribute('tabindex')).toBe('-1')
  })

  it('passes axe with a link in the content', async () => {
    const wrapper = mount(Marquee, { slots: { default: linkContent }, attachTo: document.body })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('reflects the orientation on the root, horizontal by default', async () => {
    const wrapper = mount(Marquee, { slots: { default: content } })
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')

    await wrapper.setProps({ orientation: 'vertical' })
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
  })

  it('marks the root with data-reverse when reversed', async () => {
    const wrapper = mount(Marquee, { slots: { default: content } })
    expect(wrapper.attributes('data-reverse')).toBeUndefined()

    await wrapper.setProps({ reverse: true })
    expect(wrapper.attributes('data-reverse')).toBe('')
  })

  it('marks the root with data-pause-on-hover when it pauses on hover', async () => {
    const wrapper = mount(Marquee, { slots: { default: content } })
    expect(wrapper.attributes('data-pause-on-hover')).toBeUndefined()

    await wrapper.setProps({ pauseOnHover: true })
    expect(wrapper.attributes('data-pause-on-hover')).toBe('')
  })

  it('renders the root as a div by default and as the element passed to as', () => {
    expect(mount(Marquee, { slots: { default: content } }).element.tagName).toBe('DIV')

    const wrapper = mount(Marquee, { props: { as: 'section' }, slots: { default: content } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })
})
