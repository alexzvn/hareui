import { computed, onScopeDispose, provide, shallowReactive } from 'vue'

import type { ChartContext } from './context'
import type { PolarAxisConfig, ResolvedPolarAxis } from './polar-axis'
import { resolvePolarAxis, seriesNumbers } from './polar-axis'
import { bandBarPositions } from './polar-bars'
import type { PolarChartKind, PolarContext } from './polar-context'
import { polarContextKey } from './polar-context'
import type { PolarBox, PolarGeometryInput } from './polar-geometry'
import { deltaAngle, resolvePolarGeometry } from './polar-geometry'
import type { PieItemGroup } from './polar-pie'
import type { ChartSlice } from './series-config'
import { usePolarCenter } from './usePolarCenter'
import { usePolarInteraction } from './usePolarInteraction'

/** Root props of a polar chart, read lazily so the layout follows them. */
export type PolarChartOptions = {
  kind: PolarChartKind
  cx?: () => number | string | undefined
  cy?: () => number | string | undefined
  innerRadius?: () => number | string | undefined
  outerRadius?: () => number | string | undefined
  startAngle?: () => number | undefined
  endAngle?: () => number | undefined
  /** Radial bar charts. */
  barSize?: () => number | string | undefined
  barGap?: () => number | string | undefined
  barCategoryGap?: () => number | string | undefined
  maxBarSize?: () => number | undefined
  /** Generated mode of PieChart and RadialChart: the resolved rows, hidden ones included. */
  slices?: () => readonly ChartSlice[] | undefined
}

const DEFAULT_SWEEPS: Record<PolarChartKind, { startAngle: number; endAngle: number }> = {
  pie: { startAngle: 0, endAngle: 360 },
  radar: { startAngle: 90, endAngle: -270 },
  radialBar: { startAngle: 0, endAngle: 360 },
}

/** First registered entry of a map; a chart uses one angle axis, one radius axis and one leading pie. */
const firstOf = <T>(map: ReadonlyMap<unknown, () => T>): T | undefined => {
  return [...map.values()][0]?.()
}

/**
 * Polar layout of a chart root (PieChart, RadarChart, RadialChart): center and radii, angle and radius
 * axes, radial bar bands, and the tooltip interaction. Call in the root's setup after `useChartRoot`.
 */
export const usePolarChart = (chart: ChartContext, options: PolarChartOptions): PolarContext => {
  const { kind } = options
  const angleAxes = shallowReactive(new Map<number, () => PolarAxisConfig>())
  const radiusAxes = shallowReactive(new Map<number, () => PolarAxisConfig>())
  const items = shallowReactive(new Map<string, () => PieItemGroup>())
  let nextKey = 0

  const registerAxis = (map: Map<number, () => PolarAxisConfig>, get: () => PolarAxisConfig) => {
    const key = nextKey++
    map.set(key, get)

    const unregister = () => map.delete(key)
    onScopeDispose(unregister)

    return unregister
  }

  const registerItems = (seriesId: string, get: () => PieItemGroup) => {
    items.set(seriesId, get)

    const unregister = () => items.delete(seriesId)
    onScopeDispose(unregister)

    return unregister
  }

  const box = computed<PolarBox>(() => {
    const margin = chart.margin.value

    return {
      left: margin.left,
      top: margin.top,
      width: Math.max(0, chart.width.value - margin.left - margin.right),
      height: Math.max(0, chart.height.value - margin.top - margin.bottom),
    }
  })

  const resolveGeometry = (input: PolarGeometryInput) => resolvePolarGeometry(box.value, input)

  const rootGeometry = computed(() =>
    resolveGeometry({
      cx: options.cx?.(),
      cy: options.cy?.(),
      innerRadius: options.innerRadius?.(),
      outerRadius: options.outerRadius?.(),
    }),
  )

  // A pie chart's root has no center of its own: it follows the pie actually drawn, so the `#center` slot and a
  // centered `ChartLabel` sit on it wherever its `cx`/`cy` put it. With several pies the first registered (first in
  // the template) wins; before any pie mounts, the defaults apply.
  const geometry = computed(() => {
    const pieGeometry = kind === 'pie' ? firstOf(items)?.geometry : undefined

    return pieGeometry ?? rootGeometry.value
  })

  const cx = computed(() => geometry.value.cx)
  const cy = computed(() => geometry.value.cy)
  const innerRadius = computed(() => geometry.value.innerRadius)
  const outerRadius = computed(() => geometry.value.outerRadius)
  const startAngle = computed(() => options.startAngle?.() ?? DEFAULT_SWEEPS[kind].startAngle)
  const endAngle = computed(() => options.endAngle?.() ?? DEFAULT_SWEEPS[kind].endAngle)

  const visibleSeries = computed(() =>
    chart.series.value.filter(
      (series) => !series.hide && (series.kind === 'radar' || series.kind === 'radialBar'),
    ),
  )

  const seriesValues = computed(() => {
    const keys = visibleSeries.value.map((series) => series.dataKey)

    return seriesNumbers(chart.data.value, keys)
  })

  // A chart has one angle axis and one radius axis; extra axes are ignored.
  const angleConfig = computed(() => firstOf(angleAxes))
  const radiusConfig = computed(() => firstOf(radiusAxes))

  const angleAxis = computed<ResolvedPolarAxis>(() => {
    const sweepEnd = startAngle.value + deltaAngle(startAngle.value, endAngle.value)
    return resolvePolarAxis(
      {
        data: chart.data.value,
        values: () => seriesValues.value,
        range: [startAngle.value, sweepEnd],
        defaultType: kind === 'radialBar' ? 'number' : 'category',

        // Radial bars fill the sweep up to the largest value; no rounding of the domain.
        fallbackDomain: [0, 'dataMax'],
      },
      angleConfig.value,
    )
  })

  const radiusAxis = computed<ResolvedPolarAxis>(() =>
    resolvePolarAxis(
      {
        data: chart.data.value,
        values: () => seriesValues.value,
        range: [innerRadius.value, outerRadius.value],
        defaultType: kind === 'radialBar' ? 'category' : 'number',
        fallbackDomain: [0, 'auto'],
        isCentered: true,
      },
      radiusConfig.value,
    ),
  )

  const barPositions = computed(() => {
    const bars = visibleSeries.value.filter((series) => series.kind === 'radialBar')

    const positions = bandBarPositions(
      {
        bandSize: radiusAxis.value.bandwidth,
        bars: bars.map((bar) => ({ barSize: bar.barSize, maxBarSize: bar.maxBarSize })),
      },
      {
        barSize: options.barSize?.(),
        barGap: options.barGap?.(),
        barCategoryGap: options.barCategoryGap?.(),
        maxBarSize: options.maxBarSize?.(),
      },
    )

    return new Map(bars.map((bar, index) => [bar.id, positions[index]!]))
  })

  const context: PolarContext = {
    kind,
    resolveGeometry,
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    angleAxis,
    radiusAxis,
    registerAngleAxis: (get) => registerAxis(angleAxes, get),
    registerRadiusAxis: (get) => registerAxis(radiusAxes, get),
    radialBarPosition: (seriesId) => barPositions.value.get(seriesId) ?? { offset: 0, size: 0 },
    registerItems,
    center: usePolarCenter(chart, { slices: options.slices, items }),
  }

  usePolarInteraction(chart, {
    polar: context,
    items,
    visibleSeries,
    angleDataKey: () => angleConfig.value?.dataKey,
  })

  provide(polarContextKey, context)

  return context
}
