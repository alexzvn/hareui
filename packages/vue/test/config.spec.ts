import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import Button from '@/components/button/Button.vue'
import { createHareUI } from '@/config'

describe('createHareUI({ components })', () => {
  it('registers every component globally under its name', () => {
    const Host = defineComponent({ template: '<PrimaryButton>Save</PrimaryButton>' })
    const plugin = createHareUI({ components: { PrimaryButton: Button } })
    const wrapper = mount(Host, { global: { plugins: [plugin] } })

    expect(wrapper.get('[data-slot=button]').text()).toBe('Save')
  })
})
