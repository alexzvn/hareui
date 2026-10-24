import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import type { ChipProps, ChipSlots } from '@/components/chip/Chip.vue'
import Chip from '@/components/chip/Chip.vue'

import { expectAccessible } from './a11y'

describe('Chip', () => {
  it.each<[string, ChipProps, Pick<ChipSlots, keyof ChipSlots>]>([
    ['with a label prop', { label: 'New' }, {}],
    [
      'with slotted content and a decorative leading icon',
      { color: 'success', variant: 'soft' },
      { default: () => 'Active', leading: () => h('svg', { 'aria-hidden': 'true' }) },
    ],
    [
      'with a status dot and trailing content',
      { color: 'danger', size: 'sm' },
      {
        leading: () => h('span', { 'aria-hidden': 'true' }),
        default: () => 'Failed',
        trailing: () => '3',
      },
    ],
  ])('is accessible %s', async (_, props, slots) => {
    const wrapper = mount(Chip, { props, slots, attachTo: document.body })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is static text: no role, not focusable, its label is the readable content', () => {
    const wrapper = mount(Chip, { props: { label: 3 } })
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.find('[tabindex]').exists()).toBe(false)
    expect(wrapper.get('[data-slot="chip-label"]').text()).toBe('3')
    expect(wrapper.text()).toBe('3')
    wrapper.unmount()
  })

  it('renders no empty label wrapper without a label', () => {
    const wrapper = mount(Chip, { slots: { leading: () => h('svg', { 'aria-hidden': 'true' }) } })
    expect(wrapper.find('[data-slot="chip-label"]').exists()).toBe(false)
    wrapper.unmount()
  })
})
