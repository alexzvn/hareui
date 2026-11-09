import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ErrorMessage from '@/components/error-message/ErrorMessage.vue'

describe('ErrorMessage theme', () => {
  it('keeps the block class under a user color, which wins by layer order', () => {
    const wrapper = mount(ErrorMessage, { props: { class: 'text-warning' } })
    expect(wrapper.classes()).toEqual(['h-error-message', 'text-warning'])
  })
})
