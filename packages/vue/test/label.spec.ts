import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Label from '../src/components/label/Label.vue'

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
})
