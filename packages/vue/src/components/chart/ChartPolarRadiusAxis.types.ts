import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

import type { ChartAxisDomain } from './types'

export type ChartPolarRadiusAxisProps = {
  /**
   * Direction of the axis line, in degrees. 0 is at 3 o'clock; 90 points up.
   * @defaultValue 0
   */
  angle?: number
  /** Radial charts: key of the ring names. */
  dataKey?: string
  /**
   * `number` maps values from the center outwards; `category` gives each row a ring.
   * Defaults to `number` in radar charts and `category` in radial charts.
   */
  type?: 'category' | 'number'
  /** Number axes: `[min, max]` from the center to the outer ring. */
  domain?: ChartAxisDomain
  /**
   * Number axes: number of ticks (and grid rings).
   * @defaultValue 5
   */
  tickCount?: number
  /**
   * Number axes: allows decimal ticks.
   * @defaultValue true
   */
  allowDecimals?: boolean
  /**
   * Number axes: keeps a fixed `domain` even when data falls outside it.
   * @defaultValue false
   */
  allowDataOverflow?: boolean
  /** Number axes: explicit tick values. */
  ticks?: number[]
  /**
   * Runs the axis from the outer ring to the center.
   * @defaultValue false
   */
  reversed?: boolean
  /**
   * Shows the tick labels.
   * @defaultValue true
   */
  tick?: boolean
  /** Formats a tick label. */
  tickFormatter?: (value: number | string, index: number) => string
  /**
   * Draws the axis line.
   * @defaultValue true
   */
  axisLine?: boolean
  /**
   * Side of the axis line the labels sit on.
   * @defaultValue 'right'
   */
  orientation?: 'left' | 'right' | 'middle'
  /**
   * Hides the axis. The data still uses it.
   * @defaultValue false
   */
  hide?: boolean
  /** Additional classes merged into the axis group. */
  class?: ClassValue
}

export type ChartPolarRadiusAxisSlots = {
  /** Replaces a tick label. Render SVG (`<text>`, `<g>`). */
  tick?: (props: {
    x: number
    y: number
    value: number | string
    index: number
    text: string
    textAnchor: 'start' | 'middle' | 'end'
  }) => VNode[]
}
