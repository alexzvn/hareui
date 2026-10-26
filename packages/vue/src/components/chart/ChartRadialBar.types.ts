import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

import type { ChartAnimationProps } from './animation'

/** Track drawn behind each radial bar, over the full angle. */
export type ChartRadialBarBackground = {
  /** Track color. Defaults to the theme's default color. */
  fill?: string
  /** Additional classes merged into each track. */
  class?: ClassValue
}

/** Props of `ChartRadialBar`: one ring per row, its arc sized by `dataKey` on the angle axis. */
export type ChartRadialBarProps = {
  /** Key of the value in each row. */
  dataKey: string
  /**
   * Key of the ring names shown in the tooltip.
   * @defaultValue 'name'
   */
  nameKey?: string
  /** Name used when a row has no `nameKey` value. Defaults to `dataKey`. */
  name?: string
  /**
   * Bar color for rings without a `ChartCell` or a `fill` field in their row.
   * @defaultValue 'var(--chart-3)'
   */
  fill?: string
  /** Fill opacity, 0–1. */
  fillOpacity?: number
  /** Outline color. No outline by default. */
  stroke?: string
  /** Outline width, in px. */
  strokeWidth?: number
  /**
   * Corner radius of the bar ends, in px. Capped at half the bar thickness.
   * @defaultValue 0
   */
  cornerRadius?: number
  /**
   * Draws a full-length track behind every bar: `true` or `{ fill, class }`.
   * @defaultValue false
   */
  background?: boolean | ChartRadialBarBackground
  /** Bar thickness, in px or as a percentage of the ring. Overrides the chart's `barSize`. */
  barSize?: number | string
  /** Largest bar thickness, in px. */
  maxBarSize?: number
  /**
   * Smallest sweep of a bar, in degrees, so that small values stay visible.
   * @defaultValue 0
   */
  minPointSize?: number
  /**
   * Hides the bars.
   * @defaultValue false
   */
  hide?: boolean
  /** `'none'` leaves the bars out of the tooltip. */
  tooltipType?: 'none'
  /** Additional classes merged into the bar group. */
  class?: ClassValue
} & ChartAnimationProps

/** Slots of `ChartRadialBar`. */
export type ChartRadialBarSlots = {
  /** `ChartCell` per ring (in data order) and `ChartLabel`. */
  default?: () => VNode[]
}
