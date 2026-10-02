import type { ComputedRef } from 'vue'
import { useLocale } from 'reka-ui'
import { computed } from 'vue'

export interface RangeValueOptions {
  value: number
  minValue: number
  maxValue: number
  formatOptions?: Intl.NumberFormatOptions
  valueLabel?: string
}

export interface RangeValue {
  /** `value` clamped to `minValue`–`maxValue`. */
  clamped: number
  /** Position of the clamped value in the range, 0–100. */
  percentage: number
  /** Formatted value (or `valueLabel`), used for the output and `aria-valuetext`. */
  valueText: string
}

/**
 * Value math shared by ProgressBar, ProgressCircle and Meter — the same as React Aria's
 * `useProgressBar`: clamp, fraction of the range, and `Intl.NumberFormat` (percent formats the fraction).
 * The locale comes from Reka's `ConfigProvider` (default `'en'`).
 */
export function useRangeValue(options: () => RangeValueOptions): ComputedRef<RangeValue> {
  const locale = useLocale()
  return computed(() => {
    const { value, minValue, maxValue, formatOptions = { style: 'percent' }, valueLabel } = options()
    const clamped = Math.min(Math.max(value, minValue), maxValue)
    const range = maxValue - minValue
    const fraction = range === 0 ? 0 : (clamped - minValue) / range
    const valueText = valueLabel
      ?? new Intl.NumberFormat(locale.value, formatOptions).format(formatOptions.style === 'percent' ? fraction : clamped)
    return { clamped, percentage: fraction * 100, valueText }
  })
}
