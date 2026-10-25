import type { InjectionKey } from 'vue'
import { computed, inject, provide } from 'vue'

import { getPlotOffset, resolveAxes } from './cartesian-axes'
import { createAxisMeasure } from './cartesian-axis-measure'
import { createBarLayout } from './cartesian-bar-layout'
import { createCartesianInteraction } from './cartesian-interaction'
import { createStacks, getRawValues, getValueExtent } from './cartesian-stack'
import { isSameAxisId } from './cartesian-values'
import type {
  CartesianChartOptions,
  CartesianContext,
  ChartAxisId,
  ChartSeriesPairs,
  ResolvedAxis,
} from './cartesian.types'
import type { ChartContext } from './context'
import { provideChartLabelViewBox } from './label'
import type { ChartSeries } from './types'
import { useCartesianAxisConfigs } from './useCartesianAxisConfigs'

export const cartesianContextKey: InjectionKey<CartesianContext> = Symbol('hareui-cartesian-chart')

/** Default baseline: 0, clamped into the value axis domain. */
const getBaseValue = (axis: ResolvedAxis): number => {
  const [a, b] = axis.domain as [number, number]
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  if (min >= 0) return min
  if (max <= 0) return max

  return 0
}

/** Adds axes, scales, stacking and bar layout to a chart root (area, bar, line, composed charts). */
export const useCartesianChart = (
  chart: ChartContext,
  options: CartesianChartOptions = {},
): CartesianContext => {
  const isHorizontal = computed(() => chart.layout.value !== 'vertical')
  const visibleSeries = computed(() => chart.series.value.filter((series) => !series.hide))
  const hasBars = computed(() => visibleSeries.value.some((series) => series.kind === 'bar'))
  const { registerAxis, configs } = useCartesianAxisConfigs(chart, isHorizontal)

  const stacks = computed(() =>
    createStacks({
      series: visibleSeries.value,
      data: chart.data.value,
      isHorizontal: isHorizontal.value,
    }),
  )

  const measure = createAxisMeasure({
    data: () => chart.data.value,
    isHorizontal: () => isHorizontal.value,
    valueExtent: (axis, id) =>
      getValueExtent({
        series: visibleSeries.value,
        stacks: stacks.value,
        data: chart.data.value,
        axis,
        id,
      }),
  })

  const offset = computed(() =>
    getPlotOffset({
      configs: configs.value,
      margin: chart.margin.value,
      width: chart.width.value,
      height: chart.height.value,
      measure,
    }),
  )

  const axes = computed(() =>
    resolveAxes({
      configs: configs.value,
      plot: offset.value,
      data: chart.data.value,
      hasBars: hasBars.value,
      chartSize: { width: chart.width.value, height: chart.height.value },
      measure,
    }),
  )

  // An unknown id falls back to the first axis of that direction.
  const findAxis = (axis: 'x' | 'y', id: ChartAxisId | undefined): ResolvedAxis => {
    const all = axes.value
    const exact = all.find((entry) => entry.axis === axis && isSameAxisId(entry.id, id))

    return exact ?? all.find((entry) => entry.axis === axis)!
  }

  const categoryAxis = computed(() => {
    const axis = isHorizontal.value ? 'x' : 'y'
    const sameDirection = axes.value.filter((entry) => entry.axis === axis)

    return (
      sameDirection.find((entry) => entry.type === 'category') ??
      sameDirection.find((entry) => !!entry.config.dataKey) ??
      findAxis(axis, 0)
    )
  })

  const valueAxisOf = (series: ChartSeries): ResolvedAxis =>
    isHorizontal.value ? findAxis('y', series.yAxisId) : findAxis('x', series.xAxisId)

  const seriesValues = (seriesId: string): ChartSeriesPairs => {
    const series = chart.series.value.find((entry) => entry.id === seriesId)
    if (!series) return []

    const stacked = stacks.value.get(series.id)
    if (stacked) return stacked

    const base = getBaseValue(valueAxisOf(series))

    return getRawValues(series, chart.data.value).map((value) =>
      value === null ? null : [base, value],
    )
  }

  const barLayout = computed(() =>
    createBarLayout({
      series: visibleSeries.value,
      bandSize: categoryAxis.value.bandwidth,
      bar: options.bar?.(),
    }),
  )

  const context: CartesianContext = {
    offset,
    registerAxis,
    axes,
    xAxis: (id) => findAxis('x', id),
    yAxis: (id) => findAxis('y', id),
    categoryAxis,
    seriesValues,
    barPosition: (id) => barLayout.value.get(id) ?? null,
    horizontal: isHorizontal,
  }

  chart.interaction.value = createCartesianInteraction({
    chart,
    offset,
    categoryAxis,
    isHorizontal,
  })

  chart.tooltipLabel.value = (index) => {
    // Sparklines draw no category axis; the root's `index` still names each row.
    const key = categoryAxis.value.config.dataKey ?? chart.config.value?.()?.index

    return key ? chart.data.value[index]?.[key] : index
  }

  provide(cartesianContextKey, context)

  // A `ChartLabel` placed directly in the chart is positioned against the plot area.
  provideChartLabelViewBox(() => {
    const plot = offset.value

    return { x: plot.left, y: plot.top, width: plot.width, height: plot.height }
  })

  return context
}

/** The enclosing cartesian chart (AreaChart, BarChart, LineChart, ComposedChart). Throws elsewhere. */
export const useCartesianContext = (component = 'Chart part'): CartesianContext => {
  const context = inject(cartesianContextKey, null)
  if (context) return context

  throw new Error(
    `${component} must be used inside AreaChart, BarChart, LineChart or ComposedChart.`,
  )
}
