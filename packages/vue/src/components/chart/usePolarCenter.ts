import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import type { ChartContext } from './context'
import type { ChartPolarCenterSlotProps } from './polar-context'
import type { PieItemGroup } from './polar-pie'
import type { ChartSlice } from './series-config'
import type { ChartSeries, ChartTooltipPayloadEntry } from './types'

/** Where the `#center` slot reads its slices from. */
export type PolarCenterSource = {
  /** Generated mode: the resolved rows, hidden ones included. */
  slices?: () => readonly ChartSlice[] | undefined
  /** Composition mode: the registered pies, by series id. */
  items: ReadonlyMap<string, () => PieItemGroup>
}

const toNumber = (raw: unknown) => (Number.isFinite(Number(raw)) ? Number(raw) : 0)

/** Generated mode: the chart data holds only the visible slices, so the active index points into them. */
const resolveSliceCenter = (
  slices: readonly ChartSlice[],
  index: number | null,
): ChartPolarCenterSlotProps => {
  const visible = slices.filter((slice) => !slice.hidden)
  const total = visible.reduce((sum, item) => sum + item.value, 0)
  const slice = index === null ? undefined : visible[index]
  if (!slice) return { total, active: null }

  const { key, name, color, value, percent } = slice

  return { total, active: { key, name, color, hidden: false, value, percent } }
}

/** Composition mode: the first tooltip entry of each row of one series. */
const resolveEntryCenter = (
  entries: Array<ChartTooltipPayloadEntry | undefined>,
  index: number | null,
): ChartPolarCenterSlotProps => {
  const total = entries.reduce((sum, entry) => sum + toNumber(entry?.value), 0)
  const entry = index === null ? undefined : entries[index]
  if (!entry) return { total, active: null }

  const value = toNumber(entry.value)
  const percent = total === 0 ? 0 : (value / total) * 100

  return {
    total,
    active: {
      key: entry.name,
      name: entry.name,
      color: entry.color,
      hidden: false,
      value,
      percent,
    },
  }
}

/**
 * Total and hovered slice for the `#center` slot of PieChart and RadialChart. Generated mode reads the resolved
 * slices; composition mode sums the hovered pie, or the first visible pie or radial bar.
 */
export const usePolarCenter = (
  chart: ChartContext,
  source: PolarCenterSource,
): ComputedRef<ChartPolarCenterSlotProps> => {
  const centerSeries = (): ChartSeries | undefined => {
    const series = chart.series.value
    const hovered = series.find((item) => item.id === chart.active.seriesId)
    if (hovered) return hovered

    return series.find((item) => !item.hide && (item.kind === 'pie' || item.kind === 'radialBar'))
  }

  const rowCount = (series: ChartSeries) => {
    if (series.kind !== 'pie') return chart.data.value.length

    return source.items.get(series.id)?.().sectors.length ?? 0
  }

  return computed(() => {
    const index = chart.active.index
    const slices = source.slices?.()
    if (slices) return resolveSliceCenter(slices, index)

    const series = centerSeries()
    if (!series) return { total: 0, active: null }

    const entries = Array.from(
      { length: rowCount(series) },
      (_, position) => chart.payloadAt(position, series.id)[0],
    )

    return resolveEntryCenter(entries, index)
  })
}
