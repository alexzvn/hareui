import type { CartesianRootProps, CartesianRootSlots } from '@/components/chart/cartesian-root'
import type { ChartLineSeries } from '@/components/chart/series-config'
import type { ChartCurveType } from '@/components/chart/types'
import type { ComponentSlots } from '@/types/tv'

import type theme from './theme'

type LineChartTheme = typeof theme

/** Props of `LineChart`: a cartesian chart that shows trends as connected lines. */
export type LineChartProps<T extends object = Record<string, unknown>> = {
  /**
   * Curve of every series.
   * @defaultValue 'monotone'
   */
  curve?: ChartCurveType
  /**
   * Stroke width of every series, in px.
   * @defaultValue 2, or 1.5 with `sparkline`
   */
  strokeWidth?: number
  /**
   * Dot at every data point.
   * @defaultValue false
   */
  dot?: ChartLineSeries['dot']
  /**
   * Draws across missing values instead of leaving a gap.
   * @defaultValue false
   */
  connectNulls?: boolean
  /** Per-slot class overrides. */
  ui?: ComponentSlots<LineChartTheme>
} & CartesianRootProps<T, ChartLineSeries>

/** Slots of `LineChart`: chart parts, axis tick labels, legend and tooltip content. */
export type LineChartSlots = {} & CartesianRootSlots
