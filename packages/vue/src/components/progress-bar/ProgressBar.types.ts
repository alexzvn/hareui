import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ProgressBar = typeof theme

/** Props for `ProgressBar`, which shows the progress of an operation over time. */
export type ProgressBarProps = {
  /**
   * The current value (clamped to `minValue`–`maxValue`).
   * @defaultValue 0
   */
  value?: number
  /**
   * The minimum value.
   * @defaultValue 0
   */
  minValue?: number
  /**
   * The maximum value.
   * @defaultValue 100
   */
  maxValue?: number
  /**
   * Whether progress is indeterminate (no value; the fill loops).
   * @defaultValue false
   */
  indeterminate?: boolean
  /**
   * Number format for the value display. Percent formats the fraction of the range.
   * @defaultValue { style: 'percent' }
   */
  formatOptions?: Intl.NumberFormatOptions
  /** Custom value text (e.g. `'3 of 4'`), replacing the formatted value in the output and `aria-valuetext`. */
  valueLabel?: string
  /** Visible label, rendered in the top-left grid area and referenced by `aria-labelledby`. */
  label?: string
  /**
   * Whether to render the value output. Defaults to showing it next to a label, unless indeterminate.
   */
  showOutput?: boolean
  /**
   * Size of the progress track.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<ProgressBar>['size']
  /**
   * Color of the fill bar.
   * @defaultValue 'accent'
   */
  color?: ComponentVariants<ProgressBar>['color']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ProgressBar>
}

/** Props passed to the `ProgressBar` slots. */
export type ProgressBarSlotProps = {
  /** The percentage of the progress (0–100); `undefined` when indeterminate. */
  percentage: number | undefined
  /** The formatted value text; `undefined` when indeterminate. */
  valueText: string | undefined
  /** Whether progress is indeterminate. */
  indeterminate: boolean
}

/** Slots for `ProgressBar`. */
export type ProgressBarSlots = {
  /** Replaces the label text. */
  label?: (props: ProgressBarSlotProps) => VNode[]
  /** Replaces the value output text. */
  output?: (props: ProgressBarSlotProps) => VNode[]
}
