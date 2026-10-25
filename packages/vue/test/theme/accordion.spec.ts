import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Accordion from '@/components/accordion/Accordion.vue'

describe('Accordion theme', () => {
  it('a single #indicator element receives the indicator classes and keeps its own', () => {
    const wrapper = mount(Accordion, {
      props: { items: [{ value: 'a', label: 'A', content: 'Panel A' }], defaultValue: ['a'] },
      slots: { indicator: () => h('i', { class: 'custom' }) },
    })

    const indicator = wrapper.find('[data-slot=accordion-indicator]')
    expect(indicator.classes()).toContain('custom')
    expect(indicator.classes()).toContain('size-4')
  })
})
