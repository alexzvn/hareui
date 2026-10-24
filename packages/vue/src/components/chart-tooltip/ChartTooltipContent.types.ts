import type { VNode } from 'vue'

import type { ChartTooltipPayloadEntry } from '@/components/chart/types'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ChartTooltip = typeof theme

/** A payload row. Charts pass full entries; hand-written payloads may set only `name`, `value` and a color. */
export type ChartTooltipContentEntry = Partial<ChartTooltipPayloadEntry> & {
  /** Used as the indicator color when `color` is missing. */
  stroke?: string
  /** Used as the indicator color when `color` and `stroke` are missing. */
  fill?: string
}

export type ChartTooltipContentProps = {
  /**
   * Renders the panel. Nothing is rendered when `false`.
   * @defaultValue true
   */
  active?: boolean
  /**
   * Shape of the color marker next to each series name.
   * @defaultValue 'dot'
   */
  indicator?: ComponentVariants<ChartTooltip>['indicator']
  /** Header text, usually the x-axis value of the hovered point. */
  label?: number | string
  /** Series rows to render when the default slot is empty. */
  payload?: ChartTooltipContentEntry[]
  /**
   * Hides the header row.
   * @defaultValue false
   */
  hideHeader?: boolean
  /** Formats the header label. */
  labelFormatter?: (label: number | string) => string
  /** Formats each series value. Also receives the row's entry, so the format can depend on its `dataKey`. Values print as given by default. */
  valueFormatter?: (value: number | string, entry: ChartTooltipContentEntry) => string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-part class overrides, also applied to composed parts. */
  ui?: ComponentSlots<ChartTooltip>
}

export type ChartTooltipContentSlots = {
  /** Manual composition with `ChartTooltipHeader` and `ChartTooltipItem`. Replaces the rows built from `payload`. */
  default?: () => VNode[]
  /** Content under the rows built from `payload`, e.g. a total. Not rendered when the default slot is used. */
  footer?: (props: { label?: number | string; payload: ChartTooltipContentEntry[] }) => VNode[]
}
