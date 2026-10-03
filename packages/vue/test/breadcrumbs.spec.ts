import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Breadcrumbs from '../src/components/breadcrumbs/Breadcrumbs.vue'

const items = [{ label: 'Home', href: '/home' }, { label: 'Products', href: '/products' }, { label: 'Laptop', href: '/laptop' }]

describe('breadcrumbs', () => {
  it('the last item is the current page: no link, aria-current, no separator after it', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    const links = wrapper.findAll('[data-slot=link]')
    expect(links.map(l => l.element.tagName)).toEqual(['A', 'A', 'SPAN'])
    expect(links[0]!.attributes('href')).toBe('/home')
    expect(links[2]!.attributes('href')).toBeUndefined()
    expect(links[2]!.attributes('aria-current')).toBe('page')
    expect(wrapper.findAll('[data-slot=breadcrumbs-separator]')).toHaveLength(2)
  })

  it('disabled renders every link without href', () => {
    const wrapper = mount(Breadcrumbs, { props: { items, disabled: true } })
    const links = wrapper.findAll('[data-slot=link]')
    expect(links.every(l => l.attributes('href') === undefined && l.attributes('aria-disabled') === 'true')).toBe(true)
  })

  it('a single custom separator element receives the separator classes', () => {
    const wrapper = mount(Breadcrumbs, { props: { items }, slots: { separator: () => h('i', { class: 'dot' }) } })
    const sep = wrapper.find('[data-slot=breadcrumbs-separator]')
    expect(sep.element.tagName).toBe('I')
    expect(sep.classes()).toEqual(expect.arrayContaining(['dot', 'size-3', 'text-muted']))
  })
})
