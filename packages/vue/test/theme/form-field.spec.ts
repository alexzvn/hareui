import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import FormField from '@/components/form-field/FormField.vue'
import NumberStepper from '@/components/number-stepper/NumberStepper.vue'
import Switch from '@/components/switch/Switch.vue'

describe('FormField theme', () => {
  it('size reaches an inner NumberStepper', () => {
    const wrapper = mount(() =>
      h(FormField, { label: 'Guests', size: 'sm' }, () => h(NumberStepper, { defaultValue: 2 })),
    )

    expect(wrapper.get('[data-slot=number-stepper-value]').classes()).toContain('text-xs')
  })

  it('size reaches an inner Switch', () => {
    const wrapper = mount(() =>
      h(FormField, { label: 'Notifications', size: 'sm' }, () => h(Switch)),
    )

    expect(wrapper.get('[data-slot=switch-control]').classes()).toContain('h-4')
  })

  it("the control's own size wins over the field's", () => {
    const wrapper = mount(() =>
      h(FormField, { label: 'Notifications', size: 'sm' }, () => h(Switch, { size: 'lg' })),
    )

    expect(wrapper.get('[data-slot=switch-control]').classes()).toContain('h-6')
  })
})
