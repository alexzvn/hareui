import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, markRaw } from 'vue'

import Link from '@/components/link/Link.vue'

import { expectAccessible } from './a11y'

const order = (el: Element) =>
  [...el.children].map((c) => c.getAttribute('data-slot') ?? c.tagName.toLowerCase())

// A minimal vue-router RouterLink: it renders nothing itself and hands the link state to its slot. Like vue-router's
// `custom` mode, a single slot node becomes its root, so attributes fall through to it.
const routerStub = (navigate: (to: unknown) => void) =>
  defineComponent({
    props: { to: { type: [String, Object], required: true }, custom: Boolean, replace: Boolean },
    setup(props, { slots }) {
      return () => {
        const nodes = slots.default?.({
          href: `/app${props.to}`,
          isActive: props.to === '/current',
          isExactActive: props.to === '/current',
          navigate: () => navigate(props.to),
        })

        return nodes?.length === 1 ? nodes[0] : nodes
      }
    },
  })

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

    const start = mount(Link, {
      props: { icon: true, iconPlacement: 'start' },
      slots: { default: () => h('b', 'Go') },
    })

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
    const Custom = markRaw(
      defineComponent(
        (_, { attrs, slots }) =>
          () =>
            h('span', { ...attrs, 'data-custom': 'foo' }, slots.default?.()),
      ),
    )

    const wrapper = mount(Link, {
      props: { as: Custom, href: '#' },
      slots: { default: () => 'Go' },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.attributes('data-custom')).toBe('foo')
    expect(wrapper.attributes('data-slot')).toBe('link')
  })

  it.each([
    ['with an href', { href: '/docs' }],
    ['with the external icon', { href: 'https://heroui.com', icon: true }],
    ['with the icon first', { href: '/docs', icon: true, iconPlacement: 'start' }],
    ['without an href', {}],
    ['disabled', { href: '/docs', disabled: true }],
  ])('is accessible %s', async (_, props) => {
    const wrapper = mount(Link, {
      props,
      attachTo: document.body,
      slots: { default: () => 'Docs' },
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('a link with an href is a native, focusable link that needs no extra role', () => {
    const wrapper = mount(Link, {
      props: { href: '/docs' },
      attachTo: document.body,
      slots: { default: () => 'Docs' },
    })

    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    ;(wrapper.element as HTMLElement).focus()
    expect(document.activeElement).toBe(wrapper.element)
    wrapper.unmount()
  })

  it('without an href it is still a focusable link that Enter activates (React Aria)', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(Link, {
      attrs: { onClick },
      attachTo: document.body,
      slots: { default: () => 'Open' },
    })

    expect(wrapper.attributes()).toMatchObject({ role: 'link', tabindex: '0' })
    const link = wrapper.element as HTMLElement
    link.focus()
    expect(document.activeElement).toBe(link)
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(onClick).toHaveBeenCalledOnce()
    await wrapper.trigger('keydown', { key: ' ' })
    expect(onClick).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('disabled is exposed as a disabled link outside the tab order and does not fire click handlers', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(Link, {
      props: { href: '/x', disabled: true },
      attrs: { onClick },
      attachTo: document.body,
      slots: { default: () => 'Docs' },
    })

    expect(wrapper.attributes()).toMatchObject({ role: 'link', 'aria-disabled': 'true' })

    // No href and no tabindex: a native anchor is then out of the tab order (happy-dom still focuses it).
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    await wrapper.trigger('click')
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(onClick).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('the default icon is hidden from assistive technology so the name is the link text', () => {
    const wrapper = mount(Link, {
      props: { href: '/x', icon: true },
      slots: { default: () => 'Docs' },
    })

    expect(wrapper.get('[data-slot="link-default-icon"]').attributes('aria-hidden')).toBe('true')
    expect(wrapper.text()).toBe('Docs')
    wrapper.unmount()
  })
})

describe('Link link props', () => {
  it('to goes through RouterLink when the app registers it', async () => {
    const navigate = vi.fn<(to: unknown) => void>()
    const wrapper = mount(Link, {
      props: { to: '/current' },
      slots: { default: () => 'Home' },
      global: { components: { RouterLink: routerStub(navigate) } },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/app/current')
    expect(wrapper.attributes('data-slot')).toBe('link')
    expect(wrapper.attributes('data-active')).toBe('true')
    expect(wrapper.attributes('role')).toBeUndefined()
    await wrapper.trigger('click')
    expect(navigate).toHaveBeenCalledWith('/current')
  })

  it('to without a router renders a plain anchor', () => {
    const wrapper = mount(Link, { props: { to: '/docs' }, slots: { default: () => 'Docs' } })
    expect(wrapper.attributes('href')).toBe('/docs')
    expect(wrapper.attributes('role')).toBeUndefined()
  })

  it('a disabled to stays off the router, without an href', async () => {
    const navigate = vi.fn<(to: unknown) => void>()
    const wrapper = mount(Link, {
      props: { to: '/current', disabled: true },
      global: { components: { RouterLink: routerStub(navigate) } },
    })

    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    await wrapper.trigger('click')
    expect(navigate).not.toHaveBeenCalled()
  })

  it('sets target, a default rel for a new tab, and download', () => {
    const wrapper = mount(Link, {
      props: { href: '/report.pdf', target: '_blank', download: 'report.pdf' },
    })

    expect(wrapper.attributes()).toMatchObject({
      target: '_blank',
      rel: 'noopener noreferrer',
      download: 'report.pdf',
    })
  })

  it('sets no download attribute unless asked', () => {
    const wrapper = mount(Link, { props: { href: '/docs' } })
    expect(wrapper.attributes('download')).toBeUndefined()
  })

  it('renders `download` without a value, so the browser keeps the file name', () => {
    const wrapper = mount(Link, { props: { href: '/report.pdf', download: true } })
    expect(wrapper.attributes('download')).toBe('')
  })
})

// A router link component passed as `as`: it reads `to`, `replace` and `external` as props and navigates on click.
const routerLinkAs = (navigate: (to: unknown) => void) =>
  markRaw(
    defineComponent({
      props: { to: [String, Object], replace: Boolean, external: Boolean },
      setup:
        (props, { slots }) =>
        () =>
          h(
            'a',
            {
              href: String(props.to),
              'data-replace': String(props.replace),
              'data-external': String(props.external),
              onClick: () => navigate(props.to),
            },
            slots.default?.(),
          ),
    }),
  )

describe('Link with a router link component as `as`', () => {
  it('forwards `replace` to it', () => {
    const wrapper = mount(Link, {
      props: { as: routerLinkAs(vi.fn<(to: unknown) => void>()), to: '/x', replace: true },
    })

    expect(wrapper.attributes('data-replace')).toBe('true')
  })

  it('forwards `external` to it', () => {
    const wrapper = mount(Link, {
      props: { as: routerLinkAs(vi.fn<(to: unknown) => void>()), to: '/x', external: true },
    })

    expect(wrapper.attributes('data-external')).toBe('true')
  })

  it('when disabled, renders no href, is aria-disabled and never navigates', async () => {
    const navigate = vi.fn<(to: unknown) => void>()
    const wrapper = mount(Link, {
      props: { as: routerLinkAs(navigate), to: '/x', disabled: true },
      slots: { default: () => 'Docs' },
    })

    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    await wrapper.trigger('click')
    expect(navigate).not.toHaveBeenCalled()
  })
})
