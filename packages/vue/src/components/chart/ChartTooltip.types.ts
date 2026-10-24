import type { ChartTooltipContentEntry, ChartTooltipContentProps } from '@/components/chart-tooltip'
import type { ClassValue } from '@/utils/tv'

import type { ChartPoint, ChartTooltipPayloadEntry } from './types'

export type ChartTooltipProps = {
  /**
   * Hover cursor: a dashed line (`'line'`), a band behind the hovered category (`'band'`), or none.
   * `true` draws a band in a `BarChart`, and a dashed line in every other chart.
   * @defaultValue true
   */
  cursor?: boolean | 'line' | 'band'
  /**
   * Draws the floating panel. With `false` the chart still tracks the hovered point (active dots, cursor) and
   * announces it to screen readers, without a visible panel.
   * @defaultValue true
   */
  panel?: boolean
  /**
   * Shape of the color marker next to each series name.
   * @defaultValue 'dot'
   */
  indicator?: ChartTooltipContentProps['indicator']
  /**
   * Hides the header row.
   * @defaultValue false
   */
  hideHeader?: boolean
  /** Formats the header label. */
  labelFormatter?(label: number | string): string
  /** Formats each series value. Also receives the row's entry, so the format can depend on its `dataKey`. */
  valueFormatter?(value: number | string, entry: ChartTooltipContentEntry): string
  /**
   * Distance between the pointer and the panel, in px.
   * @defaultValue 10
   */
  offset?: number
  /** Index of the row shown before any interaction. */
  defaultIndex?: number
  /**
   * Slides the panel between positions.
   * @defaultValue true
   */
  isAnimationActive?: boolean
  /**
   * Slide duration, in ms.
   * @defaultValue 400
   */
  animationDuration?: number
  /** Additional classes merged into the panel. */
  class?: ClassValue
}

export type ChartTooltipSlotProps = {
  /** Whether a row is hovered or focused. */
  active: boolean
  /** Category of the hovered row (x value, or the sector name in pie charts). */
  label: number | string | undefined
  /** One row per visible series. */
  payload: ChartTooltipPayloadEntry[]
  /** Anchor of the panel in SVG px. */
  coordinate: ChartPoint | null
}

export type ChartTooltipSlots = {
  /** Replaces the panel, e.g. with a composed `ChartTooltipContent`. */
  content?: (props: ChartTooltipSlotProps) => unknown
  /** Content under the default panel's rows, e.g. a total. Ignored when `#content` is used. */
  footer?: (props: { label?: number | string; payload: ChartTooltipContentEntry[] }) => unknown
}
