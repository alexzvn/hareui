import type { VNode } from 'vue'

import type { ChartLegendProps } from '@/components/chart-legend/ChartLegend.types'
import type { ChartTooltipContentEntry } from '@/components/chart-tooltip/ChartTooltipContent.types'
import type {
  ChartTooltipProps,
  ChartTooltipSlotProps,
} from '@/components/chart/ChartTooltip.types'
import type { ChartPolarCenterSlotProps } from '@/components/chart/polar-context'
import type {
  ChartIndexKey,
  ChartLegendItem,
  ChartLegendPosition,
  ChartValueKey,
  ChartValueOptions,
} from '@/components/chart/series-config'
import type { ChartDatum, ChartMargin } from '@/components/chart/types'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type PieChartTheme = typeof theme

/** Props of `PieChart`: a pie or donut chart, drawn from props (`data` + `index`) or composed from `ChartPie` and other chart parts. */
export type PieChartProps<T extends object = ChartDatum> = {
  /** Rows of the chart. With `index`, each row is one slice; otherwise they are shared by every `ChartPie` without its own `data`. */
  data?: T[]
  /** Key of the slice name. Setting it draws the pie, tooltip and legend from props (no child parts needed). */
  index?: ChartIndexKey<T>
  /**
   * Key of the slice value, and how values are formatted in the tooltip and the legend.
   * @defaultValue { key: the first numeric key }
   */
  value?: ChartValueOptions<ChartValueKey<T>>
  /**
   * Slice colors: an array used in row order, or a map keyed by slice name. A row's own `fill` wins.
   * @defaultValue the chart palette
   */
  colors?: string[] | Record<string, string>
  /**
   * Draws a donut: `innerRadius: '68%'`, `cornerRadius: 12`, `paddingAngle: -20`. The props below override it.
   * @defaultValue false
   */
  donut?: boolean
  /** Radius of the center hole, in px or as a percentage of half the shorter chart side. */
  innerRadius?: number | string
  /** Radius of the pie, in px or as a percentage of half the shorter chart side. */
  outerRadius?: number | string
  /** Corner radius of each slice, in px. */
  cornerRadius?: number
  /** Gap between slices, in degrees. Negative values overlap rounded slices. */
  paddingAngle?: number
  /** Angle of the first slice edge, in degrees. 0 is at 3 o'clock; 90 points up. */
  startAngle?: number
  /** Angle the slices run to, in degrees. */
  endAngle?: number
  /**
   * Tooltip on hover and focus: `false` turns it off, an object sets `ChartTooltip` props.
   * @defaultValue true
   */
  tooltip?: boolean | Partial<ChartTooltipProps>
  /** Legend of the slices: `true` (below), a side, or `ChartLegend` props with a `position`. Clicking a row hides its slice. */
  legend?:
    | boolean
    | ChartLegendPosition
    | (Partial<ChartLegendProps<T>> & { position?: ChartLegendPosition })
  /** Names of hidden slices (`v-model:hidden`). */
  hidden?: string[]
  /**
   * Chart height in pixels.
   * @defaultValue 300
   */
  height?: number
  /**
   * Chart width in pixels or as a percentage of the parent.
   * @defaultValue '100%'
   */
  width?: number | `${number}%`
  /**
   * Space between the pies and the edges of the chart, in pixels.
   * @defaultValue { top: 5, right: 5, bottom: 5, left: 5 }
   */
  margin?: ChartMargin
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<PieChartTheme>
}

/** Slots of `PieChart`. */
export type PieChartSlots = {
  /** Chart parts: `ChartPie`, `ChartTooltip`, a centered `ChartLabel`, and raw SVG such as `<defs>`. With `index`, extra parts drawn over the generated pie. */
  default?: () => VNode[]
  /** HTML centered in the pie, e.g. a total inside a donut. */
  center?: (props: ChartPolarCenterSlotProps) => VNode[]
  /** Replaces the tooltip panel. */
  tooltip?: (props: ChartTooltipSlotProps) => VNode[]
  /** Content under the tooltip rows. */
  'tooltip-footer'?: (props: {
    label?: number | string
    payload: ChartTooltipContentEntry[]
  }) => VNode[]
  /** Replaces the legend. */
  legend?: (props: { items: ChartLegendItem[]; toggle: (key: string) => void }) => VNode[]
  /** Replaces each legend row. */
  'legend-item'?: (props: { item: ChartLegendItem; index: number; toggle: () => void }) => VNode[]
}
