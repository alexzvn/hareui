import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

import type { ChartAnimationProps } from './animation'

export type ChartPieProps = {
  /** Slices of the pie. Defaults to the chart's `data`. Rows may leave keys out, e.g. a `fill` set on some rows only. */
  data?: object[]
  /** Key of the slice values. */
  dataKey: string
  /**
   * Key of the slice names shown in the tooltip.
   * @defaultValue 'name'
   */
  nameKey?: string
  /** Name used when a slice has no `nameKey` value. Defaults to the slice index. */
  name?: string
  /**
   * Horizontal center, in px or as a percentage of the chart width.
   * @defaultValue '50%'
   */
  cx?: number | string
  /**
   * Vertical center, in px or as a percentage of the chart height.
   * @defaultValue '50%'
   */
  cy?: number | string
  /**
   * Inner radius, in px or as a percentage of half the shorter chart side. Set it to draw a donut.
   * @defaultValue 0
   */
  innerRadius?: number | string
  /**
   * Outer radius, in px or as a percentage of half the shorter chart side.
   * @defaultValue '80%'
   */
  outerRadius?: number | string
  /**
   * Angle of the first slice edge, in degrees. 0 is at 3 o'clock; angles grow counter-clockwise.
   * @defaultValue 0
   */
  startAngle?: number
  /**
   * Angle of the last slice edge, in degrees. Use `startAngle: 180, endAngle: 0` for a half pie.
   * @defaultValue 360
   */
  endAngle?: number
  /**
   * Gap between slices, in degrees. Negative values overlap the slices, which pairs well with `cornerRadius`.
   * @defaultValue 0
   */
  paddingAngle?: number
  /**
   * Smallest angle of a non-zero slice, in degrees.
   * @defaultValue 0
   */
  minAngle?: number
  /**
   * Corner radius of each slice, in px. Capped at half the ring thickness.
   * @defaultValue 0
   */
  cornerRadius?: number
  /**
   * Fill of the slices without a `ChartCell`.
   * @defaultValue 'var(--chart-3)'
   */
  fill?: string
  /** Outline color of the slices. No outline by default. */
  stroke?: string
  /** Outline width of the slices, in px. */
  strokeWidth?: number
  /**
   * Hides the pie.
   * @defaultValue false
   */
  hide?: boolean
  /** `'none'` leaves the pie out of the tooltip. */
  tooltipType?: 'none'
  /** Additional classes merged into the pie group. */
  class?: ClassValue
} & ChartAnimationProps

export type ChartPieSlots = {
  /** `ChartCell` per slice (in data order) and `ChartLabel`. */
  default?: () => VNode[]
}
