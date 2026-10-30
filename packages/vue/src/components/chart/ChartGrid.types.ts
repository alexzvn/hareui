import type { ClassValue } from '@/utils/tv'

/** Props of `ChartGrid`: reference lines across the plot area at the axis ticks. */
export type ChartGridProps = {
  /**
   * Draws horizontal lines at the y axis ticks.
   * @defaultValue true
   */
  horizontal?: boolean
  /**
   * Draws vertical lines at the x axis ticks.
   * @defaultValue true
   */
  vertical?: boolean
  /** Dash pattern of the lines, e.g. `'3 3'`. */
  strokeDasharray?: string
  /** Exact y positions (px) of the horizontal lines, instead of the y axis ticks. */
  horizontalPoints?: number[]
  /** Exact x positions (px) of the vertical lines, instead of the x axis ticks. */
  verticalPoints?: number[]
  /**
   * Draws lines only at the axis ticks. Off, lines are also drawn along the plot edges.
   * @defaultValue false
   */
  syncWithTicks?: boolean
  /**
   * X axis whose ticks place the vertical lines.
   * @defaultValue 0
   */
  xAxisId?: string | number
  /**
   * Y axis whose ticks place the horizontal lines.
   * @defaultValue 0
   */
  yAxisId?: string | number
  /** Additional classes merged into the grid group. */
  class?: ClassValue
}
