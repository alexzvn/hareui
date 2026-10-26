import type { ChartAxisProps, ChartAxisSlots } from './axis'

/** Props of `ChartYAxis`: the vertical axis of a cartesian chart, with its line, ticks and labels. */
export type ChartYAxisProps = {
  /**
   * Id that series reference with `yAxisId` when a chart has several y axes.
   * @defaultValue 0
   */
  yAxisId?: string | number
  /**
   * Side of the plot the axis sits on.
   * @defaultValue 'left'
   */
  orientation?: 'left' | 'right'
  /**
   * Width reserved for the axis, in px. `'auto'` fits the widest tick label.
   * @defaultValue 60
   */
  width?: number | 'auto'
  /** Space above the top and below the bottom value, in px. */
  padding?: { top?: number; bottom?: number }
} & ChartAxisProps

/** Slots of `ChartYAxis`. */
export type ChartYAxisSlots = ChartAxisSlots
