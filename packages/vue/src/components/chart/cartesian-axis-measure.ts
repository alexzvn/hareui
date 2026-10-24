import { toNumber } from './cartesian-values'
import type { ChartAxisConfig, ChartAxisId } from './cartesian.types'
import { measureText, resolveNumberDomain } from './scale'
import type { ChartDatum } from './types'

/** An axis's scale type: x axes default to categories, y axes to numbers. */
export const getAxisType = (config: ChartAxisConfig) =>
  config.type ?? (config.axis === 'x' ? 'category' : 'number')

/** The side of the plot an axis sits on: x axes default to the bottom, y axes to the left. */
export const getAxisOrientation = (config: ChartAxisConfig) =>
  config.orientation ?? (config.axis === 'x' ? 'bottom' : 'left')

/** Tick label text of an axis: the formatted value followed by the unit. */
export const createTickFormatter =
  (config: ChartAxisConfig) =>
  (value: number | string, index: number): string => {
    const text = config.tickFormatter ? config.tickFormatter(value, index) : String(value)

    return config.unit ? `${text}${config.unit}` : text
  }

const getDataExtent = (data: ChartDatum[], dataKey: string): [number, number] => {
  const values = data
    .map((datum) => toNumber(datum[dataKey]))
    .filter((value): value is number => value !== null)

  return values.length ? [Math.min(...values), Math.max(...values)] : [0, 0]
}

/** Live chart state the axis measurements read. */
export type AxisMeasureSource = {
  data: () => ChartDatum[]
  isHorizontal: () => boolean
  /** Extent of the series values plotted against an axis. */
  valueExtent: (axis: 'x' | 'y', id: ChartAxisId) => [number, number]
}

/** Measurements of an axis that depend on the data but not on the plot box: categories, number ticks, size. */
export const createAxisMeasure = (source: AxisMeasureSource) => {
  const categoryOf = (config: ChartAxisConfig, index: number): number | string => {
    const value = config.dataKey ? source.data()[index]?.[config.dataKey] : index

    return (value ?? index) as number | string
  }

  // A number axis along the category direction (e.g. a numeric x axis in a line chart) spans its `dataKey` values;
  // a value axis spans the series plotted against it.
  const numberTicks = (config: ChartAxisConfig) => {
    const data = source.data()
    const isAlongData = (config.axis === 'x') === source.isHorizontal() && !!config.dataKey

    const extent = isAlongData
      ? getDataExtent(data, config.dataKey!)
      : source.valueExtent(config.axis, config.id)

    return resolveNumberDomain(extent, {
      domain: config.domain ?? (isAlongData ? ['auto', 'auto'] : undefined),
      ticks: config.ticks?.map(Number).filter(Number.isFinite),
      tickCount: config.tickCount,
      allowDecimals: config.allowDecimals,
      allowDataOverflow: config.allowDataOverflow,
    })
  }

  // Widest tick label plus the tick space: the width of an `'auto'` y axis.
  const autoSize = (config: ChartAxisConfig) => {
    const format = createTickFormatter(config)

    const texts =
      getAxisType(config) === 'category'
        ? source.data().map((_, index) => format(categoryOf(config, index), index))
        : numberTicks(config).ticks.map((value, index) => format(value, index))

    const widest = texts.reduce(
      (max, text) => Math.max(max, measureText(text, config.fontSize ?? 10)),
      0,
    )

    return Math.ceil(widest + (config.tickSpace ?? 8))
  }

  // Width of a y axis or height of an x axis; hidden axes take no room.
  const axisSize = (config: ChartAxisConfig) => {
    if (config.hide) return 0
    if (config.size === 'auto') return config.axis === 'y' ? autoSize(config) : 30

    return config.size ?? (config.axis === 'x' ? 30 : 60)
  }

  return { categoryOf, numberTicks, axisSize }
}

/** Axis measurements bound to one chart. */
export type AxisMeasure = ReturnType<typeof createAxisMeasure>
