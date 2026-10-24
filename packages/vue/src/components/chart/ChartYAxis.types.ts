import type { ChartAxisProps, ChartAxisSlots } from './axis'

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

export type ChartYAxisSlots = ChartAxisSlots
