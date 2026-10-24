import type { ClassValue } from 'tailwind-variants'

export interface ChartTooltipPayloadEntry {
  dataKey: string
  name: string
  value: number | string
  color: string
  payload: Record<string, unknown>
  /** Stroke color of the series (area, line, radar). */
  stroke?: string
  /** Fill of the series or of the hovered cell (bar, pie). */
  fill?: string
}

export interface ChartMargin {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export type ChartDatum = Record<string, number | string>

/** `horizontal`/`vertical`: cartesian charts (category axis on x / on y). `centric`/`radial`: polar charts. */
export type ChartLayout = 'horizontal' | 'vertical' | 'centric' | 'radial'

/** SVG z-layers of a chart, bottom to top. */
export const chartLayerNames = [
  'grid',
  'bar-background',
  'area',
  'cursor-band',
  'bar',
  'line',
  'series',
  'axis',
  'cursor-line',
  'active-dot',
  'label',
] as const
export type ChartLayerName = (typeof chartLayerNames)[number]

/** Curve interpolation of areas and lines. `monotone` follows the layout (x in horizontal charts, y in vertical ones). */
export type ChartCurveType =
  | 'basis'
  | 'basisClosed'
  | 'basisOpen'
  | 'bump'
  | 'bumpX'
  | 'bumpY'
  | 'linear'
  | 'linearClosed'
  | 'natural'
  | 'monotone'
  | 'monotoneX'
  | 'monotoneY'
  | 'step'
  | 'stepBefore'
  | 'stepAfter'

/**
 * One end of an axis domain: a number, `'auto'` (nice rounded bound), `'dataMin'`/`'dataMax'`,
 * `'dataMin - 10'`/`'dataMax + 10'`, or a function of the data bound.
 */
export type ChartAxisDomainItem = number | string | ((value: number) => number)
export type ChartAxisDomain =
  | [ChartAxisDomainItem, ChartAxisDomainItem]
  | ((range: [number, number]) => [number, number])

export type ChartAxisInterval =
  | number
  | 'preserveStart'
  | 'preserveEnd'
  | 'preserveStartEnd'
  | 'equidistantPreserveStart'

export interface ChartPoint {
  x: number
  y: number
}

/** Size and position of the plot area (inside margins and axes), in SVG pixels. */
export interface ChartOffset {
  left: number
  top: number
  width: number
  height: number
  right: number
  bottom: number
}

/** Props of a point marker: `dot` on every point, or `activeDot` on the hovered one. */
export interface ChartDotProps {
  /**
   * Radius, in px.
   * @defaultValue 3 for `dot`, 4 for `activeDot`
   */
  r?: number
  /** Fill color. Defaults to `var(--surface)` for `dot` and the series color for `activeDot`. */
  fill?: string
  /** Outline color. Defaults to the series color for `dot` and `var(--surface)` for `activeDot`. */
  stroke?: string
  /** Outline width, in px. */
  strokeWidth?: number
  /** Additional classes for the `<circle>`. */
  class?: ClassValue
}

/** A series registered with the chart root, in template order. */
export interface ChartSeries {
  id: string
  kind: 'area' | 'line' | 'bar' | 'pie' | 'radar' | 'radialBar' | (string & {})
  dataKey: string
  name?: string
  /** Tooltip indicator color. */
  color: string
  stroke?: string
  fill?: string
  hide?: boolean
  /** `false` leaves the series out of the tooltip. */
  tooltip?: boolean
  stackId?: string | number
  xAxisId?: string | number
  yAxisId?: string | number
  barSize?: number | string
  maxBarSize?: number
  /** Replaces the default payload (one entry from `dataKey`) at an index, e.g. one entry per pie sector. */
  entries?: (index: number) => ChartTooltipPayloadEntry[]
}

export interface ChartActiveState {
  /** Hovered or focused datum. */
  index: number | null
  /** Set by item-triggered charts (pie, radial): only this series is shown in the tooltip. */
  seriesId: string | null
  /** Tooltip anchor in SVG pixels. */
  coordinate: ChartPoint | null
  source: 'pointer' | 'keyboard' | null
}

/** How pointer and keyboard positions map to data indexes; set by `useCartesianChart` or a polar composable. */
export interface ChartInteraction {
  trigger: 'axis' | 'item'
  /** The datum under an SVG point, or `null` outside the plot. Item triggers also name the series it belongs to. */
  hitTest?: (
    x: number,
    y: number,
  ) => { index: number; seriesId?: string; coordinate: ChartPoint } | null
  /** Tooltip anchor of a datum, for keyboard navigation. */
  coordinateOf: (index: number) => ChartPoint | null
  /** Number of navigable data points. */
  count: () => number
  /**
   * Item trigger: every navigable item in keyboard order. When set, arrow keys walk this list and pass `seriesId`
   * to `setActive`.
   */
  items?: () => Array<{ seriesId: string; index: number; coordinate: ChartPoint | null }>
}
