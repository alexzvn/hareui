import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SwitchGroup from '@/components/switch-group/SwitchGroup.vue'

describe('SwitchGroup theme', () => {
  it('lays the items out in a column by default', () => {
    const wrapper = mount(SwitchGroup)
    expect(wrapper.classes()).toEqual(['h-switch-group', 'h-switch-group--vertical'])

    expect(wrapper.find('[data-slot=switch-group-items]').classes()).toEqual([
      'h-switch-group__items',
    ])
  })

  it('orientation="horizontal" switches the items container to a row layout', () => {
    const wrapper = mount(SwitchGroup, { props: { orientation: 'horizontal' } })
    expect(wrapper.classes()).toContain('h-switch-group--horizontal')
    expect(wrapper.classes()).not.toContain('h-switch-group--vertical')
  })

  it('merges `class` into the root and `:ui` into the items slot', () => {
    const wrapper = mount(SwitchGroup, { props: { class: 'mt-4', ui: { items: 'gap-8' } } })
    expect(wrapper.classes()).toContain('mt-4')
    expect(wrapper.find('[data-slot=switch-group-items]').classes()).toContain('gap-8')
  })
})
