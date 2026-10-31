import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import App from '@/components/app/App.vue'
import type { NumberValueProps } from '@/components/number-value/NumberValue.types'
import NumberValue from '@/components/number-value/NumberValue.vue'

const NBSP = '\u00a0'

const valueText = (props: NumberValueProps) => {
  return mount(NumberValue, { props }).get('[data-slot="number-value-value"]').text()
}

describe('NumberValue', () => {
  it('renders a decimal number in English by default', () => {
    expect(valueText({ value: 1234.5 })).toBe('1,234.5')
  })

  it('formats currency for the locale', () => {
    expect(valueText({ value: 228441, format: 'currency', currency: 'USD', locale: 'en-US' })).toBe(
      '$228,441.00',
    )

    expect(valueText({ value: 228441, format: 'currency', currency: 'EUR', locale: 'de-DE' })).toBe(
      `228.441,00${NBSP}€`,
    )

    expect(valueText({ value: 228441, format: 'currency', currency: 'JPY', locale: 'ja-JP' })).toBe(
      '￥228,441',
    )
  })

  it('formats a fraction as a percentage for the locale', () => {
    expect(valueText({ value: 0.033, format: 'percent', maximumFractionDigits: 1 })).toBe('3.3%')

    expect(
      valueText({ value: 0.033, format: 'percent', maximumFractionDigits: 1, locale: 'fr-FR' }),
    ).toBe(`3,3${NBSP}%`)
  })

  it('shortens large numbers with compact notation for the locale', () => {
    expect(valueText({ value: 1234, notation: 'compact' })).toBe('1.2K')

    expect(valueText({ value: 1_200_000, notation: 'compact', locale: 'de-DE' })).toBe(
      `1,2${NBSP}Mio.`,
    )
  })

  it('formats units for the locale', () => {
    expect(valueText({ value: 120, format: 'unit', unit: 'kilometer-per-hour' })).toBe('120 km/h')

    expect(valueText({ value: 1.5, format: 'unit', unit: 'liter', locale: 'de-DE' })).toBe('1,5 l')
  })

  it('applies signDisplay and the fraction digit limits', () => {
    expect(valueText({ value: 42, signDisplay: 'always' })).toBe('+42')
    expect(valueText({ value: 3, minimumFractionDigits: 2 })).toBe('3.00')
    expect(valueText({ value: 3.14159, maximumFractionDigits: 2 })).toBe('3.14')
  })

  it('lets options override the flat props', () => {
    expect(
      valueText({
        value: -1234.56,
        format: 'currency',
        currency: 'USD',
        options: { currency: 'EUR', currencySign: 'accounting' },
      }),
    ).toBe('(€1,234.56)')
  })

  it('falls back to the App locale and prefers its own locale prop', () => {
    const wrapper = mount(() =>
      h(App, { locale: 'de-DE', toaster: null }, () => [
        h('p', { id: 'inherited' }, h(NumberValue, { value: 1234.5 })),
        h('p', { id: 'own' }, h(NumberValue, { value: 1234.5, locale: 'en-US' })),
      ]),
    )

    expect(wrapper.get('#inherited').text()).toBe('1.234,5')
    expect(wrapper.get('#own').text()).toBe('1,234.5')
  })

  it('passes the formatted string and the value to the default slot', () => {
    const wrapper = mount(NumberValue, {
      props: { value: 0.25, format: 'percent' },
      slots: {
        default: ({ formatted, value }: { formatted: string; value: number }) =>
          h('b', `${formatted} of ${value}`),
      },
    })

    expect(wrapper.get('[data-slot="number-value-value"] b').text()).toBe('25% of 0.25')
  })

  it('renders the prefix and suffix around the number only when given', () => {
    const plain = mount(NumberValue, { props: { value: 5 } })
    expect(plain.find('[data-slot="number-value-prefix"]').exists()).toBe(false)
    expect(plain.find('[data-slot="number-value-suffix"]').exists()).toBe(false)

    const wrapper = mount(NumberValue, {
      props: { value: 99.99, format: 'currency', currency: 'USD' },
      slots: { prefix: () => 'From ', suffix: () => '/month' },
    })

    const parts = [...wrapper.element.children].map((el) => el.getAttribute('data-slot'))
    expect(parts).toEqual(['number-value-prefix', 'number-value-value', 'number-value-suffix'])
    expect(wrapper.text()).toBe('From $99.99/month')
  })

  it('formats as a decimal when currency format has no currency code', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(NumberValue, {
      props: { value: 1234.5, format: 'currency', locale: 'en-US' },
    })

    expect(wrapper.text()).toBe('1,234.5')
    spy.mockRestore()
  })

  it('warns when currency format has no currency code', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(NumberValue, { props: { value: 1, format: 'currency' } })

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('currency'))
    spy.mockRestore()
  })
})
