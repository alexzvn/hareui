import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Description from '@/components/description/Description.vue'

import { expectAccessible } from './a11y'

describe('Description', () => {
  it('describes the control that references its id, with no axe violations', async () => {
    const wrapper = mount(
      () =>
        h('div', [
          h('label', { for: 'pw' }, 'Password'),
          h('input', { id: 'pw', type: 'password', 'aria-describedby': 'pw-hint' }),
          h(Description, { id: 'pw-hint' }, () => 'At least 8 characters'),
        ]),
      { attachTo: document.body },
    )
    const ref = wrapper.get('input').attributes('aria-describedby')!
    expect(document.getElementById(ref)?.textContent).toBe('At least 8 characters')
    expect(wrapper.get('[data-slot=description]').attributes('id')).toBe('pw-hint')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('renders plain text with no id, role or live region when no id is given', () => {
    const wrapper = mount(Description, { slots: { default: () => 'Help' } })
    expect(wrapper.attributes('id')).toBeUndefined()
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('aria-live')).toBeUndefined()
    wrapper.unmount()
  })
})
