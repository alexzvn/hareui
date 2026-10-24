import { useLocale } from 'reka-ui'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

export type RangeValueOptions = {
  value: number
  minValue: number
  maxValue: number
  formatOptions?: Intl.NumberFormatOptions
  valueLabel?: string
}

export type RangeValue = {
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
export const useRangeValue = (options: () => RangeValueOptions): ComputedRef<RangeValue> => {
  const locale = useLocale()

  // Reused while locale and options are unchanged: a progress/meter value can tick every frame.
  let formatter: Intl.NumberFormat | undefined
  let formatterKey: string | undefined
  const format = (value: number, formatOptions: Intl.NumberFormatOptions): string => {
    const key = `${locale.value}|${JSON.stringify(formatOptions)}`
    if (!formatter || key !== formatterKey) {
      formatter = new Intl.NumberFormat(locale.value, formatOptions)
      formatterKey = key
    }

    return formatter.format(value)
  }

  return computed(() => {
    const {
      value,
      minValue,
      maxValue,
      formatOptions = { style: 'percent' },
      valueLabel,
    } = options()

    const clamped = Math.min(Math.max(value, minValue), maxValue)
    const range = maxValue - minValue
    const fraction = range === 0 ? 0 : (clamped - minValue) / range
    const valueText =
      valueLabel ?? format(formatOptions.style === 'percent' ? fraction : clamped, formatOptions)

    return { clamped, percentage: fraction * 100, valueText }
  })
}
