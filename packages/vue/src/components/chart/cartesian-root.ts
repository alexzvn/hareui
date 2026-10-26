import { defu } from 'defu'
import type { ComputedRef, Ref, VNode } from 'vue'
import { computed } from 'vue'

import type { ChartLegendProps } from '@/components/chart-legend'
import type { ClassValue } from '@/utils/tv'

import type { ChartAxisTickSlotProps } from './axis'
import type { ChartGridProps } from './ChartGrid.types'
import type { ChartTooltipProps } from './ChartTooltip.types'
import type { ChartXAxisProps } from './ChartXAxis.types'
import type { ChartYAxisProps } from './ChartYAxis.types'
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

/** Y axes of a cartesian root, the `yAxis` prop. `false` hides an axis, an object sets `ChartYAxis` props. */
export type ChartYAxesOptions = {
  /**
   * Left axis: values, or the categories with `BarChart layout="vertical"`.
   * @defaultValue true, false with `sparkline`
   */
  left?: boolean | Partial<ChartYAxisProps>
  /**
   * Right axis for series with `yAxis: 'right'`. Drawn when such a series exists, or when set. Not drawn with
   * `BarChart layout="vertical"`.
   * @defaultValue true when a series uses it
   */
  right?: boolean | Partial<ChartYAxisProps>
}

/** Props shared by `AreaChart`, `LineChart`, `BarChart` and `ComposedChart`. */
export type CartesianRootProps<T extends object, S extends ChartSeriesBase> = {
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
   * Y axes: `left`, and `right` for series with `yAxis: 'right'`. `false` hides an axis, an object sets `ChartYAxis`
   * props. Their width fits the widest label.
   * @defaultValue { left: true, right: true when a series uses it }; no left axis with `sparkline`
   */
  yAxis?: ChartYAxesOptions
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
  class?: ClassValue
}

/** Slots shared by the cartesian roots. */
export type CartesianRootSlots = {
  /** Chart parts (`ChartGrid`, `ChartXAxis`, series, `ChartTooltip`, …) and raw SVG such as `<defs>`. */
  default?: () => VNode[]
  /** Replaces each x axis tick label. Render SVG (`<text>`). */
  'x-tick'?: (props: ChartAxisTickSlotProps) => VNode[]
  /** Replaces each y axis tick label. Render SVG (`<text>`). */
  'y-tick'?: (props: ChartAxisTickSlotProps) => VNode[]
} & ChartFrameSlots

/** `withDefaults` values shared by the cartesian roots. */
export const cartesianRootDefaults = {
  height: 300,
  width: '100%' as const,
  // `undefined` defaults keep boolean-or-object props unset: Vue would turn a missing boolean prop into `false`.
  margin: undefined,
  grid: undefined,
  xAxis: undefined,
  tooltip: undefined,
  legend: undefined,
  sparkline: false,
}

const DEFAULT_MARGIN: Required<ChartMargin> = { top: 8, right: 8, bottom: 0, left: 0 }

/** A root's margin: its `margin` prop, else the default (a 2px top margin for sparklines). */
export const rootMargin = (
  props: Pick<CartesianRootProps<object, ChartSeriesBase>, 'margin' | 'sparkline'>,
): ChartMargin => {
  return props.margin ?? (props.sparkline ? chartDefaults.sparkline.margin : DEFAULT_MARGIN)
}

type CartesianSeriesKind = 'area' | 'line' | 'bar'

/** One generated series part: the component kind and its props. */
export type CartesianAutoSeries = {
  key: string
  kind: CartesianSeriesKind
  props: Record<string, unknown>
}

/** What a cartesian root draws from its props (rendered by `ChartCartesianFrame`). */
export type CartesianAutoConfig = {
  generated: boolean
  layout: Extract<ChartLayout, 'horizontal' | 'vertical'>
  series: CartesianAutoSeries[]
  grid: Partial<ChartGridProps> | null
  xAxis: Partial<ChartXAxisProps> | null
  yAxis: { left: Partial<ChartYAxisProps> | null; right: Partial<ChartYAxisProps> | null }
} & ChartFrameConfig

type AnySeries = ChartAreaSeries & ChartBarSeries & ChartLineSeries & { type?: CartesianSeriesKind }

export type CartesianRootOptions<T extends object, S extends ChartSeriesBase> = {
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
export const definedProps = <P extends object>(values: P): Partial<P> => {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  ) as Partial<P>
}

/** Default config of a series kind, below root props and the series' own config. */
const kindDefaults = (kind: CartesianSeriesKind, sparkline: boolean): Partial<AnySeries> => {
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
export const useCartesianRoot = <T extends object, S extends ChartSeriesBase>(
  options: CartesianRootOptions<T, S>,
) => {
  const { chart, props, hidden } = options

  const generated = computed(() => isChartGenerated(props))
  const layout = computed(() => options.layout?.() ?? 'horizontal')

  const resolved = computed(() => {
    const isSparkline = !!props.sparkline
    const rootDefaults = options.rootDefaults() as Partial<AnySeries>

    // Kind defaults go under root props and series config; a ComposedChart picks them per series `type`.
    const series =
      props.series === undefined
        ? undefined
        : normalizeSeriesInput<AnySeries>(props.series as ChartSeriesInput<object, AnySeries>).map(
            ([key, entry]) => ({
              ...kindDefaults(options.kind(entry), isSparkline),
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
        : { ...kindDefaults(options.kind({}), isSparkline), ...rootDefaults },
    })
  })

  // Without `index` or `series`, hand-placed parts keep their own defaults (inferred series would recolor them).
  chart.config.value = () =>
    props.index === undefined && props.series === undefined
      ? null
      : { index: props.index as string | undefined, series: resolved.value, hidden: hidden.value }

  const config = computed<CartesianAutoConfig>(() => {
    const isVertical = layout.value === 'vertical'
    const isEnabled = !props.sparkline
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
        yAxisId: entry.yAxis === 'right' && !isVertical ? 'right' : undefined,
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
      const hasCustomFill =
        entry.fill !== undefined && !['gradient', 'solid', 'none'].includes(entry.fill)

      const fill = entry.fill === 'solid' ? entry.color : entry.fill

      const fillOpacity =
        hasCustomFill && typeof entry.fillOpacity !== 'number' ? 1 : entry.fillOpacity

      return {
        key: entry.key,
        kind,
        props: { ...curve, ...definedProps({ fill, fillOpacity, stackId: entry.stackId }) },
      }
    })

    const { indexFormatter, valueFormatter } = props

    const categoryAxis: Partial<ChartXAxisProps & ChartYAxisProps> = definedProps({
      dataKey: props.index as string | undefined,
      tick: indexFormatter ? { formatter: indexFormatter } : undefined,
    })

    const valueAxis: Partial<ChartXAxisProps & ChartYAxisProps> = valueFormatter
      ? { tick: { formatter: (value) => valueFormatter(Number(value), '') } }
      : {}

    const xAxis = resolveChartPart<Partial<ChartXAxisProps>>(props.xAxis, {
      defaults: isVertical
        ? defu(valueAxis, { type: 'number' as const }, chartDefaults.xAxis)
        : defu(categoryAxis, chartDefaults.xAxis),
      isEnabled,
    })

    const left = resolveChartPart<Partial<ChartYAxisProps>>(props.yAxis?.left, {
      defaults: isVertical
        ? defu(categoryAxis, { type: 'category' as const, width: 'auto' as const })
        : defu(valueAxis, { width: 'auto' as const }),
      isEnabled,
    })

    const usesRight = series.some((entry) => entry.props.yAxisId === 'right')
    const right = isVertical
      ? null
      : resolveChartPart<Partial<ChartYAxisProps>>(props.yAxis?.right, {
          defaults: defu(valueAxis, {
            width: 'auto' as const,
            yAxisId: 'right',
            orientation: 'right' as const,
          }),
          isEnabled: usesRight,
        })

    return {
      generated: generated.value,
      layout: layout.value,
      series,
      grid: resolveChartPart<Partial<ChartGridProps>>(props.grid, {
        defaults: isVertical ? chartDefaults.gridVertical : chartDefaults.grid,
        isEnabled,
      }),
      xAxis,
      yAxis: { left, right },
      // Composition mode draws only the slot, so a `ChartTooltip` child stays the single tooltip.
      tooltip: generated.value
        ? resolveChartPart<Partial<ChartTooltipProps>>(props.tooltip, {
            defaults: definedProps({
              valueFormatter: seriesValueFormatter(
                all,
                props.valueFormatter,
              ) as ChartTooltipProps['valueFormatter'],
              labelFormatter: props.indexFormatter,
            }),
            isEnabled,
          })
        : null,
      legend: resolveFrameLegend(props.legend, { hasLegendSlot: options.hasLegendSlot() }),
      legendItems: seriesLegendItems(all),
    }
  })

  return { config: config as ComputedRef<CartesianAutoConfig>, resolved }
}
