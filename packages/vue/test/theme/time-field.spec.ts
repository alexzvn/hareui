import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TimeField from '@/components/time-field/TimeField.vue'

describe('TimeField theme', () => {
  it('fullWidth applies the full-width modifier to the root and the group', () => {
    const wrapper = mount(TimeField, { props: { fullWidth: true } })
    expect(wrapper.classes()).toContain('h-time-field--full-width')

    expect(wrapper.find('[data-slot="date-input-group"]').classes()).toContain(
      'h-date-input-group--full-width',
    )
  })
})
