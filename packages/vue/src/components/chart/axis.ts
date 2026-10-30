import type { ClassValue } from '@/utils/tv'

import type { ChartAxisDomain, ChartAxisInterval } from './types'

/** Tick labels and tick lines of `ChartXAxis` and `ChartYAxis`, the `tick` prop. */
export type ChartAxisTickOptions = {
  /**
   * Shows tick labels.
   * @defaultValue true
   */
  label?: boolean
  /**
   * Number of ticks on a number axis (rounded to nice values).
   * @defaultValue 5
   */
  count?: number
  // Method syntax keeps the parameter bivariant, so a number axis can take `(value: number) => string`.
  /**
   * Formats tick labels. Receives the tick value (a number on number axes) and its index.
   * @defaultValue `String(value)`
   */
  formatter?(value: number | string, index: number): string
  /**
   * Gap between the tick labels and the axis, in px. Added to `size`.
   * @defaultValue 2
   */
  margin?: number
  /**
   * Length of the tick lines, in px. Reserved even when `line` is `false`.
   * @defaultValue 6
   */
  size?: number
  /**
   * Draws tick lines. Hidden by the default theme.
   * @defaultValue true
   */
  line?: boolean
}

/** `ChartAxisTickOptions` with every default applied. */
export type ResolvedAxisTick = Required<Omit<ChartAxisTickOptions, 'formatter'>> &
  Pick<ChartAxisTickOptions, 'formatter'>

/** Defaults of `ChartAxisTickOptions`; a partial `tick` prop keeps the others. */
export const CHART_AXIS_TICK_DEFAULTS: Readonly<Omit<ResolvedAxisTick, 'formatter'>> = {
  label: true,
  count: 5,
  margin: 2,
  size: 6,
  line: true,
}

/** Props shared by `ChartXAxis` and `ChartYAxis`. */
export type ChartAxisProps = {
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
   * Tick labels and lines. Unset keys keep their defaults.
   * @defaultValue { label: true, count: 5, margin: 2, size: 6, line: true }
   */
  tick?: ChartAxisTickOptions
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

/** Props of the axis `#tick` slot, one call per tick label. */
export type ChartAxisTickSlotProps = {
  /** Horizontal label position in SVG px. */
  x: number
  /** Vertical label position in SVG px. */
  y: number
  /** Raw tick value. */
  value: number | string
  /** Data index (category axes) or tick index (number axes). */
  index: number
  /** Formatted label. */
  text: string
  /** `text-anchor` that keeps the label clear of the axis line on this side of the plot. */
  textAnchor: 'start' | 'middle' | 'end'
}

/** Slots of `ChartXAxis` and `ChartYAxis`. */
export type ChartAxisSlots = {
  /** Replaces each tick label. Render SVG (`<text>`). */
  tick?: (props: ChartAxisTickSlotProps) => unknown
}
