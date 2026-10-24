import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import Button from '../src/components/button/Button.vue'
import { expectAccessible } from './a11y'

describe('Button', () => {
  it('pending shows a spinner, sets aria-busy and swallows clicks while staying focusable', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: { pending: true },
      attrs: { onClick },
      slots: { default: 'Save' },
    })
    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeUndefined()
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('#leading replaces the pending spinner', () => {
    const wrapper = mount(Button, {
      props: { pending: true },
      slots: { leading: () => h('i', { id: 'icon' }) },
    })
    expect(wrapper.find('#icon').exists()).toBe(true)
    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(false)
  })

  it('disabled sets the native disabled attribute', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('as="a" renders a link that is aria-disabled, unfocusable and click-inert when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: { as: 'a', disabled: true },
      attrs: { href: '#x', onClick },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    expect(wrapper.attributes('type')).toBeUndefined()
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('fires click when enabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, { attrs: { onClick } })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it.each([
    ['with a text label', {}, { default: 'Save' }, {}],
    [
      'icon-only with aria-label',
      { iconOnly: true },
      { default: () => h('svg', { 'aria-hidden': 'true' }) },
      { 'aria-label': 'Settings' },
    ],
    ['disabled', { disabled: true }, { default: 'Save' }, {}],
    ['pending', { pending: true }, { default: 'Save' }, {}],
    ['as a link', { as: 'a' }, { default: 'Docs' }, { href: '/docs' }],
    ['as a disabled link', { as: 'a', disabled: true }, { default: 'Docs' }, { href: '/docs' }],
  ])('is accessible %s', async (_, props, slots, attrs) => {
    const wrapper = mount(Button, { props, slots, attrs, attachTo: document.body })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('pending keeps the button focusable and exposes it as disabled; disabled leaves the tab order', () => {
    const wrapper = mount(
      {
        render: () =>
          h('div', [
            h(Button, { id: 'pending', pending: true }, () => 'Save'),
            h(Button, { id: 'disabled', disabled: true }, () => 'Save'),
          ]),
      },
      { attachTo: document.body },
    )
    const pending = wrapper.get('#pending').element as HTMLButtonElement
    pending.focus()
    expect(document.activeElement).toBe(pending)
    expect(pending.getAttribute('aria-disabled')).toBe('true')
    const disabled = wrapper.get('#disabled').element as HTMLButtonElement
    disabled.focus()
    expect(document.activeElement).not.toBe(disabled)
    wrapper.unmount()
  })

  it('as="div" is a tabbable, named button activated once by Enter (keydown) and Space (keyup)', async () => {
    const onClick = vi.fn()
    // Attached: happy-dom's `element.click()` doesn't dispatch on detached nodes.
    const wrapper = mount(Button, {
      props: { as: 'div' },
      attrs: { onClick },
      slots: { default: 'Open' },
      attachTo: document.body,
    })
    // Vue drops events stamped in the same millisecond its listeners were attached; real key presses never are.
    const tick = Promise.withResolvers<void>()
    setTimeout(tick.resolve, 2)
    await tick.promise
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.text()).toBe('Open')
    expect(wrapper.attributes('tabindex')).toBe('0')
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    wrapper.element.dispatchEvent(enter)
    expect(enter.defaultPrevented).toBe(true)
    await wrapper.trigger('keyup', { key: 'Enter' })
    expect(onClick).toHaveBeenCalledOnce()
    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
    wrapper.element.dispatchEvent(space)
    expect(space.defaultPrevented).toBe(true)
    expect(onClick).toHaveBeenCalledOnce()
    await wrapper.trigger('keyup', { key: ' ' })
    expect(onClick).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('as="div" disabled leaves the tab order and ignores Enter, Space and clicks', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: { as: 'div', disabled: true },
      attrs: { onClick },
      slots: { default: 'Open' },
      attachTo: document.body,
    })
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: ' ' })
    await wrapper.trigger('keyup', { key: ' ' })
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it.each([
    ['enabled', {}],
    ['disabled', { disabled: true }],
  ])('as="div" %s passes axe', async (_, props) => {
    const wrapper = mount(Button, {
      props: { as: 'div', ...props },
      slots: { default: 'Open' },
      attachTo: document.body,
    })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
