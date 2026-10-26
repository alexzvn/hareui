import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Label from '@/components/label/Label.vue'

describe('Label theme', () => {
  it('renders a span label with the same classes as a native label', () => {
    const label = mount(Label, {
      props: { for: 'email', required: true },
      slots: { default: () => 'Email' },
    })

    const span = mount(Label, {
      props: { as: 'span', for: 'email', required: true },
      slots: { default: () => 'Email' },
    })

    expect(span.classes()).toEqual(label.classes())
  })

  it('merges a class passed to the label element', () => {
    const wrapper = mount(Label, {
      props: { class: 'extra' },
      slots: { default: () => 'Email' },
    })

    expect(wrapper.classes()).toContain('extra')
  })
})
