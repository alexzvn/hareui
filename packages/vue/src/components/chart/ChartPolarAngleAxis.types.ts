import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

import type { ChartAxisDomain } from './types'

/** Tick labels and tick marks of `ChartPolarAngleAxis`, the `tick` prop. */
export type ChartPolarAngleAxisTickOptions = {
  /**
   * Shows the tick labels.
   * @defaultValue true
   */
  label?: boolean
  /**
   * Number axes: number of ticks.
   * @defaultValue 5
   */
  count?: number
  /**
   * Formats a tick label.
   * @defaultValue `String(value)`
   */
  formatter?: (value: number | string, index: number) => string
  /**
   * Distance between the outer ring and the labels, in px.
   * @defaultValue 8
   */
  size?: number
  /**
   * Draws the tick marks. They are transparent by default; give `ui.tickLine` a stroke to show them.
   * @defaultValue true
   */
  line?: boolean
}

/** Outer ring of `ChartPolarAngleAxis`, the `axisLine` prop. */
export type ChartPolarAngleAxisLineOptions = {
  /**
   * Draws the outer ring. It is transparent by default; give `ui.axisLine` a stroke to show it.
   * @defaultValue true
   */
  show?: boolean
  /**
   * Shape of the outer ring.
   * @defaultValue 'polygon'
   */
  type?: 'polygon' | 'circle'
}

/** Props of `ChartPolarAngleAxis`: the category axis around a polar chart, with its outline and tick labels. */
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
   * Tick labels and marks. Unset keys keep their defaults.
   * @defaultValue { label: true, count: 5, size: 8, line: true }
   */
  tick?: ChartPolarAngleAxisTickOptions
  /**
   * Outer ring. Unset keys keep their defaults.
   * @defaultValue { show: true, type: 'polygon' }
   */
  axisLine?: ChartPolarAngleAxisLineOptions
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

/** Slots of `ChartPolarAngleAxis`. */
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
