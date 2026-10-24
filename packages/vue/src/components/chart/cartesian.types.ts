import type { ComputedRef } from 'vue'

import type { ChartTick } from './scale'
import type { ChartAxisDomain, ChartAxisInterval, ChartOffset } from './types'

/** Id linking series to an axis; `0` when unset. */
export type ChartAxisId = string | number

/** Axis settings registered by `ChartXAxis` / `ChartYAxis`. */
export type ChartAxisConfig = {
  axis: 'x' | 'y'
  id: ChartAxisId
  type?: 'number' | 'category'
  dataKey?: string
  domain?: ChartAxisDomain
  ticks?: (number | string)[]
  tickCount?: number
  allowDecimals?: boolean
  allowDataOverflow?: boolean
  hide?: boolean
  /** Width of a y axis / height of an x axis, in px. `'auto'` fits the widest tick label (y axes). */
  size?: number | 'auto'
  /** Tick size plus tick margin: the space between the plot and the labels, used by `size: 'auto'`. */
  tickSpace?: number
  orientation?: 'top' | 'bottom' | 'left' | 'right'
  /** Space before the first and after the last category, in px. */
  padding?: [number, number]
  reversed?: boolean
  interval?: ChartAxisInterval
  minTickGap?: number
  tickFormatter?: (value: number | string, index: number) => string
  unit?: string
  /** Tick label font size used to thin overlapping labels. */
  fontSize?: number
}

/** An axis with its scale, box and ticks laid out against the plot area. */
export type ResolvedAxis = {
  id: ChartAxisId
  axis: 'x' | 'y'
  type: 'number' | 'category'
  scaleType: 'point' | 'band' | 'linear'
  config: ChartAxisConfig
  hide: boolean
  orientation: 'top' | 'bottom' | 'left' | 'right'
  /** Width (y) or height (x) reserved for the axis. */
  size: number
  /** Box of the axis next to the plot area. */
  box: { x: number; y: number; width: number; height: number }
  /** Number axis: pixel position of a value. Category axis: start of the datum's band (or its point). */
  scale: (value: number) => number
  /** Pixel position of datum `index` along this axis (band center for band scales). */
  position: (index: number) => number
  /** Band width (0 for point and linear scales). */
  bandwidth: number
  domain: [number, number] | number[]
  range: [number, number]
  /** Visible ticks after overlap thinning. */
  ticks: ChartTick[]
  /** Every tick before thinning (grid lines use these). */
  allTicks: ChartTick[]
}

/** Bar layout settings a cartesian root passes to `useCartesianChart`. */
export type CartesianChartOptions = {
  /** Gap between bands, px or percent of the band. @defaultValue '10%' */
  barCategoryGap?: () => number | string | undefined
  /** Gap between bars of one band, px or percent. @defaultValue 4 */
  barGap?: () => number | string | undefined
  /** Default bar size, px or percent of the band. */
  barSize?: () => number | string | undefined
  /** Max bar size in px. */
  maxBarSize?: () => number | undefined
}

/** `[base, value]` per datum (stacked: `[lower, upper]`); `null` where the value is missing. */
export type ChartSeriesPairs = Array<[number, number] | null>

/** Position and size of a bar series within its band, in px. */
export type ChartBarPosition = { offset: number; size: number }

/** What `useCartesianChart` provides to the parts of a cartesian chart. */
export type CartesianContext = {
  /** Plot area in SVG px. */
  offset: ComputedRef<ChartOffset>
  registerAxis: (get: () => ChartAxisConfig) => () => void
  axes: ComputedRef<ResolvedAxis[]>
  xAxis: (id?: ChartAxisId) => ResolvedAxis
  yAxis: (id?: ChartAxisId) => ResolvedAxis
  /** The axis data indexes run along: x in horizontal layout, y in vertical layout. */
  categoryAxis: ComputedRef<ResolvedAxis>
  /** `[base, value]` per datum (stacked: `[lower, upper]`); `null` where the value is missing. */
  seriesValues: (seriesId: string) => ChartSeriesPairs
  /** Position and size of a bar series within its band. */
  barPosition: (seriesId: string) => ChartBarPosition | null
  /** True when bars lay out vertically (category on x). */
  horizontal: ComputedRef<boolean>
}
