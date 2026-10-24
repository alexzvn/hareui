import type { ComputedRef, InjectionKey } from 'vue'
import { inject } from 'vue'

import type { PolarAxisConfig, ResolvedPolarAxis } from './polar-axis'
import type { RadialBarPosition } from './polar-bars'
import type { PolarGeometry, PolarGeometryInput } from './polar-geometry'
import type { PieItemGroup } from './polar-pie'
import type { ChartLegendItem } from './series-config'

/** Which polar root a layout belongs to. */
export type PolarChartKind = 'pie' | 'radar' | 'radialBar'

/** Props of the `#center` slot of PieChart and RadialChart. */
export type ChartPolarCenterSlotProps = {
  /** Sum of the visible slice (or ring) values. */
  total: number
  /** Hovered or focused slice (or ring), or `null`. */
  active: ChartLegendItem | null
}

/** Layout a polar root shares with its parts. */
export type PolarContext = {
  kind: PolarChartKind
  /**
   * Center and radii of `input` in this chart's plot area. The one formula behind every polar part, so a `ChartPie`
   * and the root's center agree.
   */
  resolveGeometry: (input: PolarGeometryInput) => PolarGeometry
  /** The root's center and radii; in a pie chart, those of the first registered pie (see `usePolarChart`). */
  cx: ComputedRef<number>
  cy: ComputedRef<number>
  innerRadius: ComputedRef<number>
  outerRadius: ComputedRef<number>
  startAngle: ComputedRef<number>
  endAngle: ComputedRef<number>
  angleAxis: ComputedRef<ResolvedPolarAxis>
  radiusAxis: ComputedRef<ResolvedPolarAxis>
  registerAngleAxis: (get: () => PolarAxisConfig) => () => void
  registerRadiusAxis: (get: () => PolarAxisConfig) => () => void
  /** Radial bar charts: offset and thickness of a series' bars inside each ring band. */
  radialBarPosition: (seriesId: string) => RadialBarPosition
  /**
   * Item-triggered series (pie): the slices, the sweep and the geometry of each pie, for hover, keyboard navigation and
   * the center.
   */
  registerItems: (seriesId: string, get: () => PieItemGroup) => () => void
  /** Total and hovered slice for the `#center` slot. */
  center: ComputedRef<ChartPolarCenterSlotProps>
}

/** Injection key of the enclosing polar root's layout. */
export const polarContextKey: InjectionKey<PolarContext> = Symbol('hareui-chart-polar')

/** The enclosing polar root's layout. Throws outside PieChart, RadarChart and RadialChart. */
export const usePolarContext = (component = 'Polar chart part'): PolarContext => {
  const context = inject(polarContextKey, null)
  if (!context)
    throw new Error(`${component} must be used inside a PieChart, RadarChart or RadialChart.`)

  return context
}
