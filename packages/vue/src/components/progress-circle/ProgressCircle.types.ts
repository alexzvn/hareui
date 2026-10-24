import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ProgressCircle = typeof theme

/** Props of the `ProgressCircle` component: a circular indicator of progress toward a value. */
export type ProgressCircleProps = {
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
   * Whether progress is indeterminate (a quarter arc spins).
   * @defaultValue false
   */
  indeterminate?: boolean
  /**
   * Number format for `aria-valuetext`. Percent formats the fraction of the range.
   * @defaultValue { style: 'percent' }
   */
  formatOptions?: Intl.NumberFormatOptions
  /** Custom value text (e.g. `'3 of 4'`) for `aria-valuetext`. */
  valueLabel?: string
  /**
   * Stroke width of both circles in the 36×36 viewBox; the radius follows as `18 - strokeWidth / 2`.
   * @defaultValue 4
   */
  strokeWidth?: number
  /**
   * Size of the circle.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<ProgressCircle>['size']
  /**
   * Color of the progress arc.
   * @defaultValue 'accent'
   */
  color?: ComponentVariants<ProgressCircle>['color']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ProgressCircle>
}
