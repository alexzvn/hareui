import type { CartesianRootProps, CartesianRootSlots } from '@/components/chart/cartesian-root'
import type { ChartBarSeries } from '@/components/chart/series-config'
import type { ChartRadius } from '@/components/chart/shapes'
import type { ComponentSlots } from '@/types/tv'

import type theme from './theme'

type BarChartTheme = typeof theme

export type BarChartProps<T extends object = Record<string, unknown>> = {
  /**
   * Bar direction. Use `'vertical'` for horizontal bars: the category axis becomes the y-axis.
   * @defaultValue 'horizontal'
   */
  layout?: 'horizontal' | 'vertical'
  /**
   * Gap between neighbouring categories, as a percentage of the band or in pixels.
   * @defaultValue '10%'
   */
  barCategoryGap?: number | string
  /**
   * Gap between bars of the same category, in pixels or as a percentage.
   * @defaultValue 4
   */
  barGap?: number | string
  /** Default bar thickness, in px or percent of the band. A `ChartBar` with its own `barSize` overrides it. */
  barSize?: number | string
  /** Maximum bar thickness, in px. */
  maxBarSize?: number
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

export type BarChartSlots = {} & CartesianRootSlots
