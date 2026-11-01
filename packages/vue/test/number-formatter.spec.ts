import { describe, expect, it, vi } from 'vitest'

import { createNumberFormatter } from '@/utils/numberFormatter'

describe('createNumberFormatter', () => {
  it('formats with the given locale and options', () => {
    const format = createNumberFormatter()

    expect(format(1234.5, { locale: 'de-DE', options: {} })).toBe('1.234,5')
    expect(format(0.5, { locale: 'en-US', options: { style: 'percent' } })).toBe('50%')
  })

  it('formats with the new locale once the locale changes', () => {
    const format = createNumberFormatter()

    format(1234.5, { locale: 'en-US', options: {} })

    expect(format(1234.5, { locale: 'de-DE', options: {} })).toBe('1.234,5')
  })

  it('formats with the new options once the options change', () => {
    const format = createNumberFormatter()

    format(0.5, { locale: 'en-US', options: {} })

    expect(format(0.5, { locale: 'en-US', options: { style: 'percent' } })).toBe('50%')
  })

  it('keeps one Intl.NumberFormat while the locale and options are unchanged', () => {
    const NumberFormat = vi.spyOn(Intl, 'NumberFormat')
    const format = createNumberFormatter()

    format(1, { locale: 'en-US', options: { maximumFractionDigits: 1 } })
    format(2, { locale: 'en-US', options: { maximumFractionDigits: 1 } })

    expect(NumberFormat).toHaveBeenCalledTimes(1)
    NumberFormat.mockRestore()
  })

  it('keeps a separate Intl.NumberFormat per created formatter', () => {
    const formatPercent = createNumberFormatter()
    const formatDecimal = createNumberFormatter()

    formatPercent(0.5, { locale: 'en-US', options: { style: 'percent' } })

    expect(formatDecimal(0.5, { locale: 'en-US', options: {} })).toBe('0.5')
  })
})
