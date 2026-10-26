import { stack as d3Stack, stackOffsetNone, stackOrderNone } from 'd3-shape'

import { isSameAxisId, toNumber } from './cartesian-values'
import type { ChartAxisId, ChartSeriesPairs } from './cartesian.types'
import type { ChartDatum, ChartSeries } from './types'

/** Each datum's value of `series`, `null` where it is missing. */
export const getRawValues = (series: ChartSeries, data: ChartDatum[]): Array<number | null> =>
  data.map((datum) => toNumber(datum[series.dataKey]))

const isStackable = (series: ChartSeries) =>
  series.stackId !== undefined && (series.kind === 'area' || series.kind === 'bar')

// Bars and areas alike stack when they share a stackId on the same value axis, in template order.
const groupStacks = (series: ChartSeries[], isHorizontal: boolean): ChartSeries[][] => {
  const groups = new Map<string, ChartSeries[]>()

  for (const entry of series) {
    if (!isStackable(entry)) continue

    const valueAxisId = isHorizontal ? entry.yAxisId : entry.xAxisId
    const key = `${String(valueAxisId ?? 0)}:${String(entry.stackId)}`
    groups.set(key, [...(groups.get(key) ?? []), entry])
  }

  return [...groups.values()]
}

// `[lower, upper]` per datum for each member of one stack; a datum missing its own value stays `null`.
const stackMembers = (members: ChartSeries[], data: ChartDatum[]) => {
  const valueOf = (datum: ChartDatum, id: string) => {
    const member = members.find((series) => series.id === id)!

    return toNumber(datum[member.dataKey]) ?? 0
  }

  const layers = d3Stack<ChartDatum, string>()
    .keys(members.map((series) => series.id))
    .value(valueOf)
    .order(stackOrderNone)
    .offset(stackOffsetNone)(data)

  return layers.map((layer, layerIndex) => {
    const series = members[layerIndex]!
    const isMissing = (index: number) => toNumber(data[index]?.[series.dataKey]) === null

    const pairs: ChartSeriesPairs = layer.map((point, index) =>
      isMissing(index) ? null : [point[0], point[1]],
    )

    return [series.id, pairs] as const
  })
}

/** Stacked `[lower, upper]` pairs of every stacked series, by series id. */
export const createStacks = (options: {
  series: ChartSeries[]
  data: ChartDatum[]
  isHorizontal: boolean
}): Map<string, ChartSeriesPairs> => {
  const groups = groupStacks(options.series, options.isHorizontal)

  return new Map(groups.flatMap((members) => stackMembers(members, options.data)))
}

/** Smallest and largest value the series on one value axis reach (stacked series: their stacked extent). */
export const getValueExtent = (options: {
  series: ChartSeries[]
  stacks: Map<string, ChartSeriesPairs>
  data: ChartDatum[]
  axis: 'x' | 'y'
  id: ChartAxisId
}): [number, number] => {
  const { series, stacks, data, axis, id } = options
  let min = Infinity
  let max = -Infinity

  for (const entry of series) {
    const axisId = axis === 'x' ? entry.xAxisId : entry.yAxisId
    if (!isSameAxisId(axisId, id)) continue

    const stacked = stacks.get(entry.id)
    const values = stacked
      ? stacked.flatMap((pair) => pair ?? [])
      : getRawValues(entry, data).filter((value): value is number => value !== null)

    for (const value of values) {
      if (value < min) min = value
      if (value > max) max = value
    }
  }

  return [min, max]
}
