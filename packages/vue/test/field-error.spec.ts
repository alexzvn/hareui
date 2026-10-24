import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import FieldError from '../src/components/field-error/FieldError.vue'
import { expectAccessible } from './a11y'

describe('FieldError', () => {
  it('is the error message of the invalid control that references it, with no axe violations', async () => {
    const wrapper = mount(
      () =>
        h('div', [
          h('label', { for: 'email' }, 'Email'),
          h('input', { id: 'email', 'aria-invalid': 'true', 'aria-describedby': 'email-error' }),
          h(FieldError, { id: 'email-error' }, () => 'Enter a valid email'),
        ]),
      { attachTo: document.body },
    )
    const input = wrapper.get('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(document.getElementById(input.attributes('aria-describedby')!)?.textContent).toBe(
      'Enter a valid email',
    )
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is announced when it appears', () => {
    const wrapper = mount(FieldError, { slots: { default: () => 'Required' } })
    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.text()).toBe('Required')
    wrapper.unmount()
  })

  it('renders no id attribute when no id is given', () => {
    const wrapper = mount(FieldError, { slots: { default: () => 'Required' } })
    expect(wrapper.attributes('id')).toBeUndefined()
    wrapper.unmount()
  })
})
