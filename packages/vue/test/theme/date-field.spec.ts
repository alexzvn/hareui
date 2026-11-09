import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DateField from '@/components/date-field/DateField.vue'

describe('DateField theme', () => {
  it('fullWidth: applies w-full to the root and the full-width modifier to the group', () => {
    const wrapper = mount(DateField, { props: { fullWidth: true } })
    expect(wrapper.classes()).toContain('w-full')

    expect(wrapper.find('[data-slot="date-input-group"]').classes()).toContain(
      'h-date-input-group--full-width',
    )
  })
})
