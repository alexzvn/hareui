import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import type { BreadcrumbsProps, BreadcrumbsSlots } from '@/components/breadcrumbs/Breadcrumbs.types'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs.vue'

import { expectAccessible } from './a11y'

const items = [
  { label: 'Home', href: '/home' },
  { label: 'Products', href: '/products' },
  { label: 'Laptop', href: '/laptop' },
]

describe('breadcrumbs', () => {
  it('the last item is the current page: no link, aria-current, no separator after it', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    const links = wrapper.findAll('[data-slot=link]')
    expect(links.map((l) => l.element.tagName)).toEqual(['A', 'A', 'SPAN'])
    expect(links[0]!.attributes('href')).toBe('/home')
    expect(links[2]!.attributes('href')).toBeUndefined()
    expect(links[2]!.attributes('aria-current')).toBe('page')
    expect(wrapper.findAll('[data-slot=breadcrumbs-separator]')).toHaveLength(2)
  })

  it('disabled renders every link without href', () => {
    const wrapper = mount(Breadcrumbs, { props: { items, disabled: true } })
    const links = wrapper.findAll('[data-slot=link]')
    expect(
      links.every(
        (l) => l.attributes('href') === undefined && l.attributes('aria-disabled') === 'true',
      ),
    ).toBe(true)
  })

  it('a single custom separator element replaces the default separator', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { items },
      slots: { separator: () => h('i', { class: 'dot' }) },
    })

    const seps = wrapper.findAll('[data-slot=breadcrumbs-separator]')
    expect(seps).toHaveLength(2)
    expect(seps.every((sep) => sep.element.tagName === 'I')).toBe(true)
  })
})

describe('breadcrumbs item links and icons', () => {
  // A minimal vue-router RouterLink: it renders nothing itself and hands the link state to its slot.
  const routerStub = (navigate: (to: unknown) => void) =>
    defineComponent({
      props: { to: { type: [String, Object], required: true }, custom: Boolean, replace: Boolean },
      setup(props, { slots }) {
        return () =>
          slots.default?.({
            href: `/app${props.to}`,
            isActive: false,
            isExactActive: false,
            navigate: (event: MouseEvent) => {
              event.preventDefault()
              navigate(props.to)
            },
          })
      },
    })

  const trail = [{ label: 'Home', to: '/home' }, { label: 'Laptop' }]

  it('renders an item `to` as a plain anchor without a router', () => {
    const wrapper = mount(Breadcrumbs, { props: { items: trail } })
    const first = wrapper.findAll('[data-slot=link]')[0]!
    expect(first.element.tagName).toBe('A')
    expect(first.attributes('href')).toBe('/home')
  })

  it('routes an item `to` through RouterLink when the app registers it', async () => {
    const navigate = vi.fn<(to: unknown) => void>()
    const wrapper = mount(Breadcrumbs, {
      props: { items: trail },
      global: { components: { RouterLink: routerStub(navigate) } },
    })

    const first = wrapper.findAll('[data-slot=link]')[0]!
    expect(first.attributes('href')).toBe('/app/home')
    await first.trigger('click')
    expect(navigate).toHaveBeenCalledWith('/home')
  })

  it('the current page ignores its `to`', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [
          { label: 'Home', to: '/home' },
          { label: 'Laptop', to: '/laptop' },
        ],
      },
    })

    const current = wrapper.findAll('[data-slot=link]')[1]!
    expect(current.element.tagName).toBe('SPAN')
    expect(current.attributes('href')).toBeUndefined()
  })

  it('a disabled item renders without a link', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { items: [{ label: 'Home', href: '/home', disabled: true }, { label: 'Laptop' }] },
    })

    const first = wrapper.findAll('[data-slot=link]')[0]!
    expect(first.attributes('href')).toBeUndefined()
    expect(first.attributes('aria-disabled')).toBe('true')
  })

  it('renders an item icon only when the item sets one', () => {
    const StarIcon = { render: () => h('svg', { 'data-testid': 'star' }) }
    const wrapper = mount(Breadcrumbs, {
      props: { items: [{ label: 'Home', href: '/home', icon: StarIcon }, { label: 'Laptop' }] },
    })

    const links = wrapper.findAll('[data-slot=link]')
    expect(links[0]!.find('[data-testid=star]').attributes('aria-hidden')).toBe('true')
    expect(links[1]!.find('[data-slot=breadcrumbs-icon]').exists()).toBe(false)
  })
})

describe('Breadcrumbs accessibility', () => {
  it('passes axe by default, disabled, with an href-less ancestor and with custom separators', async () => {
    // Pick turns the interfaces into plain object types, which mount()'s index-signature options accept.
    const cases: {
      props: Pick<BreadcrumbsProps, keyof BreadcrumbsProps>
      slots?: Pick<BreadcrumbsSlots, keyof BreadcrumbsSlots>
    }[] = [
      { props: { items } },
      { props: { items, disabled: true } },
      { props: { items: [{ label: 'Home' }, ...items.slice(1)] } },
      { props: { items }, slots: { separator: () => [h('span', { 'aria-hidden': 'true' }, '/')] } },
      { props: { items }, slots: { separator: () => [h('i')] } },
    ]

    for (const options of cases) {
      const wrapper = mount(Breadcrumbs, { ...options, attachTo: document.body })
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('is a list named "Breadcrumbs" by default, and a consumer aria-label replaces the name', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    expect(wrapper.element.tagName).toBe('OL')
    expect(wrapper.attributes('aria-label')).toBe('Breadcrumbs')
    expect(wrapper.findAll('li')).toHaveLength(3)
    wrapper.unmount()

    const named = mount(Breadcrumbs, { props: { items }, attrs: { 'aria-label': 'You are here' } })
    expect(named.attributes('aria-label')).toBe('You are here')
    named.unmount()
  })

  it('ancestors are Tab-stop links; the current page is an announced, disabled, non-focusable link', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    const links = wrapper.findAll('[data-slot=link]')
    for (const link of links.slice(0, 2)) {
      expect(link.attributes('href')).toBeDefined()
      expect(link.attributes('tabindex')).not.toBe('-1')
      expect(link.attributes('aria-disabled')).toBeUndefined()
    }

    const current = links[2]!
    expect(current.attributes('role')).toBe('link')
    expect(current.attributes('aria-disabled')).toBe('true')
    expect(current.attributes('tabindex')).toBeUndefined()
    expect(current.text()).toBe('Laptop')
    wrapper.unmount()
  })

  it('an href-less ancestor is still a focusable link; disabled removes every link from the Tab order', () => {
    const wrapper = mount(Breadcrumbs, { props: { items: [{ label: 'Home' }, ...items.slice(1)] } })
    const first = wrapper.findAll('[data-slot=link]')[0]!
    expect(first.attributes('role')).toBe('link')
    expect(first.attributes('tabindex')).toBe('0')
    wrapper.unmount()

    const off = mount(Breadcrumbs, { props: { items, disabled: true } })
    expect(
      off.findAll('[data-slot=link]').map((l) => [l.attributes('role'), l.attributes('tabindex')]),
    ).toEqual([
      ['link', undefined],
      ['link', undefined],
      ['link', undefined],
    ])

    off.unmount()
  })

  it('the default separators are hidden from assistive tech', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    expect(
      wrapper.findAll('[data-slot=breadcrumbs-separator]').map((s) => s.attributes('aria-hidden')),
    ).toEqual(['true', 'true'])

    wrapper.unmount()
  })
})

describe('breadcrumbs #item slot', () => {
  it('a custom #item replaces the default item icon', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { items: [{ label: 'Home', href: '/', icon: 'icon-home' }, { label: 'Laptop' }] },
      slots: { item: ({ item }: { item: { label?: string } }) => h('b', item.label) },
    })

    expect(wrapper.find('[data-slot=breadcrumbs-icon]').exists()).toBe(false)
  })
})
