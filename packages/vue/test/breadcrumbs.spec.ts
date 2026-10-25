import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

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
