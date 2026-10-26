import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import InputGroup from '@/components/input-group/InputGroup.vue'
import TextField from '@/components/text-field/TextField.vue'

describe('InputGroup theme', () => {
  it('variant falls back to the surrounding TextField variant', () => {
    const wrapper = mount(TextField, {
      props: { variant: 'secondary' },
      slots: { default: () => h(InputGroup, { 'data-test': 'g' }) },
    })

    // The secondary variant drops the shadow utility present on primary.
    expect(wrapper.get('[data-test=g]').classes()).not.toContain('shadow-field')
  })
})
