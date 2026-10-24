import type { ClassValue } from 'tailwind-variants'

import type { ChartAxisDomain, ChartAxisInterval } from './types'

/** Props shared by `ChartXAxis` and `ChartYAxis`. */
export interface ChartAxisProps {
  /** Data key of the category values. Category axes without it show the data index. */
  dataKey?: string
  /**
   * `'category'` places data at evenly spaced points or bands; `'number'` uses a linear scale.
   * @defaultValue 'category' on `ChartXAxis`, 'number' on `ChartYAxis` (swapped in the vertical layout)
   */
  type?: 'number' | 'category'
  /**
   * Hides the axis. Its scale still positions the series.
   * @defaultValue false
   */
  hide?: boolean
  /**
   * Number axis range: `[min, max]` where each end is a number, `'auto'`, `'dataMin'`, `'dataMax'`,
   * `'dataMin - 10'`, `'dataMax + 10'` or a function of the data bound. Value axes default to `[0, 'auto']`;
   * a number axis along the data defaults to `['auto', 'auto']`.
   */
  domain?: ChartAxisDomain
  /** Exact tick values. */
  ticks?: (number | string)[]
  /**
   * Number of ticks on a number axis (rounded to nice values).
   * @defaultValue 5
   */
  tickCount?: number
  /**
   * Allows decimal tick values.
   * @defaultValue true
   */
  allowDecimals?: boolean
  /**
   * Lets a fixed `domain` cut off data instead of growing to fit it.
   * @defaultValue false
   */
  allowDataOverflow?: boolean
  /** Formats tick labels. Receives the tick value (a number on number axes) and its index. */
  tickFormatter?(value: number | string, index: number): string
  /**
   * Shows tick labels.
   * @defaultValue true
   */
  tick?: boolean
  /**
   * Gap between the tick labels and the axis, in px. Added to `tickSize`.
   * @defaultValue 2
   */
  tickMargin?: number
  /**
   * Length of the tick lines, in px. Reserved even when `tickLine` is `false`.
   * @defaultValue 6
   */
  tickSize?: number
  /**
   * Draws tick lines. Hidden by the default theme.
   * @defaultValue true
   */
  tickLine?: boolean
  /**
   * Draws the axis line. Hidden by the default theme.
   * @defaultValue true
   */
  axisLine?: boolean
  /**
   * Which labels to keep when they would overlap, or a number to show every n+1th tick.
   * @defaultValue 'preserveEnd'
   */
  interval?: ChartAxisInterval
  /**
   * Minimum space between two labels, in px.
   * @defaultValue 5
   */
  minTickGap?: number
  /**
   * Reverses the axis direction.
   * @defaultValue false
   */
  reversed?: boolean
  /** Text appended to every tick label. */
  unit?: string
  /** Additional classes merged into the axis group. */
  class?: ClassValue
}

export interface ChartAxisTickSlotProps {
  /** Label position in SVG px. */
  x: number
  y: number
  /** Raw tick value. */
  value: number | string
  /** Data index (category axes) or tick index (number axes). */
  index: number
  /** Formatted label. */
  text: string
  textAnchor: 'start' | 'middle' | 'end'
}

export interface ChartAxisSlots {
  /** Replaces each tick label. Render SVG (`<text>`). */
  tick?: (props: ChartAxisTickSlotProps) => unknown
}
