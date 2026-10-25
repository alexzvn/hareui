import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import ErrorMessage from '@/components/error-message/ErrorMessage.vue'

import { expectAccessible } from './a11y'

describe('ErrorMessage', () => {
  it('renders the errorMessage slot span with HeroUI data-slot and id', () => {
    const wrapper = mount(ErrorMessage, {
      props: { id: 'err' },
      slots: { default: () => 'Pick one' },
    })

    expect(wrapper.element.tagName).toBe('SPAN')

    expect(wrapper.attributes()).toMatchObject({
      id: 'err',
      slot: 'errorMessage',
      'data-slot': 'error-message',
    })

    expect(wrapper.text()).toBe('Pick one')
  })

  it('stays rendered while empty', () => {
    const wrapper = mount(ErrorMessage)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.attributes('data-slot')).toBe('error-message')
  })

  it('describes the invalid control that references its id, with no axe violations', async () => {
    const wrapper = mount(
      () =>
        h('div', [
          h('label', { for: 'plan' }, 'Plan'),
          h('input', { id: 'plan', 'aria-invalid': 'true', 'aria-describedby': 'plan-error' }),
          h(ErrorMessage, { id: 'plan-error' }, () => 'Pick one'),
        ]),
      { attachTo: document.body },
    )

    expect(
      document.getElementById(wrapper.get('input').attributes('aria-describedby')!)?.textContent,
    ).toBe('Pick one')

    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
