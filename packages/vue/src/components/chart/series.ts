import { useId } from 'reka-ui'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import type { ClassValue } from '@/utils/tv'

import type { ChartAnimationProps } from './animation'
import { lerp, useChartTween } from './animation'
import type { CartesianContext } from './cartesian'
import { useCartesianContext } from './cartesian'
import type { ChartContext } from './context'
import { useChartConfig, useChartContext } from './context'
import type { ChartLabelItem } from './label'
import { provideChartLabels } from './label'
import type { ChartCurveType, ChartDotProps, ChartSeries } from './types'

/** Props shared by every cartesian series. */
export type ChartSeriesProps = {
  /** Key of the value in each row. */
  dataKey: string
  /** Name shown in the tooltip. Defaults to `dataKey`. */
  name?: string
  /**
   * Hides the series; axes and stacks ignore it.
   * @defaultValue false
   */
  hide?: boolean
  /** `'none'` leaves the series out of the tooltip. */
  tooltipType?: 'none'
  /**
   * X axis the series is plotted against.
   * @defaultValue 0
   */
  xAxisId?: string | number
  /**
   * Y axis the series is plotted against.
   * @defaultValue 0
   */
  yAxisId?: string | number
  /** Additional classes merged into the series group. */
  class?: ClassValue
} & ChartAnimationProps

/** Props of areas and lines. */
export type ChartCurveSeriesProps = {
  /**
   * Curve interpolation. `monotone` gives smooth curves that never overshoot the data.
   * @defaultValue 'linear'
   */
  type?: ChartCurveType
  /**
   * Line color.
   * @defaultValue 'var(--chart-3)'
   */
  stroke?: string
  /**
   * Line width, in px.
   * @defaultValue 1
   */
  strokeWidth?: number
  /** Dash pattern of the line, e.g. `'5 5'`. */
  strokeDasharray?: string
  /**
   * Dot at every data point: `true`, `false`, or dot props (`r`, `fill`, `stroke`, `strokeWidth`, `class`).
   * @defaultValue false on `ChartArea`, true on `ChartLine`
   */
  dot?: boolean | ChartDotProps
  /**
   * Dot on the hovered point: `true`, `false`, or dot props.
   * @defaultValue true
   */
  activeDot?: boolean | ChartDotProps
  /**
   * Draws across missing values instead of breaking the line.
   * @defaultValue false
   */
  connectNulls?: boolean
} & ChartSeriesProps

export type ChartSeriesPoint = {
  index: number
  x: number
  y: number
  /** Baseline end of the value (area bottom, stack lower edge). */
  baseX: number
  baseY: number
  value: number | string | undefined
}

export const DEFAULT_SERIES_COLOR = 'var(--chart-3)'

/** Indicator color of a series: the stroke unless it is `none`, else the fill. */
export const seriesColor = (stroke: string | undefined, fill: string | undefined): string => {
  return stroke && stroke !== 'none' ? stroke : (fill ?? DEFAULT_SERIES_COLOR)
}

export type PointSeries = {
  id: string
  chart: ChartContext
  cartesian: CartesianContext
  /** Points to draw this frame (`null` where the value is missing). */
  points: ComputedRef<(ChartSeriesPoint | null)[]>
  /** Final points, without animation. */
  target: ComputedRef<(ChartSeriesPoint | null)[]>
  /** Clip width/height (0–1) of the mount animation; 1 when not animating. */
  reveal: ComputedRef<number>
  animating: ComputedRef<boolean>
  /** The hovered point, when the tooltip is active. */
  activePoint: ComputedRef<ChartSeriesPoint | null>
  horizontal: ComputedRef<boolean>
  /** `hide`, or the key is hidden through the root (`v-model:hidden`). */
  hidden: ComputedRef<boolean>
}

/** The root's resolved `series` entry for a key, when the root has `index` / `series` props. */
export const useRootSeries = (chart: ChartContext, dataKey: () => string) => {
  const config = useChartConfig(chart)
  return computed(() => config.series(dataKey()))
}

const interpolatePoints = (
  from: (ChartSeriesPoint | null)[] | null,
  to: (ChartSeriesPoint | null)[],
  t: number,
) => {
  if (!from || !from.length) return to

  return to.map((point, index) => {
    if (!point) return null

    // When the number of points changes, each point starts from the old point at the same relative position.
    const previous = from[Math.min(Math.floor((index * from.length) / to.length), from.length - 1)]
    if (!previous) return point

    return {
      ...point,
      x: lerp(previous.x, point.x, t),
      y: lerp(previous.y, point.y, t),
      baseX: lerp(previous.baseX, point.baseX, t),
      baseY: lerp(previous.baseY, point.baseY, t),
    }
  })
}

/** Registers an area or line series and computes its animated points. Call in the series' setup. */
export const usePointSeries = (
  kind: 'area' | 'line',
  props: ChartCurveSeriesProps & {
    stackId?: string | number
    fill?: string
    baseValue?: number | 'dataMin' | 'dataMax'
  },
  colors: () => { stroke?: string; fill?: string },
): PointSeries => {
  const chart = useChartContext(kind === 'area' ? 'ChartArea' : 'ChartLine')
  const cartesian = useCartesianContext(kind === 'area' ? 'ChartArea' : 'ChartLine')
  const id = useId(undefined, `hareui-chart-${kind}`)

  // The root's `series` config of this key: default name, and hidden through the root's `hidden` list.
  const rootSeries = useRootSeries(chart, () => props.dataKey)
  const hidden = computed(() => props.hide || !!rootSeries.value?.hidden)

  chart.registerSeries((): ChartSeries => {
    const { stroke, fill } = colors()
    return {
      id,
      kind,
      dataKey: props.dataKey,
      name: props.name ?? rootSeries.value?.name,
      color: seriesColor(stroke, fill),
      stroke,
      fill,
      hide: hidden.value,
      tooltip: props.tooltipType !== 'none',
      stackId: props.stackId,
      xAxisId: props.xAxisId,
      yAxisId: props.yAxisId,
    }
  })

  const horizontal = cartesian.horizontal

  const target = computed<(ChartSeriesPoint | null)[]>(() => {
    if (hidden.value) return []
    const data = chart.data.value
    const values = cartesian.seriesValues(id)
    const xAxis = cartesian.xAxis(props.xAxisId)
    const yAxis = cartesian.yAxis(props.yAxisId)
    const valueAxis = horizontal.value ? yAxis : xAxis

    // `baseValue` moves the baseline of an unstacked area.
    let base: number | undefined
    if (props.baseValue !== undefined && props.stackId === undefined) {
      const [low, high] = valueAxis.domain as [number, number]
      base =
        props.baseValue === 'dataMin'
          ? Math.min(low, high)
          : props.baseValue === 'dataMax'
            ? Math.max(low, high)
            : props.baseValue
    }

    return values.map((pair, index) => {
      if (!pair) return null
      const raw = data[index]?.[props.dataKey]
      const lower = valueAxis.scale(base ?? pair[0])
      const point = horizontal.value
        ? {
            index,
            x: xAxis.position(index),
            baseX: xAxis.position(index),
            y: yAxis.scale(pair[1]),
            baseY: lower,
            value: raw,
          }
        : {
            index,
            y: yAxis.position(index),
            baseY: yAxis.position(index),
            x: xAxis.scale(pair[1]),
            baseX: lower,
            value: raw,
          }

      // A row without a position on a number category axis is a gap.
      return Number.isFinite(point.x) && Number.isFinite(point.y) ? point : null
    })
  })

  const tween = useChartTween(
    () => target.value,
    interpolatePoints,
    () => [chart.data.value, props.dataKey, props.stackId, hidden.value],
    () => props,
  )

  const reveal = computed(() => (tween.entering.value ? tween.progress.value : 1))
  const animating = computed(() => tween.progress.value < 1)

  const activePoint = computed(() => {
    const index = chart.active.index
    if (
      index === null ||
      hidden.value ||
      chart.tooltipEnabled.value === 0 ||
      chart.interaction.value?.trigger !== 'axis'
    )
      return null

    return target.value[index] ?? null
  })

  // Labels appear once the series has finished animating.
  provideChartLabels(
    () =>
      (animating.value ? [] : target.value).flatMap((point): ChartLabelItem[] =>
        point
          ? [
              {
                index: point.index,
                value: point.value,
                datum: chart.data.value[point.index] ?? {},
                viewBox: { x: point.x, y: point.y, width: 0, height: 0 },
              },
            ]
          : [],
      ),
    'top',
  )

  return {
    id,
    chart,
    cartesian,
    points: tween.value,
    target,
    reveal,
    animating,
    activePoint,
    horizontal,
    hidden,
  }
}

/** Normalizes a `dot` / `activeDot` prop into circle attributes, or `null` when disabled. */
export const dotAttrs = (
  option: boolean | ChartDotProps | undefined,
  defaults: Required<Omit<ChartDotProps, 'class'>>,
): (Required<Omit<ChartDotProps, 'class'>> & { class?: ClassValue }) | null => {
  if (!option) return null
  return option === true ? defaults : { ...defaults, ...option }
}
