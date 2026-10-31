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

  it('renders a string item icon as the icon class', () => {
    const wrapper = mount(Accordion, {
      props: { items: [{ value: 'a', label: 'A', icon: 'icon-a' }] },
    })

    expect(wrapper.get('[data-slot=accordion-icon]').classes()).toContain('icon-a')
  })
})

describe('Accordion trigger layout', () => {
  it('a user `ui.trigger` class wins over the icon layout class', () => {
    const wrapper = mount(Accordion, {
      props: {
        items: [{ value: 'a', label: 'A', icon: 'icon-a' }],
        ui: { trigger: 'justify-center' },
      },
    })

    const classes = wrapper.get('[data-slot=accordion-trigger]').classes()
    expect(classes).toContain('justify-center')
    expect(classes).not.toContain('justify-start')
  })
})
