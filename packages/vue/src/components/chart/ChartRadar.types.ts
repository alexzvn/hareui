import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

import type { ChartAnimationProps } from './animation'
import type { ChartDotProps } from './types'

/** Props of `ChartRadar`: a series drawn as a polygon through one point per category. */
export type ChartRadarProps = {
  /** Key of the value in each row. */
  dataKey: string
  /** Name shown in the tooltip. Defaults to `dataKey`. */
  name?: string
  /**
   * Outline color. Defaults to `fill`.
   * @defaultValue 'var(--chart-3)'
   */
  stroke?: string
  /**
   * Outline width, in px.
   * @defaultValue 1
   */
  strokeWidth?: number
  /** Dash pattern of the outline, e.g. `'4 4'`. */
  strokeDasharray?: string
  /**
   * Fill color. Defaults to `stroke`. Set `'none'` and a `stroke` for an outline only.
   * @defaultValue 'var(--chart-3)'
   */
  fill?: string
  /** Fill opacity, 0–1. */
  fillOpacity?: number
  /**
   * Dot at every data point: `true`, `false`, or dot props (`r`, `fill`, `stroke`, `strokeWidth`, `class`).
   * @defaultValue false
   */
  dot?: boolean | ChartDotProps
  /**
   * Dot on the hovered point: `true`, `false`, or dot props.
   * @defaultValue true
   */
  activeDot?: boolean | ChartDotProps
  /**
   * Hides the radar; the radius axis ignores it.
   * @defaultValue false
   */
  hide?: boolean
  /** `'none'` leaves the radar out of the tooltip. */
  tooltipType?: 'none'
  /** Additional classes merged into the radar group. */
  class?: ClassValue
} & ChartAnimationProps

/** Slots of `ChartRadar`. */
export type ChartRadarSlots = {
  /** `ChartLabel` for a label at every point. */
  default?: () => VNode[]
}
