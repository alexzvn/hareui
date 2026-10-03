import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Link from '../src/components/link/Link.vue'

const order = (el: Element) => [...el.children].map(c => c.getAttribute('data-slot') ?? c.tagName.toLowerCase())

describe('Link', () => {
  it('renders an anchor with HeroUI data-slot and no icon by default', () => {
    const wrapper = mount(Link, { props: { href: '/docs' }, slots: { default: () => 'Docs' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/docs')
    expect(wrapper.attributes('data-slot')).toBe('link')
    expect(wrapper.find('[data-slot="link-icon"]').exists()).toBe(false)
  })

  it('places the default external icon after or before the text', () => {
    const end = mount(Link, { props: { icon: true }, slots: { default: () => h('b', 'Go') } })
    expect(order(end.element)).toEqual(['b', 'link-icon'])
    expect(end.get('[data-slot="link-icon"]').attributes('data-default-icon')).toBe('true')
    expect(end.find('[data-slot="link-default-icon"]').exists()).toBe(true)
    const start = mount(Link, { props: { icon: true, iconPlacement: 'start' }, slots: { default: () => h('b', 'Go') } })
    expect(order(start.element)).toEqual(['link-icon', 'b'])
  })

  it('uses #icon content without the default-icon marker', () => {
    const wrapper = mount(Link, { slots: { default: () => 'Go', icon: () => h('i', 'x') } })
    const icon = wrapper.get('[data-slot="link-icon"]')
    expect(icon.attributes('data-default-icon')).toBeUndefined()
    expect(icon.find('i').exists()).toBe(true)
  })

  it('disabled removes the href, sets aria-disabled and blocks clicks', async () => {
    const wrapper = mount(Link, { props: { href: '/x', disabled: true } })
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    const event = new MouseEvent('click', { cancelable: true })
    wrapper.element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('renders through a custom component via as, forwarding attributes', () => {
    const Custom = defineComponent((_, { attrs, slots }) => () => h('span', { ...attrs, 'data-custom': 'foo' }, slots.default?.()))
    const wrapper = mount(Link, { props: { as: Custom, href: '#' }, slots: { default: () => 'Go' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.attributes('data-custom')).toBe('foo')
    expect(wrapper.attributes('data-slot')).toBe('link')
  })
})
