import type { CartesianRootProps, CartesianRootSlots } from '@/components/chart/cartesian-root'
import type { ChartAreaSeries } from '@/components/chart/series-config'
import type { ChartCurveType } from '@/components/chart/types'
import type { ComponentSlots } from '@/types/tv'

import type theme from './theme'

type AreaChartTheme = typeof theme

export type AreaChartProps<T extends object = Record<string, unknown>> = {
  /**
   * Stacks every area on one stack. A series' own `stack` wins.
   * @defaultValue false
   */
  stacked?: boolean
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
   * Fill of every area: `'gradient'` fades the series color downwards, `'solid'` fills it flat, `'none'` draws only
   * the line, any other value is used as the fill (e.g. `url(#my-gradient)`).
   * @defaultValue 'gradient'
   */
  fill?: ChartAreaSeries['fill']
  /**
   * Fill opacity, or `[top, bottom]` opacities of the gradient.
   * @defaultValue [0.2, 0.02]
   */
  fillOpacity?: ChartAreaSeries['fillOpacity']
  /**
   * Dot at every data point.
   * @defaultValue false
   */
  dot?: ChartAreaSeries['dot']
  /**
   * Draws across missing values instead of leaving a gap.
   * @defaultValue false
   */
  connectNulls?: boolean
  /** Per-slot class overrides. */
  ui?: ComponentSlots<AreaChartTheme>
} & CartesianRootProps<T, ChartAreaSeries>

export type AreaChartSlots = {} & CartesianRootSlots
