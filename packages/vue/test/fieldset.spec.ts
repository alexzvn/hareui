import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Button from '../src/components/button/Button.vue'
import Fieldset from '../src/components/fieldset/Fieldset.vue'
import Link from '../src/components/link/Link.vue'
import TextField from '../src/components/text-field/TextField.vue'
import { expectAccessible } from './a11y'

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

  const profile = (props: Record<string, unknown> = {}) => mount(Fieldset, {
    props: { legend: 'Profile', description: 'Shown on your public page.', ...props },
    slots: {
      default: () => [h(TextField, { label: 'Name', name: 'name' }), h(TextField, { label: 'Email', name: 'email', type: 'email' })],
      actions: () => h(Button, { type: 'submit' }, () => 'Save'),
    },
    attachTo: document.body,
  })

  it.each([['idle', {}], ['disabled', { disabled: true }]])('is a group named by its legend and described by its description (%s), with no axe violations', async (_, props) => {
    const wrapper = profile(props)
    expect(wrapper.element.tagName).toBe('FIELDSET')
    expect(wrapper.element.querySelector(':scope > legend')?.textContent?.trim()).toBe('Profile')
    const describedBy = wrapper.attributes('aria-describedby')!
    expect(document.getElementById(describedBy)?.textContent?.trim()).toBe('Shown on your public page.')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('disabled disables every field inside, so none is reachable by Tab', () => {
    const wrapper = profile({ disabled: true })
    for (const control of wrapper.findAll('input, button'))
      expect((control.element as HTMLInputElement).disabled).toBe(true)
    wrapper.unmount()
  })

  it('with no description it references no description id', () => {
    const wrapper = mount(Fieldset, { props: { legend: 'Profile' }, slots: { default: () => h('input', { 'aria-label': 'Name' }) } })
    expect(wrapper.attributes('aria-describedby')).toBeUndefined()
    wrapper.unmount()
  })

  it('rendered as another element keeps group semantics: role, name from the legend and disabled state', async () => {
    const wrapper = mount(Fieldset, {
      props: { as: 'div', legend: 'Shipping', description: 'Where we send it.', disabled: true },
      slots: { default: () => h(TextField, { label: 'Street', name: 'street' }) },
      attachTo: document.body,
    })
    expect(wrapper.attributes('role')).toBe('group')
    expect(document.getElementById(wrapper.attributes('aria-labelledby')!)?.textContent?.trim()).toBe('Shipping')
    expect(document.getElementById(wrapper.attributes('aria-describedby')!)?.textContent?.trim()).toBe('Where we send it.')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect((wrapper.get('input').element as HTMLInputElement).disabled).toBe(true)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
