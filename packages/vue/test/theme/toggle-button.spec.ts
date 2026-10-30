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
    expect(wrapper.get('[data-slot="toggle-button"]').classes()).toContain('px-3')
  })
})
