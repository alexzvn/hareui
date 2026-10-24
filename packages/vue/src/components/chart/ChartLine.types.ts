import type { ChartCurveSeriesProps } from './series'

export type ChartLineProps = ChartCurveSeriesProps

export type ChartLineSlots = {
  /** `ChartLabel` to label every point. */
  default?: () => unknown
}
