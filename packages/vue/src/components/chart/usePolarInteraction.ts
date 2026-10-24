import type { ComputedRef } from 'vue'
import { watchEffect } from 'vue'

import type { ChartContext } from './context'
import { polarToCartesian } from './label'
import { isNumericValue } from './polar-axis'
import type { PolarContext } from './polar-context'
import { angleDistance, angleInSweep, cartesianToPolar } from './polar-geometry'
import type { PieItemGroup } from './polar-pie'
import type { RegisteredPie } from './polar-pie-hit-test'
import { hitTestPies } from './polar-pie-hit-test'
import type { ChartPoint, ChartSeries } from './types'

/** What the tooltip interaction of a polar root reads. */
export type PolarInteractionSource = {
  polar: PolarContext
  /** Registered pies by series id (pie charts). */
  items: ReadonlyMap<string, () => PieItemGroup>
  /** Visible radar and radial bar series. */
  visibleSeries: ComputedRef<ChartSeries[]>
  /** `dataKey` of the angle axis: the tooltip header of a radar row. */
  angleDataKey: () => string | undefined
}

/**
 * Pointer and keyboard tracking of a polar root: pies are item-triggered (one slice at a time), radar and radial
 * charts axis-triggered (one data row across every series).
 */
export const usePolarInteraction = (chart: ChartContext, source: PolarInteractionSource): void => {
  const { polar, items, visibleSeries } = source
  const { kind } = polar
  const isPie = kind === 'pie'
  const center = (): ChartPoint => ({ x: polar.cx.value, y: polar.cy.value })

  const registeredPies = (): RegisteredPie[] => {
    return chart.series.value.flatMap((series) => {
      const get = items.get(series.id)

      return get ? [{ seriesId: series.id, group: get() }] : []
    })
  }

  /** Every pie slice in keyboard order: pies in template order, slices in data order. */
  const pieItems = () => {
    return registeredPies().flatMap(({ seriesId, group }) =>
      group.sectors.map((sector) => ({
        seriesId,
        index: sector.index,
        coordinate: sector.tooltipPosition,
      })),
    )
  }

  const hitTestPie = (x: number, y: number) => {
    return hitTestPies({ x, y }, { pies: registeredPies(), activeSeriesId: chart.active.seriesId })
  }

  /** Index of the spoke nearest to `angle`; the first one wins ties. */
  const nearestSpokeIndex = (angle: number, count: number) => {
    const axis = polar.angleAxis.value
    let index = 0
    let best = Infinity

    for (let spoke = 0; spoke < count; spoke++) {
      const distance = angleDistance(angle, axis.at(spoke))
      if (distance < best) {
        best = distance
        index = spoke
      }
    }

    return index
  }

  /** Index of the ring band at `radius`, clamped to the rings. */
  const ringIndex = (radius: number, count: number) => {
    const [start, end] = polar.radiusAxis.value.range
    const step = (end - start) / count
    const index = Math.floor((radius - start) / step)

    return Math.min(count - 1, Math.max(0, index))
  }

  /** True when the pointer lies on the rings: not inside the hole nor beyond the rings, and on the sweep. */
  const isOnRings = (radius: number, angle: number) => {
    const [r0, r1] = polar.radiusAxis.value.range
    const isOutsideRadii = radius < Math.min(r0, r1) || radius > Math.max(r0, r1)
    const sweep = { startAngle: polar.startAngle.value, endAngle: polar.endAngle.value }

    return !isOutsideRadii && angleInSweep(angle, sweep)
  }

  /**
   * Row under a point. Radar snaps to the nearest spoke anywhere on the chart, so the tooltip stays
   * up between spokes; radial bars use the ring band under the pointer and return `null` outside the rings.
   */
  const hitTestRow = (x: number, y: number) => {
    const coordinate = { x, y }
    const { radius, angle } = cartesianToPolar(center(), coordinate)
    const isRadar = kind === 'radar'
    if (!isRadar && !isOnRings(radius, angle)) return null

    const count = chart.data.value.length
    if (!count) return null

    const index = isRadar ? nearestSpokeIndex(angle, count) : ringIndex(radius, count)

    return { index, coordinate }
  }

  /** Radar: the first visible radar's point, where its active dot is drawn. */
  const radarPointAt = (index: number) => {
    const datum = chart.data.value[index]
    const raw = visibleSeries.value.map((series) => datum?.[series.dataKey]).find(isNumericValue)
    const radius =
      raw === undefined ? polar.outerRadius.value : polar.radiusAxis.value.scale(Number(raw))

    return polarToCartesian(polar.cx.value, polar.cy.value, radius, polar.angleAxis.value.at(index))
  }

  /** Radial bars: the middle of the ring at the start of the sweep. */
  const ringStartAt = (index: number) => {
    const band = polar.radiusAxis.value
    const radius = band.at(index) + band.bandwidth / 2

    return polarToCartesian(polar.cx.value, polar.cy.value, radius, polar.startAngle.value)
  }

  const coordinateOf = (index: number): ChartPoint | null => {
    if (isPie) return pieItems()[index]?.coordinate ?? null
    if (kind === 'radar') return radarPointAt(index)

    return ringStartAt(index)
  }

  chart.interaction.value = {
    trigger: isPie ? 'item' : 'axis',
    hitTest: isPie ? hitTestPie : hitTestRow,
    items: isPie ? pieItems : undefined,
    coordinateOf,
    count: () => (isPie ? pieItems().length : chart.data.value.length),
  }

  // Radar and radial rows come from the chart data: a shorter array drops an active row that no longer exists.
  if (!isPie) {
    watchEffect(() => {
      const index = chart.active.index
      if (index !== null && index >= chart.data.value.length) chart.setActive(null)
    })
  }

  chart.tooltipLabel.value = (index) => {
    if (kind !== 'radar') return undefined

    const key = source.angleDataKey()
    const value = key ? chart.data.value[index]?.[key] : undefined

    return value ?? undefined
  }
}
