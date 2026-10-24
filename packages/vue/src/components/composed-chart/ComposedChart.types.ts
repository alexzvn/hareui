import type { CartesianRootProps, CartesianRootSlots } from '@/components/chart/cartesian-root'
import type { ChartComposedSeries } from '@/components/chart/series-config'
import type { ChartRadius } from '@/components/chart/shapes'
import type { ChartCurveType } from '@/components/chart/types'
import type { ComponentSlots } from '@/types/tv'

import type theme from './theme'

type ComposedChartTheme = typeof theme

/** Props of the `ComposedChart` component: areas, bars and lines on shared cartesian axes. */
export type ComposedChartProps<T extends object = Record<string, unknown>> = {
  /**
   * Stacks every area and bar on one stack; lines never stack. A series' own `stack` wins.
   * @defaultValue false
   */
  stacked?: boolean
  /**
   * Curve of every area and line.
   * @defaultValue 'monotone'
   */
  curve?: ChartCurveType
  /**
   * Stroke width of every area and line, in px.
   * @defaultValue 2, or 1.5 with `sparkline`
   */
  strokeWidth?: number
  /**
   * Corner radius of the bar ends.
   * @defaultValue 4
   */
  radius?: ChartRadius
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ComposedChartTheme>
} & CartesianRootProps<T, ChartComposedSeries>

/** Slots of the `ComposedChart` component, shared with the other cartesian charts. */
export type ComposedChartSlots = {} & CartesianRootSlots
