import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Button from '../src/components/button/Button.vue'

describe('Button', () => {
  it('pending shows a spinner, sets aria-busy and swallows clicks while staying focusable', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, { props: { pending: true }, attrs: { onClick }, slots: { default: 'Save' } })
    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeUndefined()
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('#leading replaces the pending spinner', () => {
    const wrapper = mount(Button, { props: { pending: true }, slots: { leading: () => h('i', { id: 'icon' }) } })
    expect(wrapper.find('#icon').exists()).toBe(true)
    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(false)
  })

  it('disabled sets the native disabled attribute', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('as="a" renders a link that is aria-disabled, unfocusable and click-inert when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, { props: { as: 'a', disabled: true }, attrs: { href: '#x', onClick } })
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
})
