import type { VNode } from 'vue'

import type {
  ChartIndexKey,
  ChartLegendItem,
  ChartSeriesBase,
  ChartSeriesInput,
  ChartValueKey,
} from '@/components/chart/series-config'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ChartLegendTheme = typeof theme

/** An explicit legend row. `hidden` falls back to the `hidden` list. */
export type ChartLegendEntry = Pick<ChartLegendItem, 'key' | 'name' | 'color'> &
  Partial<ChartLegendItem>

/**
 * Props of `ChartLegend`: colored rows naming a chart's series (or a pie's slices), optionally with
 * values and shares, and optionally toggleable to hide rows.
 */
export type ChartLegendProps<T extends object = Record<string, unknown>> = {
  /** Explicit rows. Wins over `series` and `data`. */
  items?: ChartLegendEntry[]
  /** One row per series, named and colored like the chart that gets the same `series` and `colors`. */
  series?: ChartSeriesInput<T, ChartSeriesBase>
  /** Palette by position, or (with `data` and `index`) colors keyed by slice name. */
  colors?: string[] | Record<string, string>
  /** Pie and radial rows: with `index` (and no `series`), one row per datum with its value and share. */
  data?: T[]
  /** Slice name key of `data`. */
  index?: ChartIndexKey<T>
  /**
   * Slice value key of `data`.
   * @defaultValue the first numeric key except `index`
   */
  valueKey?: ChartValueKey<T>
  /**
   * Row direction. Vertical lists suit pie breakdowns.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<ChartLegendTheme>['orientation']
  /**
   * Shape of the color marker.
   * @defaultValue 'dot'
   */
  indicator?: ComponentVariants<ChartLegendTheme>['indicator']
  /**
   * Shows each row's value (slice rows, or items with `value`).
   * @defaultValue false
   */
  showValue?: boolean
  /**
   * Shows each row's share of the visible total (slice rows, or items with `percent`).
   * @defaultValue false
   */
  showPercent?: boolean
  /** Formats values; receives the row's key. Defaults to `toLocaleString()`. */
  valueFormatter?: (value: number, key: string) => string
  /** Formats shares (0–100). Defaults to a rounded percentage such as `42%`. */
  percentFormatter?: (percent: number) => string
  /**
   * Rows become toggle buttons that add or remove their key from `hidden`.
   * @defaultValue false
   */
  toggleable?: boolean
  /** Keys of hidden rows (`v-model:hidden`). Hidden rows are dimmed. */
  hidden?: string[]
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChartLegendTheme>
}

/** Props passed to `ChartLegend`'s `item` slot. */
export type ChartLegendItemSlotProps = {
  /** The resolved row: its key, name, color and hidden state, plus value and share for slice rows. */
  item: ChartLegendItem
  /** The row's position in the legend. */
  index: number
  /** Toggles the row's key in `hidden`. */
  toggle: () => void
}

/** Slots of `ChartLegend`. */
export type ChartLegendSlots = {
  /** Replaces the content of a row; the row element and its toggle button stay. */
  item?: (props: ChartLegendItemSlotProps) => VNode[]
}
