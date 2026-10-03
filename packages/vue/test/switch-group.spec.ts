import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Switch from '../src/components/switch/Switch.vue'
import SwitchGroup from '../src/components/switch-group/SwitchGroup.vue'

describe('SwitchGroup', () => {
  it('renders the group wrapper and the items container with default (vertical) orientation', () => {
    const wrapper = mount(SwitchGroup, {
      slots: { default: () => [h(Switch, { label: 'A' }), h(Switch, { label: 'B' })] },
    })
    expect(wrapper.attributes('data-slot')).toBe('switch-group')
    const items = wrapper.find('[data-slot=switch-group-items]')
    expect(items.exists()).toBe(true)
    expect(items.classes()).toContain('flex-col')
    expect(wrapper.findAllComponents(Switch)).toHaveLength(2)
  })

  it('orientation="horizontal" switches the items container to a row layout', () => {
    const wrapper = mount(SwitchGroup, { props: { orientation: 'horizontal' } })
    const items = wrapper.find('[data-slot=switch-group-items]')
    expect(items.classes()).toContain('flex-row')
  })

  it('merges `class` into the root and `:ui` into the items slot', () => {
    const wrapper = mount(SwitchGroup, { props: { class: 'mt-4', ui: { items: 'gap-8' } } })
    expect(wrapper.classes()).toContain('mt-4')
    expect(wrapper.find('[data-slot=switch-group-items]').classes()).toContain('gap-8')
  })
})
