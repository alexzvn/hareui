import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import ToggleButtonGroup from '@/components/toggle-button-group/ToggleButtonGroup.vue'
import ToggleButton from '@/components/toggle-button/ToggleButton.vue'

describe('ToggleButton theme', () => {
  it('takes the size of its group', async () => {
    const wrapper = mount(ToggleButtonGroup, {
      props: { size: 'sm' },
      slots: { default: () => ['a', 'b'].map((v) => h(ToggleButton, { value: v }, () => v)) },
    })

    await nextTick()
    expect(wrapper.get('[data-slot="toggle-button"]').classes()).toContain('h-toggle-button--sm')
  })

  it('keeps a user class next to its own modifiers', () => {
    const wrapper = mount(ToggleButton, { props: { variant: 'ghost', class: 'px-8' } })

    const classes = wrapper.get('[data-slot="toggle-button"]').classes()
    expect(classes).toContain('h-toggle-button--ghost')
    expect(classes).toContain('px-8')
  })
})
