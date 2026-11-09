import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import InputOtp from '@/components/input-otp/InputOtp.vue'
import { createHareUI } from '@/config'

describe('InputOtp theme', () => {
  it('puts the secondary variant on the box, which restyles its slots', () => {
    const wrapper = mount(InputOtp, { props: { variant: 'secondary', length: 2 } })

    expect(wrapper.get('[data-input-otp-container]').classes()).toEqual(
      expect.arrayContaining(['h-input-otp', 'h-input-otp--secondary']),
    )

    expect(wrapper.findAll('[data-slot=input-otp-slot]').map((slot) => slot.classes())).toEqual([
      ['h-input-otp__slot'],
      ['h-input-otp__slot'],
    ])
  })

  it('keeps the pointer on the invisible input only, unstyled too', () => {
    const wrapper = mount(InputOtp, { global: { plugins: [createHareUI({ unstyled: true })] } })

    expect(wrapper.get('[data-input-otp-container]').classes()).toEqual([
      'pointer-events-none',
      'select-none',
    ])

    expect(wrapper.get('input').classes()).toEqual(['pointer-events-auto'])
  })
})
