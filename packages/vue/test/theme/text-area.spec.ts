import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'

import TextArea from '@/components/text-area/TextArea.vue'
import TextField from '@/components/text-field/TextField.vue'

enableAutoUnmount(afterEach)

describe('TextArea theme', () => {
  it('takes the variant of the surrounding TextField', () => {
    const wrapper = mount(TextField, {
      props: { label: 'Message', variant: 'secondary' },
      slots: { default: () => h(TextArea) },
    })

    expect(wrapper.get('textarea').classes()).toContain('bg-(--textarea-bg)')
  })
})
