import { RADIAN } from './polar-geometry'
import { resolveNumberDomain } from './scale'
import type { ChartAxisDomain, ChartDatum } from './types'

/** Props of a `ChartPolarAngleAxis` or `ChartPolarRadiusAxis` that shape the chart's axis. */
export type PolarAxisConfig = {
  dataKey?: string
  /** `category` spreads the data evenly around the circle (or across the rings); `number` maps values onto it. */
  type?: 'category' | 'number'
  domain?: ChartAxisDomain
  tickCount?: number
  allowDecimals?: boolean
  allowDataOverflow?: boolean
  ticks?: number[]
  reversed?: boolean
}

/** One tick of a polar axis. */
type PolarTick = {
  value: number | string
  index: number
  /** Angle in degrees (angle axis) or radius in px (radius axis). */
  coordinate: number
}

/** A polar axis mapped onto its angles or radii. */
export type ResolvedPolarAxis = {
  type: 'category' | 'number'
  dataKey?: string
  /** Pixel radii or angles the domain maps onto. */
  range: [number, number]
  /** Number axes: the resolved `[min, max]`. Category axes: one value per datum. */
  domain: Array<number | string>
  ticks: PolarTick[]
  /** Category axes: angle/radius step per datum (band size). 0 for number axes. */
  bandwidth: number
  /** Number axes: position of a value. */
  scale: (value: number) => number
  /** Category axes: start of the band of a datum. Number axes: position of `value`. */
  at: (index: number) => number
}

/** What a polar axis spans, apart from its own config. */
export type PolarAxisInput = {
  data: ChartDatum[]
  /** Series values a number axis spans; read only by number axes. */
  values: () => number[]
  /** Angles (degrees) or radii (px) the axis maps onto. */
  range: [number, number]
  /** Axis type when the config sets none. */
  defaultType: 'category' | 'number'
  /** Number axes: domain when the config sets none. */
  fallbackDomain: ChartAxisDomain
  /** Category axes: ticks at the middle of their band instead of its start. */
  isCentered?: boolean
}

/** True for a datum value that plots as a number (empty strings don't). */
export const isNumericValue = (value: number | string | undefined): value is number | string => {
  return value !== undefined && value !== '' && Number.isFinite(Number(value))
}

/** Every numeric value of `keys` across `data`, row by row. */
export const seriesNumbers = (data: ChartDatum[], keys: string[]): number[] => {
  const values: number[] = []

  for (const datum of data) {
    for (const key of keys) {
      if (isNumericValue(datum[key])) values.push(Number(datum[key]))
    }
  }

  return values
}

const resolveCategoryAxis = (input: PolarAxisInput, config: PolarAxisConfig): ResolvedPolarAxis => {
  const { data, range } = input
  const { dataKey } = config
  const [start, end] = config.reversed ? [range[1], range[0]] : range
  const bandwidth = data.length ? (end - start) / data.length : 0
  const at = (index: number) => start + index * bandwidth
  const tickOffset = input.isCentered ? bandwidth / 2 : 0
  const domain = data.map((datum, index) => (dataKey ? (datum[dataKey] ?? index) : index))

  return {
    type: 'category',
    dataKey,
    range,
    domain,
    bandwidth: Math.abs(bandwidth),
    scale: at,
    at,
    ticks: domain.map((value, index) => ({ value, index, coordinate: at(index) + tickOffset })),
  }
}

const resolveNumberAxis = (input: PolarAxisInput, config: PolarAxisConfig): ResolvedPolarAxis => {
  const values = input.values()
  const extent: [number, number] = values.length
    ? [Math.min(...values), Math.max(...values)]
    : [0, 0]

  const { domain, ticks } = resolveNumberDomain(extent, {
    domain: config.domain ?? input.fallbackDomain,
    tickCount: config.tickCount ?? 5,
    allowDecimals: config.allowDecimals ?? true,
    allowDataOverflow: config.allowDataOverflow ?? false,
    ticks: config.ticks,
  })

  const { range } = input
  const [start, end] = config.reversed ? [range[1], range[0]] : range
  const span = domain[1] - domain[0]
  const scale = (value: number) => {
    if (span === 0) return start

    return start + ((value - domain[0]) / span) * (end - start)
  }

  return {
    type: 'number',
    dataKey: config.dataKey,
    range,
    domain,
    bandwidth: 0,
    scale,
    at: scale,
    ticks: ticks.map((value, index) => ({ value, index, coordinate: scale(value) })),
  }
}

/** The angle or radius axis of a polar chart, from its registered config (if any). */
export const resolvePolarAxis = (
  input: PolarAxisInput,
  config: PolarAxisConfig = {},
): ResolvedPolarAxis => {
  const type = config.type ?? input.defaultType
  if (type === 'category') return resolveCategoryAxis(input, config)

  return resolveNumberAxis(input, config)
}

/** Below this, a cosine counts as 0: the label sits on the vertical through the center. */
const VERTICAL_EPSILON = 1e-5

/**
 * Text placement of an angle axis label: anchored away from the center
 * horizontally, and above / below the spoke only at the top and bottom of the circle.
 */
export const angleTickAnchor = (
  angle: number,
  orientation: 'outer' | 'inner' = 'outer',
): { textAnchor: 'start' | 'middle' | 'end'; dy: string } => {
  const cos = Math.cos(-RADIAN * angle)
  const sin = Math.sin(-RADIAN * angle)
  const isOuter = orientation === 'outer'
  const isBeside = Math.abs(cos) > VERTICAL_EPSILON

  // Left or right of the center: outer labels read away from it, inner ones toward it.
  if (isBeside) {
    const isRight = cos > 0

    return { textAnchor: isRight === isOuter ? 'start' : 'end', dy: '0.355em' }
  }

  // Top of the circle: text sits above the point; bottom: below it.
  const isAbove = isOuter ? sin < 0 : sin > 0

  return { textAnchor: 'middle', dy: isAbove ? '0em' : '0.71em' }
}
