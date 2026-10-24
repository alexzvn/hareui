import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

import type { ChartAxisDomain } from './types'

export type ChartPolarAngleAxisProps = {
  /** Key of the category shown around the chart. */
  dataKey?: string
  /**
   * `category` spreads the data evenly around the circle; `number` maps values onto the sweep.
   * Defaults to `category` in radar charts and `number` in radial charts.
   */
  type?: 'category' | 'number'
  /** Number axes: `[min, max]` of the sweep. In radial charts, a fixed max turns bars into progress gauges. */
  domain?: ChartAxisDomain
  /**
   * Number axes: number of ticks.
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
   * Runs the axis in the opposite direction.
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
   * Distance between the outer ring and the labels, in px.
   * @defaultValue 8
   */
  tickSize?: number
  /**
   * Draws the tick marks. They are transparent by default; give `ui.tickLine` a stroke to show them.
   * @defaultValue true
   */
  tickLine?: boolean
  /**
   * Draws the outer ring. It is transparent by default; give `ui.axisLine` a stroke to show it.
   * @defaultValue true
   */
  axisLine?: boolean
  /**
   * Shape of the outer ring.
   * @defaultValue 'polygon'
   */
  axisLineType?: 'polygon' | 'circle'
  /**
   * Places the labels outside or inside the outer ring.
   * @defaultValue 'outer'
   */
  orientation?: 'outer' | 'inner'
  /**
   * Hides the axis. The data still uses it.
   * @defaultValue false
   */
  hide?: boolean
  /** Additional classes merged into the axis group. */
  class?: ClassValue
}

export type ChartPolarAngleAxisSlots = {
  /** Replaces a tick label. Render SVG (`<text>`, `<g>`). */
  tick?: (props: {
    x: number
    y: number
    value: number | string
    index: number
    text: string
    textAnchor: 'start' | 'middle' | 'end'
    dy: string
  }) => VNode[]
}
