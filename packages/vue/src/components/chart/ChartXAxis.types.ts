import type { ChartAxisProps, ChartAxisSlots } from './axis'

/** Props of `ChartXAxis`: the horizontal axis of a cartesian chart, with its line, ticks and labels. */
export type ChartXAxisProps = {
  /**
   * Id that series reference with `xAxisId` when a chart has several x axes.
   * @defaultValue 0
   */
  xAxisId?: string | number
  /**
   * Side of the plot the axis sits on.
   * @defaultValue 'bottom'
   */
  orientation?: 'top' | 'bottom'
  /**
   * Height reserved for the axis, in px.
   * @defaultValue 30
   */
  height?: number
  /** Space before the first and after the last category, in px. */
  padding?: { left?: number; right?: number }
} & ChartAxisProps

/** Slots of `ChartXAxis`. */
export type ChartXAxisSlots = ChartAxisSlots
