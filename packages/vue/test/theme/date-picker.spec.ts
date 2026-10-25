import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DatePicker from '@/components/date-picker/DatePicker.vue'

describe('DatePicker theme', () => {
  it('fullWidth: applies w-full to the root and forwards it to the group', () => {
    const wrapper = mount(DatePicker, { props: { fullWidth: true } })
    expect(wrapper.get('[data-slot=date-picker]').classes()).toContain('w-full')
    expect(wrapper.get('[data-slot=date-input-group]').classes()).toContain('w-full')
  })
})
