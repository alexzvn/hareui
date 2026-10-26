import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Autocomplete from '@/components/autocomplete/Autocomplete.vue'

describe('Autocomplete theme', () => {
  it('required marks the label with an asterisk', () => {
    const wrapper = mount(Autocomplete, {
      props: { items: [{ value: 'florida', label: 'Florida' }], label: 'State', required: true },
    })

    expect(wrapper.get('[data-slot=label]').classes()).toContain("after:content-['*']")
  })
})
