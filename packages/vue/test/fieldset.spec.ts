import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Button from '../src/components/Button.vue'
import Fieldset from '../src/components/Fieldset.vue'
import Link from '../src/components/Link.vue'

const order = (el: Element) => [...el.children].map(c => c.getAttribute('data-slot'))

describe('Fieldset', () => {
  it('renders legend, description, field group and actions in HeroUI order', () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Profile', description: 'Update it.' },
      slots: { default: () => h('input'), actions: () => h('button') },
    })
    expect(wrapper.element.tagName).toBe('FIELDSET')
    expect(order(wrapper.element)).toEqual(['fieldset-legend', 'description', 'fieldset-field-group', 'fieldset-actions'])
    expect(wrapper.find('legend').text()).toBe('Profile')
  })

  it('omits parts without a prop or slot', () => {
    const wrapper = mount(Fieldset, { slots: { default: () => h('input') } })
    expect(order(wrapper.element)).toEqual(['fieldset-field-group'])
  })

  it('disables descendant Button (native and as-rendered) and Link', () => {
    const wrapper = mount(Fieldset, {
      props: { disabled: true },
      slots: { default: () => [h(Button, () => 'Save'), h(Button, { as: 'div' }, () => 'Div'), h(Link, { href: '/x' }, () => 'Help')] },
    })
    expect(wrapper.attributes()).toMatchObject({ 'disabled': '', 'data-disabled': 'true' })
    const [native, div] = wrapper.findAll('[data-slot="button"]')
    expect(native!.attributes('disabled')).toBeDefined()
    expect(div!.attributes()).toMatchObject({ 'aria-disabled': 'true', 'tabindex': '-1' })
    const link = wrapper.find('[data-slot="link"]')
    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('aria-disabled')).toBe('true')
  })

  it('leaves descendants enabled when not disabled', () => {
    const wrapper = mount(Fieldset, { slots: { default: () => h(Link, { href: '/x' }, () => 'Help') } })
    expect(wrapper.attributes('disabled')).toBeUndefined()
    expect(wrapper.find('a').attributes('href')).toBe('/x')
  })
})
