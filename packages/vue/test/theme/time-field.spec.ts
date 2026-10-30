import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TimeField from '@/components/time-field/TimeField.vue'

describe('TimeField theme', () => {
  it('fullWidth applies w-full to the root and forwards it to the group', () => {
    const wrapper = mount(TimeField, { props: { fullWidth: true } })
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.find('[data-slot="date-input-group"]').classes()).toContain('w-full')
  })
})
