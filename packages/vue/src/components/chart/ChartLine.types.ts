import type { ChartCurveSeriesProps } from './series'

/** Props of `ChartLine`: a series drawn as a curve through its points. */
export type ChartLineProps = ChartCurveSeriesProps

/** Slots of `ChartLine`. */
export type ChartLineSlots = {
  /** `ChartLabel` to label every point. */
  default?: () => unknown
}
