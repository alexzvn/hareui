import type { ChartAxisDomain, ChartAxisDomainItem, ChartAxisInterval } from './types'

// Nice-tick math (as used by common charting libraries) computed with plain floats: rounding every intermediate
// result to 12 significant digits matches arbitrary-precision decimal results.

const round = (value: number) => Number.parseFloat(value.toPrecision(12))

const digitCount = (value: number): number => {
  return value === 0 ? 1 : Math.floor(Math.log10(Math.abs(value))) + 1
}

const formatStep = (
  roughStep: number,
  allowDecimals: boolean,
  correctionFactor: number,
): number => {
  if (roughStep <= 0) return 0
  const digits = digitCount(roughStep)
  const digitValue = 10 ** digits
  const stepRatio = round(roughStep / digitValue)
  const stepRatioScale = digits !== 1 ? 0.05 : 0.1
  const amended = round(
    (Math.ceil(round(stepRatio / stepRatioScale)) + correctionFactor) * stepRatioScale,
  )
  const step = round(amended * digitValue)
  return allowDecimals ? step : Math.ceil(step)
}

const rangeStep = (start: number, end: number, step: number): number[] => {
  const values: number[] = []
  if (step <= 0) return values
  for (
    let index = 0, value = start;
    value < end && index < 1000;
    index++, value = round(start + step * index)
  )
    values.push(value)
  return values
}

const calculateStep = (
  min: number,
  max: number,
  tickCount: number,
  allowDecimals: boolean,
  correctionFactor = 0,
): { step: number; tickMin: number; tickMax: number } => {
  if (!Number.isFinite((max - min) / (tickCount - 1))) return { step: 0, tickMin: 0, tickMax: 0 }
  const step = formatStep(round((max - min) / (tickCount - 1)), allowDecimals, correctionFactor)
  let middle: number
  if (min <= 0 && max >= 0) {
    middle = 0
  } else {
    middle = round((min + max) / 2)
    middle = round(middle - (middle % step))
  }
  let belowCount = Math.ceil(round((middle - min) / step))
  let upCount = Math.ceil(round((max - middle) / step))
  const scaleCount = belowCount + upCount + 1
  if (scaleCount > tickCount)
    return calculateStep(min, max, tickCount, allowDecimals, correctionFactor + 1)
  if (scaleCount < tickCount) {
    upCount = max > 0 ? upCount + (tickCount - scaleCount) : upCount
    belowCount = max > 0 ? belowCount : belowCount + (tickCount - scaleCount)
  }
  return {
    step,
    tickMin: round(middle - belowCount * step),
    tickMax: round(middle + upCount * step),
  }
}

const ticksOfSingleValue = (value: number, tickCount: number, allowDecimals: boolean): number[] => {
  let step = 1
  let middle = value
  if (!Number.isInteger(value) && allowDecimals) {
    const abs = Math.abs(value)
    if (abs < 1) {
      step = 10 ** (digitCount(value) - 1)
      middle = round(Math.floor(value / step) * step)
    } else if (abs > 1) {
      middle = Math.floor(value)
    }
  } else if (value === 0) {
    middle = Math.floor((tickCount - 1) / 2)
  } else if (!allowDecimals) {
    middle = Math.floor(value)
  }
  const middleIndex = Math.floor((tickCount - 1) / 2)
  return Array.from({ length: tickCount }, (_, index) =>
    round(middle + (index - middleIndex) * step),
  )
}

/** Rounded ticks covering `[min, max]`; the axis domain grows to the first and last tick. */
export const niceTicks = (
  [min, max]: [number, number],
  tickCount = 5,
  allowDecimals = true,
): number[] => {
  const count = Math.max(tickCount, 2)
  const [low, high] = min > max ? [max, min] : [min, max]
  if (!Number.isFinite(low) || !Number.isFinite(high)) return [min, max]
  if (low === high) return ticksOfSingleValue(low, count, allowDecimals)
  const { step, tickMin, tickMax } = calculateStep(low, high, count, allowDecimals)
  const values = rangeStep(tickMin, round(tickMax + 0.1 * step), step)
  return min > max ? values.reverse() : values
}

/** Evenly stepped ticks inside a fixed domain, always ending on the domain max. */
export const fixedDomainTicks = (
  [min, max]: [number, number],
  tickCount = 5,
  allowDecimals = true,
): number[] => {
  const [low, high] = min > max ? [max, min] : [min, max]
  if (!Number.isFinite(low) || !Number.isFinite(high)) return [min, max]
  if (low === high) return [low]
  const count = Math.max(tickCount, 2)
  const step = formatStep(round((high - low) / (count - 1)), allowDecimals, 0)
  const values = [...rangeStep(low, round(high - 0.99 * step), step), high]
  return min > max ? values.reverse() : values
}

const DATA_BOUND = /^data(Min|Max)\s*([-+])\s*([\d.]+)$/

const resolveDomainItem = (
  item: ChartAxisDomainItem,
  bound: number,
  edge: 0 | 1,
  allowDataOverflow: boolean,
): number => {
  if (typeof item === 'number')
    return allowDataOverflow ? item : edge === 0 ? Math.min(item, bound) : Math.max(item, bound)
  if (typeof item === 'function') return item(bound)
  if (item === 'auto' || item === 'dataMin' || item === 'dataMax') return bound
  const match = item.match(DATA_BOUND)
  if (match) {
    const delta = Number(match[3])
    return match[2] === '-' ? bound - delta : bound + delta
  }
  const numeric = Number(item)
  return Number.isFinite(numeric)
    ? resolveDomainItem(numeric, bound, edge, allowDataOverflow)
    : bound
}

export type NumberDomainOptions = {
  domain?: ChartAxisDomain
  ticks?: number[]
  tickCount?: number
  allowDecimals?: boolean
  allowDataOverflow?: boolean
}

/** Resolves a number axis domain from the data extent and the `domain` prop, with its tick values. */
export const resolveNumberDomain = (
  dataExtent: [number, number],
  options: NumberDomainOptions = {},
): { domain: [number, number]; ticks: number[] } => {
  const {
    domain: specified = [0, 'auto'],
    tickCount = 5,
    allowDecimals = true,
    allowDataOverflow = false,
  } = options
  const extent: [number, number] =
    Number.isFinite(dataExtent[0]) && Number.isFinite(dataExtent[1]) ? dataExtent : [0, 0]
  let domain: [number, number]
  let auto = false
  if (typeof specified === 'function') {
    domain = specified(extent)
  } else {
    auto = specified[0] === 'auto' || specified[1] === 'auto'
    domain = [
      resolveDomainItem(specified[0], extent[0], 0, allowDataOverflow),
      resolveDomainItem(specified[1], extent[1], 1, allowDataOverflow),
    ]
  }
  let ticks: number[]
  if (auto) {
    ticks = niceTicks(domain, tickCount, allowDecimals)
    domain = [Math.min(ticks[0]!, domain[0]), Math.max(ticks[ticks.length - 1]!, domain[1])]
  } else {
    ticks = fixedDomainTicks(domain, tickCount, allowDecimals)
  }
  if (options.ticks?.length) ticks = options.ticks
  return { domain, ticks }
}

/** A tick with its pixel position along the axis. */
export type ChartTick = {
  value: number | string
  /** Position along the axis (x for horizontal axes, y for vertical ones). */
  coordinate: number
  /** Where the label is drawn; differs from `coordinate` when the last label is pulled inside the chart. */
  labelCoordinate: number
  index: number
  text: string
}

/**
 * Thins ticks whose labels would overlap. `size` measures a label along the axis;
 * `bounds` is the visible span (the whole SVG), labels may not cross it.
 */
export const thinTicks = (
  ticks: Omit<ChartTick, 'labelCoordinate'>[],
  interval: ChartAxisInterval,
  size: (tick: Omit<ChartTick, 'labelCoordinate'>) => number,
  bounds: [number, number],
  minTickGap: number,
): ChartTick[] => {
  const all = ticks.map((tick) => ({ ...tick, labelCoordinate: tick.coordinate }))
  if (!all.length) return all
  if (typeof interval === 'number') return all.filter((_, index) => index % (interval + 1) === 0)
  const sign = all.length >= 2 && all[1]!.coordinate < all[0]!.coordinate ? -1 : 1
  let [start, end] = sign === 1 ? bounds : [bounds[1], bounds[0]]
  const visible = (position: number, extent: number) =>
    sign * (position - (sign * extent) / 2 - start) >= 0 &&
    sign * (position + (sign * extent) / 2 - end) <= 0

  if (interval === 'equidistantPreserveStart') {
    for (let step = 1; step <= all.length; step++) {
      const picked = all.filter((_, index) => index % step === 0)
      let cursor = start
      const fits = picked.every((tick) => {
        const extent = size(tick)
        const ok =
          visible(tick.coordinate, extent) &&
          sign * (tick.coordinate - (sign * extent) / 2 - cursor) >= 0
        cursor = tick.coordinate + sign * (extent / 2 + minTickGap)
        return ok
      })
      if (fits) return picked
    }
    return []
  }

  const result: (ChartTick & { show?: boolean })[] = all.map((tick) => ({ ...tick }))
  const last = result.length - 1
  if (interval === 'preserveStart' || interval === 'preserveStartEnd') {
    if (interval === 'preserveStartEnd') {
      const tail = result[last]!
      const extent = size(tail)
      const gap = sign * (tail.coordinate + (sign * extent) / 2 - end)
      tail.labelCoordinate = gap > 0 ? tail.coordinate - gap * sign : tail.coordinate
      if (visible(tail.labelCoordinate, extent)) {
        end = tail.labelCoordinate - sign * (extent / 2 + minTickGap)
        tail.show = true
      }
    }
    const count = interval === 'preserveStartEnd' ? last : last + 1
    for (let index = 0; index < count; index++) {
      const tick = result[index]!
      // A tick before the remaining start can never show, whatever its width: skip measuring it.
      if (index !== 0 && sign * (tick.coordinate - start) < 0) continue
      const extent = size(tick)
      if (index === 0) {
        const gap = sign * (tick.coordinate - (sign * extent) / 2 - start)
        tick.labelCoordinate = gap < 0 ? tick.coordinate - gap * sign : tick.coordinate
      }
      if (visible(tick.labelCoordinate, extent)) {
        start = tick.labelCoordinate + sign * (extent / 2 + minTickGap)
        tick.show = true
      }
    }
    return result.filter((tick) => tick.show)
  }

  // preserveEnd
  for (let index = last; index >= 0; index--) {
    const tick = result[index]!
    // A tick past the remaining end can never show, whatever its width: skip measuring it.
    if (index !== last && sign * (tick.coordinate - end) > 0) continue
    const extent = size(tick)
    if (index === last) {
      const gap = sign * (tick.coordinate + (sign * extent) / 2 - end)
      tick.labelCoordinate = gap > 0 ? tick.coordinate - gap * sign : tick.coordinate
    }
    if (visible(tick.labelCoordinate, extent)) {
      end = tick.labelCoordinate - sign * (extent / 2 + minTickGap)
      tick.show = true
    }
  }
  return result.filter((tick) => tick.show)
}

let measureContext: CanvasRenderingContext2D | null | undefined
let measureFamily = 'sans-serif'
let measureFont = ''
// Widths keyed by `${font}|${text}`; cleared when full and when web fonts finish loading (widths change).
// The cap must exceed one chart's distinct labels: each axis pass re-measures every label, so a smaller cap thrashes.
const widthCache = new Map<string, number>()
const WIDTH_CACHE_LIMIT = 20_000

/** Width of a label in px at the given font size; falls back to an estimate where canvas is unavailable (SSR, tests). */
export const measureText = (text: string, fontSize: number): number => {
  if (measureContext === undefined) {
    try {
      measureContext =
        typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d')
      if (measureContext) {
        measureFamily = getComputedStyle(document.body).fontFamily || measureFamily
        document.fonts?.addEventListener?.('loadingdone', () => widthCache.clear())
      }
    } catch {
      measureContext = null
    }
  }
  if (measureContext) {
    const font = `${fontSize}px ${measureFamily}`
    const key = `${font}|${text}`
    const cached = widthCache.get(key)
    if (cached !== undefined) return cached
    if (font !== measureFont) {
      measureContext.font = font
      measureFont = font
    }
    const width = measureContext.measureText(text).width
    if (width > 0) {
      if (widthCache.size >= WIDTH_CACHE_LIMIT) widthCache.clear()
      widthCache.set(key, width)
      return width
    }
  }
  return text.length * fontSize * 0.6
}
