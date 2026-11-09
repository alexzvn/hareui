import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DatePicker from '@/components/date-picker/DatePicker.vue'

describe('DatePicker theme', () => {
  it('fullWidth: applies the full-width modifier to the root and the group', () => {
    const wrapper = mount(DatePicker, { props: { fullWidth: true } })
    expect(wrapper.get('[data-slot=date-picker]').classes()).toContain('h-date-picker--full-width')

    expect(wrapper.get('[data-slot=date-input-group]').classes()).toContain(
      'h-date-input-group--full-width',
    )
  })
})
