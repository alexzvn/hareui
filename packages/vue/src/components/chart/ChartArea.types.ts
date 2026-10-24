import type { ChartCurveSeriesProps } from './series'

export type ChartAreaProps = {
  /**
   * Fill color, `url(#gradient-id)`, or `'gradient'`: a fade of the stroke color from `fillOpacity[0]` at the top
   * to `fillOpacity[1]` at the bottom. Defaults to the stroke color.
   */
  fill?: string
  /**
   * Opacity of the fill, or `[top, bottom]` opacities with `fill="gradient"`.
   * @defaultValue 0.6, or [0.2, 0.02] with `fill="gradient"`
   */
  fillOpacity?: number | [top: number, bottom: number]
  /** Areas with the same `stackId` stack on top of each other. */
  stackId?: string | number
  /** Baseline of an unstacked area: a value, or the bottom (`'dataMin'`) or top (`'dataMax'`) of the axis. */
  baseValue?: number | 'dataMin' | 'dataMax'
} & ChartCurveSeriesProps

export type ChartAreaSlots = {
  /** `ChartLabel` to label every point. */
  default?: () => unknown
}
