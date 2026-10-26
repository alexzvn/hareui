import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ErrorMessage from '@/components/error-message/ErrorMessage.vue'

describe('ErrorMessage theme', () => {
  it('lets a user class override the color', () => {
    const wrapper = mount(ErrorMessage, { props: { class: 'text-warning' } })
    expect(wrapper.classes()).toContain('text-warning')
    expect(wrapper.classes()).not.toContain('text-danger')
  })
})
