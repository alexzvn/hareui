import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Meter from '../src/components/Meter.vue'

function slots(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[data-slot]').map(el => el.attributes('data-slot'))
}

describe('Meter', () => {
  it('exposes React Aria meter semantics and labels itself with the visible label', () => {
    const wrapper = mount(Meter, { props: { label: 'Storage', value: 60 } })
    const root = wrapper.get('[data-slot="meter"]')
    expect(root.attributes()).toMatchObject({
      'role': 'meter progressbar',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '60',
      'aria-valuetext': '60%',
    })
    expect(root.attributes('aria-labelledby')).toBe(wrapper.get('[data-slot="label"]').attributes('id'))
    expect(wrapper.get('[data-slot="meter-output"]').text()).toBe('60%')
    expect(wrapper.get('[data-slot="meter-fill"]').attributes('style')).toContain('width: 60%')
  })

  it('maps a clamped value onto a custom range and formats with formatOptions', () => {
    const wrapper = mount(Meter, {
      props: { label: 'Revenue', value: 1200, maxValue: 1000, formatOptions: { style: 'currency', currency: 'USD' } },
    })
    const root = wrapper.get('[data-slot="meter"]')
    expect(root.attributes()).toMatchObject({ 'aria-valuenow': '1000', 'aria-valuetext': '$1,000.00' })
    expect(wrapper.get('[data-slot="meter-fill"]').attributes('style')).toContain('width: 100%')
  })

  it('renders the output next to a label by default; showOutput overrides', () => {
    expect(slots(mount(Meter, { props: { value: 10 } }))).toEqual(['meter', 'meter-track', 'meter-fill'])
    expect(slots(mount(Meter, { props: { value: 10, showOutput: true } }))).toContain('meter-output')
    expect(slots(mount(Meter, { props: { label: 'L', value: 10, showOutput: false } }))).not.toContain('meter-output')
  })
})
