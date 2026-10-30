import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import SwitchGroup from '@/components/switch-group/SwitchGroup.vue'
import Switch from '@/components/switch/Switch.vue'

import { expectAccessible } from './a11y'

describe('SwitchGroup', () => {
  it('renders the group wrapper and the items container', () => {
    const wrapper = mount(SwitchGroup, {
      slots: { default: () => [h(Switch, { label: 'A' }), h(Switch, { label: 'B' })] },
    })

    expect(wrapper.attributes('data-slot')).toBe('switch-group')
    const items = wrapper.find('[data-slot=switch-group-items]')
    expect(items.exists()).toBe(true)
    expect(wrapper.findAllComponents(Switch)).toHaveLength(2)
  })
})

describe('SwitchGroup accessibility', () => {
  // HeroUI's SwitchGroup is a plain layout wrapper; grouping semantics are the consumer's, passed as attributes
  it('forwards role and naming attributes to the root and has no axe violations', async () => {
    const wrapper = mount(
      () =>
        h('div', [
          h('span', { id: 'notifications' }, 'Notifications'),
          h(SwitchGroup, { role: 'group', 'aria-labelledby': 'notifications' }, () => [
            h(Switch, { label: 'Email', defaultValue: true }),
            h(Switch, { label: 'Push', disabled: true }),
            h(Switch, { label: 'SMS', readonly: true }),
          ]),
        ]),
      { attachTo: document.body },
    )

    const root = wrapper.get('[data-slot=switch-group]')
    expect(root.attributes('role')).toBe('group')

    expect(document.getElementById(root.attributes('aria-labelledby')!)?.textContent).toBe(
      'Notifications',
    )

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('has no axe violations as a bare layout wrapper', async () => {
    const wrapper = mount(SwitchGroup, {
      props: { orientation: 'horizontal' },
      slots: { default: () => [h(Switch, { label: 'A' }), h(Switch, { label: 'B' })] },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('keeps every enabled switch its own tab stop in document order', () => {
    const wrapper = mount(SwitchGroup, {
      slots: {
        default: () => [
          h(Switch, { label: 'A' }),
          h(Switch, { label: 'B', disabled: true }),
          h(Switch, { label: 'C' }),
        ],
      },
      attachTo: document.body,
    })

    expect(wrapper.attributes('tabindex')).toBeUndefined()
    const controls = wrapper.findAll('[role=switch]').map((c) => c.element as HTMLButtonElement)
    expect(controls.map((c) => c.tabIndex)).toEqual([0, 0, 0])
    expect(controls.map((c) => c.disabled)).toEqual([false, true, false])
    wrapper.unmount()
  })
})
