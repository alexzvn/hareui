import type { ChartSeriesProps } from './series'
import type { ChartRadius } from './shapes'

export type ChartBarProps = {
  /**
   * Bar color or `url(#gradient-id)`.
   * @defaultValue 'var(--chart-3)'
   */
  fill?: string
  /** Opacity of the fill. */
  fillOpacity?: number
  /** Outline color. */
  stroke?: string
  /** Outline width, in px. */
  strokeWidth?: number
  /** Bars with the same `stackId` stack on top of each other. */
  stackId?: string | number
  /** Bar thickness, in px or percent of the band. Defaults to an even share of the band. */
  barSize?: number | string
  /** Maximum bar thickness, in px. */
  maxBarSize?: number
  /**
   * Corner radius: one value, or `[topLeft, topRight, bottomRight, bottomLeft]`.
   * @defaultValue 0
   */
  radius?: ChartRadius
} & ChartSeriesProps

export type ChartBarSlots = {
  /** `ChartCell` per bar to override its fill, and `ChartLabel` to label every bar. */
  default?: () => unknown
}
