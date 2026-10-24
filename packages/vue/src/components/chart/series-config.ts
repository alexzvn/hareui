import type { ClassValue } from '@/utils/tv'

import type { ChartRadius } from './shapes'
import type { ChartCurveType, ChartDotProps, ChartLayout, ChartMargin } from './types'

// Series config shared by the generated mode of every chart root (`index` / `series` / `sparkline` props)
// and by `ChartLegend`: one normalizer, so the chart and its legend always agree on names and colors.

/** Default series colors, assigned by position in the series list (or by slice position in pie and radial charts). */
export const CHART_PALETTE: readonly string[] = [
  'var(--chart-3)',
  'var(--chart-1)',
  'var(--chart-4)',
  'var(--chart-2)',
  'var(--chart-5)',
]

/** Stack id used by `stacked` on the root and by `stack: true` on a series. */
export const CHART_STACK_ID = 'stack'

type StringKey<T> = Extract<keyof T, string>

/**
 * `true` when the row type names no keys: index-signature rows (`ChartDatum`), or the bare `object` constraint a generic
 * component falls back to when nothing infers `T` (a `ChartLegend` with `series` but no `data`).
 */
type OpenKeys<T> = string extends keyof T ? true : [StringKey<T>] extends [never] ? true : false

/** Keys of `T` whose values are numbers: valid series keys. Any string when `T` names no keys. */
export type ChartValueKey<T> =
  OpenKeys<T> extends true
    ? string
    : { [K in StringKey<T>]-?: NonNullable<T[K]> extends number ? K : never }[StringKey<T>]

/** Keys of `T` usable as the category axis or the slice name. Any string when `T` names no keys. */
export type ChartIndexKey<T> =
  OpenKeys<T> extends true
    ? string
    : {
        [K in StringKey<T>]-?: NonNullable<T[K]> extends string | number | Date ? K : never
      }[StringKey<T>]

/** Config every series accepts in a root's `series` prop, whatever the chart kind. */
export type ChartSeriesBase = {
  /**
   * Legend and tooltip label.
   * @defaultValue the key
   */
  name?: string
  /**
   * Stroke and fill.
   * @defaultValue the `colors` entry at the series position
   */
  color?: string
  /**
   * Hides the series. Hidden series keep their color.
   * @defaultValue false
   */
  hide?: boolean
  /**
   * `false` leaves the series out of the tooltip.
   * @defaultValue true
   */
  tooltip?: boolean
  /** Formats this series' values in the tooltip. Overrides the root `valueFormatter`. */
  valueFormatter?: (value: number) => string
  /** Additional classes for the series group. */
  class?: ClassValue
}

/** Stacking config of series that can stack (areas and bars). */
export type ChartStackableSeries = {
  /** Series with the same string share a stack; `true` joins the chart's shared stack, `false` opts out of `stacked`. */
  stack?: string | boolean
}

/** Axis config of series drawn against a cartesian value axis. */
export type ChartAxisSeries = {
  /**
   * Value axis the series is drawn against. `'right'` adds a right y axis.
   * @defaultValue 'left'
   */
  yAxis?: 'left' | 'right'
}

/** A `LineChart` (or `ComposedChart` line) series: `ChartLine` props settable per series. */
export type ChartLineSeries = {
  curve?: ChartCurveType
  strokeWidth?: number
  strokeDasharray?: string
  dot?: boolean | ChartDotProps
  activeDot?: boolean | ChartDotProps
  connectNulls?: boolean
} & ChartSeriesBase &
  ChartAxisSeries

/** `'gradient'` fades the series color from `fillOpacity[0]` at the top to `fillOpacity[1]` at the bottom. */
export type ChartAreaFill = 'gradient' | 'solid' | 'none' | (string & {})

/** An `AreaChart` (or `ComposedChart` area) series: line config plus its fill. */
export type ChartAreaSeries = {
  fill?: ChartAreaFill
  /** One opacity, or `[top, bottom]` stop opacities for the gradient fill. */
  fillOpacity?: number | [top: number, bottom: number]
} & ChartLineSeries &
  ChartStackableSeries

/** A `BarChart` (or `ComposedChart` bar) series. */
export type ChartBarSeries = {
  /** Corner radius of the bar's outer end. Only the last bar of a stack is rounded. */
  radius?: ChartRadius
  barSize?: number | string
  fillOpacity?: number
} & ChartSeriesBase &
  ChartAxisSeries &
  ChartStackableSeries

/** A `ComposedChart` series: `type` picks whether it draws as an area, bars or a line. */
export type ChartComposedSeries =
  | (ChartAreaSeries & { type: 'area' })
  | (ChartBarSeries & { type: 'bar' })
  | (ChartLineSeries & { type: 'line' })

/** A `RadarChart` series: `ChartRadar` props settable per series. */
export type ChartRadarSeries = {
  fillOpacity?: number
  strokeWidth?: number
  strokeDasharray?: string
  dot?: boolean | ChartDotProps
  activeDot?: boolean | ChartDotProps
} & ChartSeriesBase

/** Keyed map, ordered by key order, as a const and reused by `ChartLegend`. */
export type ChartSeriesMap<T, S = ChartSeriesBase> = { [K in ChartValueKey<T>]?: S }

/**
 * Series of a chart: a keyed map, or an array of keys and `{ key, …config }` objects.
 * Use the array when keys look like integers (`'2023'`): JavaScript orders those keys numerically in objects.
 */
export type ChartSeriesInput<T, S = ChartSeriesBase> =
  | ChartSeriesMap<T, S>
  | ReadonlyArray<ChartValueKey<T> | (S & { key: ChartValueKey<T> })>

/** A series after normalization: config merged over the chart defaults, with a final name, color and stack. */
export type ChartResolvedSeries<S = ChartSeriesBase> = Omit<
  S,
  'name' | 'color' | 'hide' | 'stack'
> & {
  key: string
  name: string
  color: string
  /** `hide` on the series, or its key in the chart's `hidden` list. */
  hidden: boolean
  /** Position in the series list; the default color comes from it. */
  position: number
  /** Set for stacked series only. */
  stackId?: string
}

/** Root props that turn on the generated parts. */
export type ChartModeProps = {
  /** Category key of the rows; setting it turns on the generated parts. */
  index?: unknown
  /** Series config; setting it turns on the generated parts. */
  series?: unknown
  /** Draws a bare chart without axes, grid or tooltip; turns on the generated parts. */
  sparkline?: boolean
}

/** Generated mode: the root renders its parts from props. Otherwise the root renders only its default slot. */
export const isChartGenerated = (props: ChartModeProps): boolean => {
  return props.index !== undefined || props.series !== undefined || props.sparkline === true
}

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Numeric keys of the rows, in order of first appearance, without `index`. A key whose non-null values aren't all
 * numbers is skipped, so name, color and date fields never become series.
 */
export const inferValueKeys = (data: readonly object[], index?: string): string[] => {
  const numeric = new Map<string, boolean>()
  for (const row of data) {
    for (const [key, value] of Object.entries(row)) {
      if (key === index || value === null || value === undefined) continue
      numeric.set(key, (numeric.get(key) ?? true) && isFiniteNumber(value))
    }
  }

  return [...numeric].filter(([, isNumeric]) => isNumeric).map(([key]) => key)
}

/** Map and array forms to `[key, config]` pairs, in series order. */
export const normalizeSeriesInput = <S extends object>(
  series: ChartSeriesInput<object, S>,
): Array<[key: string, config: Partial<S>]> => {
  if (Array.isArray(series)) {
    return series.map((entry: string | (S & { key: string })) => {
      if (typeof entry === 'string') return [entry, {}]
      const { key, ...config } = entry

      return [key, config as unknown as Partial<S>]
    })
  }

  return Object.entries(series as Record<string, S | undefined>)
    .filter((entry): entry is [string, S] => entry[1] !== undefined)
    .map(([key, config]) => [key, config])
}

/** The color at a position: `colors` cycles, then the palette. */
export const chartColorAt = (
  position: number,
  colors: readonly string[] = CHART_PALETTE,
): string => {
  const palette = colors.length > 0 ? colors : CHART_PALETTE
  return palette[position % palette.length]!
}

/** Options of `resolveSeries`. */
export type ResolveSeriesOptions<T, S> = {
  /** The chart rows. */
  data: readonly T[]
  /** Category key, left out of the inferred series. */
  index?: string
  /** @defaultValue every numeric key of `data` except `index` */
  series?: ChartSeriesInput<T, S>
  /** @defaultValue CHART_PALETTE */
  colors?: readonly string[]
  /** Keys of hidden series (the root's `v-model:hidden`). */
  hidden?: readonly string[]
  /** Chart-level defaults (from `chartDefaults` and root props), overridden by each series' config. */
  defaults?: Partial<S>
  /** Root `stacked`: stackable series without their own `stack` join the shared stack. */
  stacked?: boolean
}

/** `true` joins the chart's shared stack; a string names its own stack. */
const resolveStackId = (setting: string | boolean | undefined): string | undefined => {
  if (setting === true) return CHART_STACK_ID

  return typeof setting === 'string' ? setting : undefined
}

/**
 * A root's series in order, with final names, colors, hidden state and stack ids. Without `series`, every numeric key
 * of `data` (except `index`) becomes a series.
 */
export const resolveSeries = <T extends object, S extends ChartSeriesBase = ChartSeriesBase>(
  options: ResolveSeriesOptions<T, S>,
): ChartResolvedSeries<S>[] => {
  const entries: Array<[string, Partial<S>]> =
    options.series === undefined
      ? inferValueKeys(options.data, options.index).map((key) => [key, {}])
      : normalizeSeriesInput(options.series)

  const hidden = new Set(options.hidden ?? [])

  return entries.map(([key, config], position) => {
    const merged = { ...options.defaults, ...config } as S & ChartStackableSeries
    const { name, color, hide, stack, ...rest } = merged
    const stackId = resolveStackId(stack ?? (options.stacked ? true : undefined))

    return {
      ...rest,
      key,
      name: name ?? key,
      color: color ?? chartColorAt(position, options.colors),
      hidden: hide === true || hidden.has(key),
      position,
      ...(stackId === undefined ? {} : { stackId }),
    } as ChartResolvedSeries<S>
  })
}

/** Adds or removes a key from a `hidden` list, without mutating it. */
export const toggleHiddenKey = (hidden: readonly string[], key: string): string[] => {
  return hidden.includes(key) ? hidden.filter((item) => item !== key) : [...hidden, key]
}

// Bars of a `vertical` layout grow rightwards, so their right corners round; upright bars round their top ones.
const endRadius = (
  radius: ChartRadius,
  layout: Extract<ChartLayout, 'horizontal' | 'vertical'>,
): ChartRadius => {
  if (typeof radius !== 'number') return radius

  return layout === 'vertical' ? [0, radius, radius, 0] : [radius, radius, 0, 0]
}

/**
 * Radius per series: each visible bar's outer end is rounded (top for vertical bars, right for horizontal ones);
 * in a stack only the last visible series is. Numbers expand to `[tl, tr, br, bl]`; arrays pass through.
 */
export const barEndRadius = (
  series: ReadonlyArray<
    Pick<ChartResolvedSeries<ChartBarSeries>, 'key' | 'hidden' | 'stackId' | 'radius'>
  >,
  layout: Extract<ChartLayout, 'horizontal' | 'vertical'> = 'horizontal',
): Record<string, ChartRadius> => {
  const lastInStack = new Map<string, string>()
  for (const item of series) {
    if (!item.hidden && item.stackId !== undefined) lastInStack.set(item.stackId, item.key)
  }

  const result: Record<string, ChartRadius> = {}
  for (const item of series) {
    const radius = item.radius ?? 0
    const isEnd = item.stackId === undefined || lastInStack.get(item.stackId) === item.key
    result[item.key] = !isEnd || radius === 0 ? 0 : endRadius(radius, layout)
  }

  return result
}

/** Id of a series' gradient: unique per chart (pass `useId()`), valid inside `url(#…)`. */
export const chartGradientId = (chartId: string, key: string): string => {
  return `${chartId}-fill-${key}`.replace(/[^\w-]/g, '_')
}

/** `ChartArea` fill props resolved from an area series by `resolveAreaFill`. */
export type ChartAreaFillResult = {
  /** `fill` for `ChartArea`: a color, `url(#id)` or `'none'`. */
  fill: string
  fillOpacity: number
  /** Set for `fill: 'gradient'`: the root renders `<linearGradient :id x1="0" y1="0" x2="0" y2="1">` with two stops. */
  gradient?: { id: string; color: string; from: number; to: number }
}

/**
 * Turns an area series' `fill` and `fillOpacity` into `ChartArea` props.
 * Gradient: a number `n` means `[n, 0]`. Solid or custom fill: a tuple uses its top opacity.
 */
export const resolveAreaFill = (
  series: Pick<ChartResolvedSeries<ChartAreaSeries>, 'key' | 'color' | 'fill' | 'fillOpacity'>,
  chartId: string,
): ChartAreaFillResult => {
  const fill = series.fill ?? chartDefaults.area.fill
  const opacity = series.fillOpacity ?? chartDefaults.area.fillOpacity
  if (fill === 'none') return { fill: 'none', fillOpacity: 0 }

  if (fill === 'gradient') {
    const [from, to] = typeof opacity === 'number' ? [opacity, 0] : opacity
    const id = chartGradientId(chartId, series.key)

    return { fill: `url(#${id})`, fillOpacity: 1, gradient: { id, color: series.color, from, to } }
  }

  return {
    fill: fill === 'solid' ? series.color : fill,
    fillOpacity: typeof opacity === 'number' ? opacity : opacity[0],
  }
}

/**
 * Tooltip value formatter for a generated chart: the series' own `valueFormatter`, else the root one (which also gets
 * the key). `undefined` when neither exists, so the tooltip keeps its default.
 */
export const seriesValueFormatter = (
  series: ReadonlyArray<Pick<ChartResolvedSeries, 'key' | 'valueFormatter'>>,
  rootFormatter?: (value: number, key: string) => string,
): ((value: number | string, entry?: { dataKey?: string }) => string) | undefined => {
  if (!rootFormatter && !series.some((item) => item.valueFormatter)) return undefined
  const byKey = new Map(series.map((item) => [item.key, item.valueFormatter]))

  return (value, entry) => {
    if (typeof value !== 'number') return String(value)
    const key = entry?.dataKey ?? ''
    const own = byKey.get(key)
    if (own) return own(value)

    return rootFormatter ? rootFormatter(value, key) : String(value)
  }
}

type ChartPartOptions<P> = {
  /** Part props used for `true` and `undefined`, and under an object value. */
  defaults: P
  /** Whether an `undefined` value draws the part (false in sparklines). @defaultValue true */
  isEnabled?: boolean
}

/**
 * A root's `grid` / `xAxis` / `yAxis` / `tooltip` prop to the part's props, or `null` when the part is off.
 * `undefined` follows `isEnabled`; `true` means the defaults; an object is merged over them.
 */
export const resolveChartPart = <P extends object>(
  value: boolean | Partial<P> | undefined,
  { defaults, isEnabled = true }: ChartPartOptions<P>,
): P | null => {
  if (value === false || (value === undefined && !isEnabled)) return null
  if (value === true || value === undefined) return { ...defaults }

  return { ...defaults, ...value }
}

/** Side of the plot an in-chart legend sits on. */
export type ChartLegendPosition = 'top' | 'bottom' | 'left' | 'right'

/** A root's `legend` prop to its position and `ChartLegend` props, or `null` when there is no in-chart legend. */
export const resolveChartLegend = <P extends object>(
  value:
    | boolean
    | ChartLegendPosition
    | (Partial<P> & { position?: ChartLegendPosition })
    | undefined,
  defaultPosition: ChartLegendPosition = 'bottom',
): { position: ChartLegendPosition; props: Partial<P> } | null => {
  if (value === undefined || value === false) return null
  if (value === true) return { position: defaultPosition, props: {} }
  if (typeof value === 'string') return { position: value, props: {} }
  const { position, ...props } = value

  return { position: position ?? defaultPosition, props: props as Partial<P> }
}

/** One legend row: a series, or a pie/radial slice. */
export type ChartLegendItem = {
  key: string
  name: string
  color: string
  hidden: boolean
  /** Slice value (pie and radial). */
  value?: number
  /** Share of the visible total, 0–100 (pie and radial). `undefined` for hidden slices. */
  percent?: number
}

/** A pie or radial row as a slice: its legend row plus the value, position and source row. */
export type ChartSlice<T = object> = {
  value: number
  position: number
  row: T
} & ChartLegendItem

/** Options of `resolveSlices`. */
export type ResolveSlicesOptions<T> = {
  /** The chart rows, one slice each. */
  data: readonly T[]
  /** Slice name key. */
  index: string
  /** @defaultValue the first numeric key except `index` */
  valueKey?: string
  /** Array by position, or a map keyed by slice name. A row's own string `fill` wins over both. */
  colors?: readonly string[] | Readonly<Record<string, string>>
  /** Names of hidden slices. */
  hidden?: readonly string[]
}

// Share of the visible total, 0–100; hidden slices have none.
const slicePercent = (slice: { hidden: boolean; value: number }, total: number) => {
  if (slice.hidden) return undefined
  if (total === 0) return 0

  return (slice.value / total) * 100
}

/** Rows of a pie or radial chart as slices with name, color, value and share. */
export const resolveSlices = <T extends object>(
  options: ResolveSlicesOptions<T>,
): ChartSlice<T>[] => {
  const valueKey = options.valueKey ?? inferValueKeys(options.data, options.index)[0]
  const hidden = new Set(options.hidden ?? [])
  const colors = options.colors
  const slices = options.data.map((row, position) => {
    const record = row as Record<string, unknown>
    const name = String(record[options.index] ?? position)
    const raw = valueKey === undefined ? undefined : record[valueKey]
    const ownFill = typeof record.fill === 'string' ? record.fill : undefined

    const mapped =
      colors && !Array.isArray(colors) ? (colors as Record<string, string>)[name] : undefined

    const color =
      ownFill ?? mapped ?? chartColorAt(position, Array.isArray(colors) ? colors : undefined)

    return {
      key: name,
      name,
      color,
      hidden: hidden.has(name),
      value: isFiniteNumber(raw) ? raw : 0,
      position,
      row,
    }
  })

  const total = slices.reduce((sum, slice) => (slice.hidden ? sum : sum + slice.value), 0)

  return slices.map((slice) => ({ ...slice, percent: slicePercent(slice, total) }))
}

/** Legend rows of resolved series. */
export const seriesLegendItems = (
  series: ReadonlyArray<Pick<ChartResolvedSeries, 'key' | 'name' | 'color' | 'hidden'>>,
): ChartLegendItem[] => {
  return series.map(({ key, name, color, hidden }) => ({ key, name, color, hidden }))
}

type Defaults<S, K extends keyof S> = Readonly<Required<Pick<S, K>>>

/** Defaults of the generated parts and series, per chart kind. Root props override them; series config overrides both. */
export const chartDefaults: {
  area: Defaults<
    ChartAreaSeries,
    'curve' | 'strokeWidth' | 'fill' | 'fillOpacity' | 'dot' | 'activeDot' | 'connectNulls'
  >
  line: Defaults<ChartLineSeries, 'curve' | 'strokeWidth' | 'dot' | 'activeDot' | 'connectNulls'>
  bar: Defaults<ChartBarSeries, 'radius'>
  radar: Defaults<ChartRadarSeries, 'fillOpacity' | 'strokeWidth' | 'dot'>
  /** `PieChart donut`. */
  donut: Readonly<{ innerRadius: string; cornerRadius: number; paddingAngle: number }>
  /** `RadialChart gauge`. */
  gauge: Readonly<{ startAngle: number; endAngle: number }>
  radial: Readonly<{ cornerRadius: number; background: boolean }>
  /** Cartesian `grid`; `BarChart layout="vertical"` uses `gridVertical`. */
  grid: Readonly<{ vertical: boolean }>
  gridVertical: Readonly<{ horizontal: boolean }>
  xAxis: Readonly<{ tickMargin: number }>
  yAxis: Readonly<Record<never, never>>
  /** `sparkline`: parts off unless passed explicitly, thinner strokes, a 2px top margin for the stroke. */
  sparkline: Readonly<{ margin: Required<ChartMargin>; strokeWidth: number }>
} = {
  area: {
    curve: 'monotone',
    strokeWidth: 2,
    fill: 'gradient',
    fillOpacity: [0.2, 0.02],
    dot: false,
    activeDot: true,
    connectNulls: false,
  },
  line: { curve: 'monotone', strokeWidth: 2, dot: false, activeDot: true, connectNulls: false },
  bar: { radius: 4 },
  radar: { fillOpacity: 0.15, strokeWidth: 2, dot: false },
  donut: { innerRadius: '68%', cornerRadius: 12, paddingAngle: -20 },
  gauge: { startAngle: 225, endAngle: -45 },
  radial: { cornerRadius: 12, background: true },
  grid: { vertical: false },
  gridVertical: { horizontal: false },
  xAxis: { tickMargin: 8 },
  yAxis: {},
  sparkline: { margin: { top: 2, right: 0, bottom: 0, left: 0 }, strokeWidth: 1.5 },
}
