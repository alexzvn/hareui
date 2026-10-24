import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Meter = typeof theme

/** Props of `Meter`, a graphical display of a numeric value within a known range, such as storage used or battery level. */
export type MeterProps = {
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
   * Number format for the value display. Percent formats the fraction of the range.
   * @defaultValue { style: 'percent' }
   */
  formatOptions?: Intl.NumberFormatOptions
  /** Custom value text (e.g. `'3 of 4'`), replacing the formatted value in the output and `aria-valuetext`. */
  valueLabel?: string
  /** Visible label, rendered in the top-left grid area and referenced by `aria-labelledby`. */
  label?: string
  /**
   * Whether to render the value output. Defaults to showing it when there is a label.
   */
  showOutput?: boolean
  /**
   * Size of the meter track.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Meter>['size']
  /**
   * Color of the fill bar.
   * @defaultValue 'accent'
   */
  color?: ComponentVariants<Meter>['color']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Meter>
}

/** What the `#label` and `#output` slots of `Meter` receive. */
export type MeterSlotProps = {
  /** The percentage of the meter (0–100). */
  percentage: number
  /** The formatted value text. */
  valueText: string
}

/** Slots of `Meter`. */
export type MeterSlots = {
  /** Replaces the label text. */
  label?: (props: MeterSlotProps) => VNode[]
  /** Replaces the value output text. */
  output?: (props: MeterSlotProps) => VNode[]
}
