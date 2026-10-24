import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'

import type { ChartLegendProps } from '../chart-legend'
import type { ChartAxisTickSlotProps } from './axis'
import type { ChartGridProps } from './ChartGrid.vue'
import type { ChartTooltipProps } from './ChartTooltip.vue'
import type { ChartXAxisProps } from './ChartXAxis.vue'
import type { ChartYAxisProps } from './ChartYAxis.vue'
import type { ChartContext } from './context'
import type { ChartFrameConfig, ChartFrameSlots } from './frame'
import { resolveFrameLegend } from './frame'
import type {
  ChartAreaSeries,
  ChartBarSeries,
  ChartIndexKey,
  ChartLegendPosition,
  ChartLineSeries,
  ChartSeriesBase,
  ChartSeriesInput,
} from './series-config'
import {
  barEndRadius,
  chartDefaults,
  isChartGenerated,
  normalizeSeriesInput,
  resolveChartPart,
  resolveSeries,
  seriesLegendItems,
  seriesValueFormatter,
} from './series-config'
import type { ChartLayout, ChartMargin } from './types'

/** Props shared by `AreaChart`, `LineChart`, `BarChart` and `ComposedChart`. */
export interface CartesianRootProps<T extends object, S extends ChartSeriesBase> {
  /** Rows to plot. Each series reads one field of each row. */
  data: T[]
  /** Key of the category of each row (x axis labels, tooltip header). Setting it draws the chart from props. */
  index?: ChartIndexKey<T>
  /**
   * Series to draw: a map of key to config, or an array of keys and `{ key, …config }` objects.
   * Setting it draws the chart from props.
   * @defaultValue every numeric key of `data` except `index`
   */
  series?: ChartSeriesInput<T, S>
  /**
   * Series colors, by position. A series' own `color` wins.
   * @defaultValue ['var(--chart-3)', 'var(--chart-1)', 'var(--chart-4)', 'var(--chart-2)', 'var(--chart-5)']
   */
  colors?: string[]
  /**
   * Grid lines: `false` hides them, an object sets `ChartGrid` props.
   * @defaultValue true (horizontal lines), false with `sparkline`
   */
  grid?: boolean | Partial<ChartGridProps>
  /**
   * X axis: `false` hides it, an object sets `ChartXAxis` props.
   * @defaultValue true, false with `sparkline`
   */
  xAxis?: boolean | Partial<ChartXAxisProps>
  /**
   * Y axis: `false` hides it, an object sets `ChartYAxis` props. Its width fits the widest label.
   * @defaultValue true, false with `sparkline`
   */
  yAxis?: boolean | Partial<ChartYAxisProps>
  /**
   * Right y axis for series with `yAxis: 'right'`. Drawn when such a series exists, or when set.
   * @defaultValue true when a series uses it
   */
  yAxisRight?: boolean | Partial<ChartYAxisProps>
  /**
   * Hover tooltip: `false` turns it off, an object sets `ChartTooltip` props.
   * @defaultValue true, false with `sparkline`
   */
  tooltip?: boolean | Partial<ChartTooltipProps>
  /**
   * Legend outside the plot: `true` (bottom), a side, or `ChartLegend` props with a `position`. Clicking an item
   * hides or shows its series.
   * @defaultValue false
   */
  legend?:
    | boolean
    | ChartLegendPosition
    | (Partial<ChartLegendProps<T>> & { position?: ChartLegendPosition })
  /** Formats values in the tooltip and on the value axis. Receives the series key (`''` on the axis). */
  valueFormatter?: (value: number, key: string) => string
  /** Formats the categories on the category axis and in the tooltip header. */
  indexFormatter?: (value: number | string) => string
  /**
   * A small trend line: no grid, axes or tooltip unless set, thinner strokes, a 2px top margin.
   * @defaultValue false
   */
  sparkline?: boolean
  /** Keys of the hidden series. Use with `v-model:hidden`. */
  hidden?: string[]
  /**
   * Chart height in pixels. With a legend, the height of the plot box.
   * @defaultValue 300
   */
  height?: number
  /**
   * Chart width in pixels or as a percentage of the parent.
   * @defaultValue '100%'
   */
  width?: number | `${number}%`
  /**
   * Space between the plot area and the edges of the chart, in pixels.
   * @defaultValue { top: 8, right: 8, bottom: 0, left: 0 }; { top: 2, right: 0, bottom: 0, left: 0 } with `sparkline`
   */
  margin?: ChartMargin
  /** Additional classes merged into the root element. */
  class?: any
}

/** Slots shared by the cartesian roots. */
export interface CartesianRootSlots extends ChartFrameSlots {
  /** Chart parts (`ChartGrid`, `ChartXAxis`, series, `ChartTooltip`, …) and raw SVG such as `<defs>`. */
  default?: () => any
  /** Replaces each x axis tick label. Render SVG (`<text>`). */
  'x-tick'?: (props: ChartAxisTickSlotProps) => any
  /** Replaces each y axis tick label. Render SVG (`<text>`). */
  'y-tick'?: (props: ChartAxisTickSlotProps) => any
}

/** `withDefaults` values shared by the cartesian roots. */
export const cartesianRootDefaults = {
  height: 300,
  width: '100%' as const,
  // `undefined` defaults keep boolean-or-object props unset: Vue would turn a missing boolean prop into `false`.
  margin: undefined,
  grid: undefined,
  xAxis: undefined,
  yAxis: undefined,
  yAxisRight: undefined,
  tooltip: undefined,
  legend: undefined,
  sparkline: false,
}

const DEFAULT_MARGIN: Required<ChartMargin> = { top: 8, right: 8, bottom: 0, left: 0 }

/** A root's margin: its `margin` prop, else the default (a 2px top margin for sparklines). */
export function rootMargin(
  props: Pick<CartesianRootProps<object, ChartSeriesBase>, 'margin' | 'sparkline'>,
): ChartMargin {
  return props.margin ?? (props.sparkline ? chartDefaults.sparkline.margin : DEFAULT_MARGIN)
}

export type CartesianSeriesKind = 'area' | 'line' | 'bar'

/** One generated series part: the component kind and its props. */
export interface CartesianAutoSeries {
  key: string
  kind: CartesianSeriesKind
  props: Record<string, unknown>
}

/** What a cartesian root draws from its props (rendered by `ChartCartesianFrame`). */
export interface CartesianAutoConfig extends ChartFrameConfig {
  generated: boolean
  layout: Extract<ChartLayout, 'horizontal' | 'vertical'>
  series: CartesianAutoSeries[]
  grid: Partial<ChartGridProps> | null
  xAxis: Partial<ChartXAxisProps> | null
  yAxis: Partial<ChartYAxisProps> | null
  yAxisRight: Partial<ChartYAxisProps> | null
}

type AnySeries = ChartAreaSeries & ChartBarSeries & ChartLineSeries & { type?: CartesianSeriesKind }

export interface CartesianRootOptions<T extends object, S extends ChartSeriesBase> {
  chart: ChartContext
  props: CartesianRootProps<T, S>
  hidden: Ref<string[]>
  /** Kind of a series: fixed per root, or the series' `type` in a ComposedChart. */
  kind: (series: { type?: CartesianSeriesKind }) => CartesianSeriesKind
  /** Series defaults from root props such as `curve`. */
  rootDefaults: () => Partial<S>
  /** Root `stacked`, for areas and bars. */
  stacked?: () => boolean | undefined
  layout?: () => Extract<ChartLayout, 'horizontal' | 'vertical'>
  /** Whether the root has a `legend` slot. */
  hasLegendSlot: () => boolean
}

/** Drops `undefined` values, so they don't override defaults when spread. */
export function definedProps<P extends object>(values: P): Partial<P> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  ) as Partial<P>
}

/** Default config of a series kind, below root props and the series' own config. */
function kindDefaults(kind: CartesianSeriesKind, sparkline: boolean): Partial<AnySeries> {
  const thin =
    sparkline && kind !== 'bar' ? { strokeWidth: chartDefaults.sparkline.strokeWidth } : {}
  // Lines never stack, even in a `stacked` chart.
  const stack = kind === 'line' ? { stack: false } : {}
  return { ...(chartDefaults[kind] as Partial<AnySeries>), ...thin, ...stack }
}

/**
 * Turns a cartesian root's props into what it draws: resolved series, part props and legend. Also publishes the index
 * and series to the chart context, so parts placed by hand default from them.
 */
export function useCartesianRoot<T extends object, S extends ChartSeriesBase>(
  options: CartesianRootOptions<T, S>,
) {
  const { chart, props, hidden } = options

  const generated = computed(() => isChartGenerated(props))
  const layout = computed(() => options.layout?.() ?? 'horizontal')

  const resolved = computed(() => {
    const sparkline = !!props.sparkline
    const rootDefaults = options.rootDefaults() as Partial<AnySeries>
    // Kind defaults go under root props and series config; a ComposedChart picks them per series `type`.
    const series =
      props.series === undefined
        ? undefined
        : normalizeSeriesInput<AnySeries>(props.series as ChartSeriesInput<any, AnySeries>).map(
            ([key, entry]) => ({
              ...kindDefaults(options.kind(entry), sparkline),
              ...rootDefaults,
              ...entry,
              key,
            }),
          )
    return resolveSeries<T, AnySeries>({
      data: props.data,
      index: props.index as string | undefined,
      series: series as ChartSeriesInput<T, AnySeries> | undefined,
      colors: props.colors,
      hidden: hidden.value,
      stacked: options.stacked?.(),
      defaults: series
        ? undefined
        : { ...kindDefaults(options.kind({}), sparkline), ...rootDefaults },
    })
  })

  // Without `index` or `series`, hand-placed parts keep their own defaults (inferred series would recolor them).
  chart.config.value = () =>
    props.index === undefined && props.series === undefined
      ? null
      : { index: props.index as string | undefined, series: resolved.value, hidden: hidden.value }

  const config = computed<CartesianAutoConfig>(() => {
    const vertical = layout.value === 'vertical'
    const enabled = !props.sparkline
    const all = resolved.value
    const kinds = all.map((entry) => options.kind(entry))
    const radius = barEndRadius(
      all.filter((_, position) => kinds[position] === 'bar'),
      layout.value,
    )

    const series = all.map((entry, position): CartesianAutoSeries => {
      const kind = kinds[position]!
      const common = definedProps({
        dataKey: entry.key,
        name: entry.name,
        hide: entry.hidden,
        tooltipType: entry.tooltip === false ? ('none' as const) : undefined,
        yAxisId: entry.yAxis === 'right' && !vertical ? 'right' : undefined,
        class: entry.class,
      })
      if (kind === 'bar') {
        return {
          key: entry.key,
          kind,
          props: {
            ...common,
            ...definedProps({
              fill: entry.color,
              fillOpacity: entry.fillOpacity as number | undefined,
              stackId: entry.stackId,
              barSize: entry.barSize,
              radius: radius[entry.key],
            }),
          },
        }
      }
      const curve = {
        ...common,
        ...definedProps({
          stroke: entry.color,
          type: entry.curve,
          strokeWidth: entry.strokeWidth,
          strokeDasharray: entry.strokeDasharray,
          dot: entry.dot,
          activeDot: entry.activeDot,
          connectNulls: entry.connectNulls,
        }),
      }
      if (kind === 'line') return { key: entry.key, kind, props: curve }
      // `ChartArea` draws the `'gradient'` fill itself. A custom fill (e.g. `url(#id)`) carries its own opacity, so the
      // default `[top, bottom]` pair doesn't dim it; only a number does.
      const custom = entry.fill !== undefined && !['gradient', 'solid', 'none'].includes(entry.fill)
      const fill = entry.fill === 'solid' ? entry.color : entry.fill
      const fillOpacity = custom && typeof entry.fillOpacity !== 'number' ? 1 : entry.fillOpacity
      return {
        key: entry.key,
        kind,
        props: { ...curve, ...definedProps({ fill, fillOpacity, stackId: entry.stackId }) },
      }
    })

    const valueTicks = props.valueFormatter
      ? (value: number | string) => props.valueFormatter!(Number(value), '')
      : undefined
    const categoryAxis = definedProps({
      dataKey: props.index as string | undefined,
      tickFormatter: props.indexFormatter,
    })
    const valueAxis = definedProps({ tickFormatter: valueTicks })
    const xAxis = resolveChartPart<Partial<ChartXAxisProps>>(
      props.xAxis,
      vertical
        ? { ...chartDefaults.xAxis, type: 'number', ...valueAxis }
        : { ...chartDefaults.xAxis, ...categoryAxis },
      enabled,
    )
    const yAxis = resolveChartPart<Partial<ChartYAxisProps>>(
      props.yAxis,
      vertical
        ? { ...chartDefaults.yAxis, type: 'category', width: 'auto', ...categoryAxis }
        : { ...chartDefaults.yAxis, width: 'auto', ...valueAxis },
      enabled,
    )
    const usesRight = series.some((entry) => entry.props.yAxisId === 'right')
    const yAxisRight = vertical
      ? null
      : resolveChartPart<Partial<ChartYAxisProps>>(
          props.yAxisRight,
          { width: 'auto', ...valueAxis, yAxisId: 'right', orientation: 'right' },
          usesRight,
        )

    return {
      generated: generated.value,
      layout: layout.value,
      series,
      grid: resolveChartPart<Partial<ChartGridProps>>(
        props.grid,
        vertical ? chartDefaults.gridVertical : chartDefaults.grid,
        enabled,
      ),
      xAxis,
      yAxis,
      yAxisRight,
      // Composition mode draws only the slot, so a `ChartTooltip` child stays the single tooltip.
      tooltip: generated.value
        ? resolveChartPart<Partial<ChartTooltipProps>>(
            props.tooltip,
            definedProps({
              valueFormatter: seriesValueFormatter(
                all,
                props.valueFormatter,
              ) as ChartTooltipProps['valueFormatter'],
              labelFormatter: props.indexFormatter,
            }),
            enabled,
          )
        : null,
      legend: resolveFrameLegend(props.legend, options.hasLegendSlot()),
      legendItems: seriesLegendItems(all),
    }
  })

  return { config: config as ComputedRef<CartesianAutoConfig>, resolved }
}
