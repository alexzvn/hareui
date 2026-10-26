import type { VNode } from 'vue'

import type { ChartLegendProps } from '@/components/chart-legend/ChartLegend.types'
import type { ChartTooltipContentEntry } from '@/components/chart-tooltip/ChartTooltipContent.types'
import type {
  ChartPolarAngleAxisProps,
  ChartPolarAngleAxisSlots,
} from '@/components/chart/ChartPolarAngleAxis.types'
import type { ChartPolarGridProps } from '@/components/chart/ChartPolarGrid.types'
import type { ChartPolarRadiusAxisProps } from '@/components/chart/ChartPolarRadiusAxis.types'
import type {
  ChartTooltipProps,
  ChartTooltipSlotProps,
} from '@/components/chart/ChartTooltip.types'
import type {
  ChartIndexKey,
  ChartLegendItem,
  ChartLegendPosition,
  ChartRadarSeries,
  ChartSeriesInput,
} from '@/components/chart/series-config'
import type { ChartDatum, ChartDotProps, ChartMargin } from '@/components/chart/types'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type RadarChartTheme = typeof theme

/** Props of the `RadarChart` component: one or more series plotted on radial spokes. */
export type RadarChartProps<T extends object = ChartDatum> = {
  /** Rows to plot. Each row is one spoke; each radar reads one field of every row. */
  data: T[]
  /** Key of the spoke labels. Setting it (or `series`) draws the grid, axis, radars, tooltip and legend from props. */
  index?: ChartIndexKey<T>
  /**
   * Radars to draw: a map from value key to config, or an array of keys and `{ key, ...config }` objects.
   * @defaultValue every numeric key except `index`
   */
  series?: ChartSeriesInput<T, ChartRadarSeries>
  /**
   * Radar colors, used in series order.
   * @defaultValue the chart palette
   */
  colors?: string[]
  /**
   * Fill opacity of every radar. A series' own `fillOpacity` wins.
   * @defaultValue 0.15
   */
  fillOpacity?: number
  /**
   * Outline width of every radar, in px. A series' own `strokeWidth` wins.
   * @defaultValue 2
   */
  strokeWidth?: number
  /**
   * Point markers of every radar: `true`, or circle attributes. A series' own `dot` wins.
   * @defaultValue false
   */
  dot?: boolean | ChartDotProps
  /**
   * Polygon grid: `false` hides it, an object sets `ChartPolarGrid` props.
   * @defaultValue true
   */
  grid?: boolean | Partial<ChartPolarGridProps>
  /**
   * Spoke labels from `index`: `false` hides them, an object sets `ChartPolarAngleAxis` props.
   * @defaultValue true
   */
  angleAxis?: boolean | Partial<ChartPolarAngleAxisProps>
  /**
   * Value labels along one spoke: `true` shows them, an object sets `ChartPolarRadiusAxis` props.
   * @defaultValue false
   */
  radiusAxis?: boolean | Partial<ChartPolarRadiusAxisProps>
  /**
   * Tooltip on hover and focus: `false` turns it off, an object sets `ChartTooltip` props.
   * @defaultValue true
   */
  tooltip?: boolean | Partial<ChartTooltipProps>
  /** Legend of the radars: `true` (below), a side, or `ChartLegend` props with a `position`. Clicking a row hides its radar. */
  legend?:
    | boolean
    | ChartLegendPosition
    | (Partial<ChartLegendProps<T>> & { position?: ChartLegendPosition })
  /** Formats values in the tooltip. A series' own `valueFormatter` wins. */
  valueFormatter?: (value: number, key: string) => string
  /** Formats the spoke labels and the tooltip header. */
  indexFormatter?: (value: number | string) => string
  /** Keys of hidden radars (`v-model:hidden`). */
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
   * Space between the chart and its edges, in pixels.
   * @defaultValue { top: 5, right: 5, bottom: 5, left: 5 }
   */
  margin?: ChartMargin
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
   * Radius of the center hole, in px or as a percentage of half the shorter chart side.
   * @defaultValue 0
   */
  innerRadius?: number | string
  /**
   * Radius of the outer ring, in px or as a percentage of half the shorter chart side.
   * @defaultValue '80%'
   */
  outerRadius?: number | string
  /**
   * Angle of the first spoke, in degrees. 0 is at 3 o'clock; 90 points up.
   * @defaultValue 90
   */
  startAngle?: number
  /**
   * Angle the spokes run to, in degrees. The default goes clockwise once around.
   * @defaultValue -270
   */
  endAngle?: number
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<RadarChartTheme>
}

/** Slots of the `RadarChart` component. */
export type RadarChartSlots = {
  /** Chart parts: `ChartPolarGrid`, `ChartPolarAngleAxis`, `ChartPolarRadiusAxis`, `ChartRadar`, `ChartTooltip`. With `index` or `series`, extra parts drawn over the generated ones. */
  default?: () => VNode[]
  /** Replaces each spoke label. Render SVG (`<text>`, `<g>`). */
  'angle-tick'?: ChartPolarAngleAxisSlots['tick']
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
