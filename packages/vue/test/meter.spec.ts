import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { MeterProps } from '../src/components/meter/Meter.vue'
import Meter from '../src/components/meter/Meter.vue'
import { axeViolations } from './a11y'

function slots(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[data-slot]').map(el => el.attributes('data-slot'))
}

describe('Meter', () => {
  it('exposes meter semantics and labels itself with the visible label', () => {
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

  it.each<[string, MeterProps & { 'aria-label'?: string }]>([
    ['with a visible label', { label: 'Storage', value: 60 }],
    ['named by aria-label only', { 'aria-label': 'Storage', 'value': 60 }],
    ['with a custom value label and colour', { label: 'Battery', value: 15, valueLabel: '15 minutes left', color: 'danger' }],
    ['with a currency range', { label: 'Revenue', value: 750, minValue: 500, maxValue: 1000, formatOptions: { style: 'currency', currency: 'USD' } }],
  ])('has no axe violations: %s', async (_, props) => {
    const wrapper = mount(Meter, { props, attachTo: document.body })
    // React Aria's useMeter (and so HeroUI) sets `role="meter progressbar"` so browsers without `meter` fall back to
    // `progressbar`. axe doesn't resolve fallback roles and rejects the aria-value* attributes for that one node only.
    const violations = await axeViolations(wrapper)
    expect(violations.filter(v => !v.startsWith('aria-allowed-attr: <div role="meter progressbar"'))).toEqual([])
    wrapper.unmount()
  })

  it('aria-label names the meter itself and it is not focusable', () => {
    const wrapper = mount(Meter, { props: { 'aria-label': 'Storage', 'value': 10 } })
    const root = wrapper.get('[data-slot="meter"]')
    expect(root.attributes('aria-label')).toBe('Storage')
    expect(root.attributes('aria-labelledby')).toBeUndefined()
    expect(wrapper.find('[tabindex]').exists()).toBe(false)
  })

  it('aria-valuetext follows valueLabel and value changes', async () => {
    const wrapper = mount(Meter, { props: { label: 'Battery', value: 3, maxValue: 4, valueLabel: '3 of 4 bars' } })
    const root = wrapper.get('[data-slot="meter"]')
    expect(root.attributes()).toMatchObject({ 'aria-valuenow': '3', 'aria-valuetext': '3 of 4 bars' })
    await wrapper.setProps({ value: 1, valueLabel: undefined })
    expect(root.attributes()).toMatchObject({ 'aria-valuenow': '1', 'aria-valuetext': '25%' })
  })
})
