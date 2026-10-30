import type { CartesianRootProps, CartesianRootSlots } from '@/components/chart/cartesian-root'
import type { ChartBarSeries } from '@/components/chart/series-config'
import type { ChartRadius } from '@/components/chart/shapes'
import type { ChartBarSizing } from '@/components/chart/types'
import type { ComponentSlots } from '@/types/tv'

import type theme from './theme'

type BarChartTheme = typeof theme

/** Props of `BarChart`: a cartesian chart that compares values across categories with bars. */
export type BarChartProps<T extends object = Record<string, unknown>> = {
  /**
   * Bar direction. Use `'vertical'` for horizontal bars: the category axis becomes the y-axis.
   * @defaultValue 'horizontal'
   */
  layout?: 'horizontal' | 'vertical'
  /**
   * Bar thickness and gaps. Unset keys keep their defaults; a `ChartBar` with its own `barSize` / `maxBarSize` wins.
   * @defaultValue { gap: 4, categoryGap: '10%' }
   */
  bar?: ChartBarSizing
  /**
   * Stacks every bar on one stack. A series' own `stack` wins.
   * @defaultValue false
   */
  stacked?: boolean
  /**
   * Corner radius of the bar ends: only the outer end of a bar, or of the top bar of a stack, is rounded.
   * @defaultValue 4
   */
  radius?: ChartRadius
  /** Per-slot class overrides. */
  ui?: ComponentSlots<BarChartTheme>
} & CartesianRootProps<T, ChartBarSeries>

/** Slots of `BarChart`: chart parts, axis tick labels, legend and tooltip content. */
export type BarChartSlots = {} & CartesianRootSlots
