import { scaleBand, scaleLinear, scalePoint } from 'd3-scale'

import type { AxisMeasure } from './cartesian-axis-measure'
import { createTickFormatter, getAxisOrientation, getAxisType } from './cartesian-axis-measure'
import { toNumber } from './cartesian-values'
import type { ChartAxisConfig, ResolvedAxis } from './cartesian.types'
import type { ChartTick } from './scale'
import { measureText, thinTicks } from './scale'
import type { ChartDatum, ChartMargin, ChartOffset } from './types'

type RawTick = Omit<ChartTick, 'labelCoordinate'>
type AxisBox = ResolvedAxis['box']
type AxisRange = [number, number]
type AxisOrientation = ResolvedAxis['orientation']

/** How an axis maps data to pixels, before its ticks are thinned. */
type AxisScale = Pick<ResolvedAxis, 'scaleType' | 'scale' | 'position' | 'bandwidth' | 'domain'> & {
  ticks: RawTick[]
}

type AxisScaleContext = {
  range: AxisRange
  data: ChartDatum[]
  measure: AxisMeasure
}

/** The plot area: the chart minus its margins and the room every axis reserves on its side. */
export const getPlotOffset = (options: {
  configs: ChartAxisConfig[]
  margin: Required<ChartMargin>
  width: number
  height: number
  measure: AxisMeasure
}): ChartOffset => {
  const { configs, margin, measure } = options

  const sideSize = (side: AxisOrientation) =>
    configs
      .filter((config) => getAxisOrientation(config) === side)
      .reduce((total, config) => total + measure.axisSize(config), 0)

  const left = margin.left + sideSize('left')
  const right = margin.right + sideSize('right')
  const top = margin.top + sideSize('top')
  const bottom = margin.bottom + sideSize('bottom')

  return {
    left,
    top,
    right,
    bottom,
    width: Math.max(options.width - left - right, 0),
    height: Math.max(options.height - top - bottom, 0),
  }
}

const getAxisRange = (config: ChartAxisConfig, plot: ChartOffset): AxisRange => {
  const [padStart, padEnd] = config.padding ?? [0, 0]
  const top = plot.top + padStart
  const bottom = plot.top + plot.height - padEnd

  // Number axes grow upwards on y; category axes run top → bottom (first row on top).
  const yRange: AxisRange = getAxisType(config) === 'category' ? [top, bottom] : [bottom, top]

  const range: AxisRange =
    config.axis === 'x' ? [plot.left + padStart, plot.left + plot.width - padEnd] : yRange

  return config.reversed ? [range[1], range[0]] : range
}

// Axes on the same side of the plot stack outwards in template order: each one starts at that side's current edge
// and pushes it out by its size.
const createAxisBoxPlacer = (plot: ChartOffset) => {
  const edge = {
    left: plot.left,
    right: plot.left + plot.width,
    top: plot.top,
    bottom: plot.top + plot.height,
  }

  const placeX = (orientation: AxisOrientation, size: number): AxisBox => {
    if (orientation === 'top') {
      edge.top -= size

      return { x: plot.left, y: edge.top, width: plot.width, height: size }
    }

    const y = edge.bottom
    edge.bottom = y + size

    return { x: plot.left, y, width: plot.width, height: size }
  }

  const placeY = (orientation: AxisOrientation, size: number): AxisBox => {
    if (orientation === 'right') {
      const x = edge.right
      edge.right = x + size

      return { x, y: plot.top, width: size, height: plot.height }
    }

    edge.left -= size

    return { x: edge.left, y: plot.top, width: size, height: plot.height }
  }

  return (config: ChartAxisConfig, size: number): AxisBox => {
    const orientation = getAxisOrientation(config)

    return config.axis === 'x' ? placeX(orientation, size) : placeY(orientation, size)
  }
}

// Every tick for grid lines, plus the labels left after thinning overlaps within the chart's length.
const layoutTicks = (
  config: ChartAxisConfig,
  options: { ticks: RawTick[]; chartLength: number },
) => {
  const { ticks, chartLength } = options
  const fontSize = config.fontSize ?? 10
  const isX = config.axis === 'x'

  const labelSize = (tick: { text: string }) =>
    isX ? measureText(tick.text, fontSize) : fontSize * 1.2

  return {
    allTicks: ticks.map((tick) => ({ ...tick, labelCoordinate: tick.coordinate })),
    ticks: thinTicks(ticks, {
      interval: config.interval ?? 'preserveEnd',
      size: labelSize,
      bounds: [0, chartLength],
      minTickGap: config.minTickGap ?? 5,
    }),
  }
}

// Explicit category ticks pick the data rows whose category matches; unknown values are dropped.
const getCategoryTickIndexes = (
  config: ChartAxisConfig,
  options: { indexes: number[]; measure: AxisMeasure },
) => {
  const { indexes, measure } = options
  if (!config.ticks?.length) return indexes

  const indexOf = (tick: number | string) =>
    indexes.find((index) => String(measure.categoryOf(config, index)) === String(tick))

  return config.ticks.map(indexOf).filter((index): index is number => index !== undefined)
}

// Category axis: one band per datum when the chart has bars, one point per datum otherwise.
const createCategoryScale = (
  config: ChartAxisConfig,
  context: AxisScaleContext & { hasBars: boolean },
): AxisScale => {
  const { range, hasBars, measure } = context
  const indexes = context.data.map((_, index) => index)

  const scale = hasBars
    ? scaleBand<number>().domain(indexes).range(range)
    : scalePoint<number>().domain(indexes).range(range)

  const bandwidth = hasBars ? scale.bandwidth() : 0
  const start = (index: number) => scale(index) ?? range[0]
  const position = (index: number) => start(index) + bandwidth / 2
  const format = createTickFormatter(config)

  const tickIndexes = getCategoryTickIndexes(config, { indexes, measure })

  const ticks = tickIndexes.map((index, order) => {
    const value = measure.categoryOf(config, index)

    return { value, coordinate: position(index), index, text: format(value, order) }
  })

  return {
    scaleType: hasBars ? 'band' : 'point',
    scale: start,
    position,
    bandwidth,
    domain: indexes,
    ticks,
  }
}

// Number axis. Along the category direction (e.g. a numeric x axis in a line chart) it positions data by `dataKey`.
const createNumberScale = (config: ChartAxisConfig, context: AxisScaleContext): AxisScale => {
  const { data, measure } = context
  const { domain, ticks } = measure.numberTicks(config)
  const scale = scaleLinear().domain(domain).range(context.range)
  const format = createTickFormatter(config)

  // A row without a numeric value has no position (NaN); series skip it.
  const position = (index: number) =>
    scale(toNumber(data[index]?.[config.dataKey ?? '']) ?? Number.NaN)

  return {
    scaleType: 'linear',
    scale: (value: number) => scale(value),
    position,
    bandwidth: 0,
    domain,
    ticks: ticks.map((value, index) => ({
      value,
      coordinate: scale(value),
      index,
      text: format(value, index),
    })),
  }
}

/** Lays out every axis against the plot area: its box, scale and ticks. */
export const resolveAxes = (options: {
  configs: ChartAxisConfig[]
  plot: ChartOffset
  data: ChartDatum[]
  hasBars: boolean
  chartSize: { width: number; height: number }
  measure: AxisMeasure
}): ResolvedAxis[] => {
  const { plot, data, hasBars, chartSize, measure } = options
  const placeBox = createAxisBoxPlacer(plot)

  return options.configs.map((config) => {
    const type = getAxisType(config)
    const size = measure.axisSize(config)
    const box = placeBox(config, size)
    const range = getAxisRange(config, plot)

    const scale =
      type === 'category'
        ? createCategoryScale(config, { range, data, hasBars, measure })
        : createNumberScale(config, { range, data, measure })

    const chartLength = config.axis === 'x' ? chartSize.width : chartSize.height

    return {
      id: config.id,
      axis: config.axis,
      type,
      scaleType: scale.scaleType,
      config,
      hide: !!config.hide,
      orientation: getAxisOrientation(config),
      size,
      box,
      scale: scale.scale,
      position: scale.position,
      bandwidth: scale.bandwidth,
      domain: scale.domain,
      range,
      ...layoutTicks(config, { ticks: scale.ticks, chartLength }),
    }
  })
}
