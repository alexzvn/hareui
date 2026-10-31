import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type NumberValue = typeof theme

/** Formatting style of a `NumberValue`: the `style` option of `Intl.NumberFormat`. */
export type NumberValueFormat = 'decimal' | 'currency' | 'percent' | 'unit'

/** Props of `NumberValue`, a number formatted for the locale: currency, percent, units or compact notation. */
export type NumberValueProps = {
  /** The number to format. */
  value: number
  /**
   * BCP 47 locale used for formatting.
   * @defaultValue the `App` locale, then 'en'
   */
  locale?: string
  /**
   * Formatting style. `percent` multiplies the value by 100, so pass 0.25 for 25%.
   * @defaultValue 'decimal'
   */
  format?: NumberValueFormat
  /** ISO 4217 currency code (e.g. `'USD'`). Required when `format` is `'currency'`. */
  currency?: string
  /** Unit identifier (e.g. `'kilometer-per-hour'`). Required when `format` is `'unit'`. */
  unit?: string
  /**
   * Notation: `compact` shortens large numbers (1.2K, 3.4M).
   * @defaultValue 'standard'
   */
  notation?: Intl.NumberFormatOptions['notation']
  /**
   * When to show the sign: `auto` for negatives, `exceptZero` for everything but zero.
   * @defaultValue 'auto'
   */
  signDisplay?: 'auto' | 'always' | 'exceptZero' | 'never'
  /** Minimum number of fraction digits. */
  minimumFractionDigits?: number
  /** Maximum number of fraction digits. */
  maximumFractionDigits?: number
  /** Any `Intl.NumberFormat` options; they take precedence over the props above. */
  options?: Intl.NumberFormatOptions
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<NumberValue>
}

/** Props of the `NumberValue` default slot. */
export type NumberValueSlotProps = {
  /** The formatted number. */
  formatted: string
  /** The `value` prop. */
  value: number
}

/** Slots of `NumberValue`. */
export type NumberValueSlots = {
  /** Content before the number, wrapped in the `prefix` element. */
  prefix?: () => VNode[]
  /** Replaces the formatted number inside the `value` element. */
  default?: (props: NumberValueSlotProps) => VNode[]
  /** Content after the number, wrapped in the `suffix` element. */
  suffix?: () => VNode[]
}
