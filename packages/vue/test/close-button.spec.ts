import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import CloseButton from '../src/components/close-button/CloseButton.vue'
import { expectAccessible } from './a11y'

describe('CloseButton', () => {
  it.each([
    ['idle', {}],
    ['disabled', { disabled: true }],
    ['with a custom label', { ariaLabel: 'Dismiss notification' }],
  ])('is accessible %s', async (_, props) => {
    const wrapper = mount(CloseButton, { props, attachTo: document.body })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is a native button named "Close" by default with a decorative icon', () => {
    const wrapper = mount(CloseButton)
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes()).toMatchObject({ 'type': 'button', 'aria-label': 'Close' })
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('takes a consumer aria-label in place of the default name', () => {
    const wrapper = mount(CloseButton, { attrs: { 'aria-label': 'Dismiss' } })
    expect(wrapper.attributes('aria-label')).toBe('Dismiss')
    expect(wrapper.findAll('[aria-label]')).toHaveLength(1)
    wrapper.unmount()
  })

  it('stays named "Close" when the icon slot is replaced', async () => {
    const wrapper = mount(CloseButton, { attachTo: document.body, slots: { default: () => h('svg', { 'aria-hidden': 'true' }) } })
    expect(wrapper.attributes('aria-label')).toBe('Close')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is focusable and fires click when enabled; disabled leaves the tab order and ignores clicks', async () => {
    const onClick = vi.fn()
    const wrapper = mount({ render: () => h('div', [
      h(CloseButton, { id: 'on', onClick }),
      h(CloseButton, { id: 'off', disabled: true, onClick }),
    ]) }, { attachTo: document.body })
    const on = wrapper.get('#on').element as HTMLButtonElement
    on.focus()
    expect(document.activeElement).toBe(on)
    on.click()
    expect(onClick).toHaveBeenCalledOnce()
    const off = wrapper.get('#off').element as HTMLButtonElement
    off.focus()
    expect(document.activeElement).not.toBe(off)
    off.click()
    expect(onClick).toHaveBeenCalledOnce()
    wrapper.unmount()
  })
})
