import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import DateField from '../src/components/date-field/DateField.vue'
import Label from '../src/components/label/Label.vue'
import { expectAccessible } from './a11y'

function mousedown(el: Element, detail: number) {
  const event = new MouseEvent('mousedown', { detail, bubbles: true, cancelable: true })
  el.dispatchEvent(event)
  return event
}

describe('Label', () => {
  it('renders a native label with `for` passed through', () => {
    const wrapper = mount(Label, { props: { for: 'email' }, slots: { default: () => 'Email' } })
    expect(wrapper.element.tagName).toBe('LABEL')
    expect(wrapper.attributes('data-slot')).toBe('label')
    expect(wrapper.attributes('for')).toBe('email')
    expect(wrapper.text()).toBe('Email')
  })

  it('renders as a span with the same slot and classes, and no `as` / `for` attribute', () => {
    const label = mount(Label, { props: { for: 'email', required: true }, slots: { default: () => 'Email' } })
    const span = mount(Label, { props: { as: 'span', for: 'email', required: true }, slots: { default: () => 'Email' } })
    expect(span.element.tagName).toBe('SPAN')
    expect(span.attributes('data-slot')).toBe('label')
    expect(span.classes()).toEqual(label.classes())
    expect(span.attributes()).not.toHaveProperty('as')
    expect(span.attributes()).not.toHaveProperty('for')
    expect(span.text()).toBe('Email')
  })

  it('a span label keeps the double-click selection guard', () => {
    const wrapper = mount(Label, { props: { as: 'span' }, slots: { default: () => 'Email' } })
    expect(mousedown(wrapper.element, 2).defaultPrevented).toBe(true)
    expect(mousedown(wrapper.element, 1).defaultPrevented).toBe(false)
  })

  it('a group-labelled field (DateField) renders its label as a bare span', () => {
    const wrapper = mount(DateField, { props: { id: 'd', label: 'Date' } })
    const label = wrapper.get('[data-slot="label"]')
    expect(label.element.tagName).toBe('SPAN')
    expect(label.attributes()).not.toHaveProperty('as')
    expect(label.attributes()).not.toHaveProperty('for')
    expect(label.attributes('id')).toBe('d-label')
    wrapper.unmount()
  })

  it('prevents text selection on a double-click mousedown only', () => {
    const wrapper = mount(Label, { slots: { default: () => 'Email' } })
    expect(mousedown(wrapper.element, 2).defaultPrevented).toBe(true)
    expect(mousedown(wrapper.element, 1).defaultPrevented).toBe(false)
  })

  it('leaves an already-prevented mousedown as-is', () => {
    const host = document.createElement('div')
    document.body.append(host)
    host.addEventListener('mousedown', event => event.preventDefault(), { capture: true })
    const onMousedown = vi.fn()
    const wrapper = mount(Label, { attrs: { onMousedown }, slots: { default: () => 'Email' }, attachTo: host })
    expect(mousedown(wrapper.element, 1).defaultPrevented).toBe(true)
    expect(mousedown(wrapper.element, 2).defaultPrevented).toBe(true)
    expect(onMousedown).toHaveBeenCalledTimes(2)
    wrapper.unmount()
    host.remove()
  })

  it('calls a user @mousedown listener exactly once per event', () => {
    const onMousedown = vi.fn()
    const wrapper = mount(Label, { attrs: { onMousedown }, slots: { default: () => 'Email' } })
    const single = mousedown(wrapper.element, 1)
    expect(onMousedown).toHaveBeenCalledTimes(1)
    expect(onMousedown).toHaveBeenLastCalledWith(single)
    const double = mousedown(wrapper.element, 2)
    expect(onMousedown).toHaveBeenCalledTimes(2)
    expect(onMousedown).toHaveBeenLastCalledWith(double)
  })

  it('passes attrs and classes through to the label element', () => {
    const wrapper = mount(Label, {
      props: { class: 'extra' },
      attrs: { 'id': 'l', 'title': 'Hint', 'data-testid': 'lbl', 'aria-hidden': 'true' },
      slots: { default: () => 'Email' },
    })
    expect(wrapper.attributes('id')).toBe('l')
    expect(wrapper.attributes('title')).toBe('Hint')
    expect(wrapper.attributes('data-testid')).toBe('lbl')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.classes()).toContain('extra')
  })

  it.each([
    ['idle', {}],
    ['required', { required: true }],
    ['disabled', { disabled: true }],
    ['invalid', { invalid: true }],
  ])('names the control it targets with `for` (%s), with no axe violations', async (_, props: { required?: boolean, disabled?: boolean, invalid?: boolean }) => {
    const wrapper = mount(() => h('div', [
      h(Label, { for: 'email', ...props }, () => 'Email'),
      h('input', { 'id': 'email', 'required': props.required, 'disabled': props.disabled, 'aria-invalid': props.invalid ? 'true' : undefined }),
    ]), { attachTo: document.body })
    const input = wrapper.get('input').element as HTMLInputElement
    expect([...input.labels!].map(label => label.textContent)).toEqual(['Email'])
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
