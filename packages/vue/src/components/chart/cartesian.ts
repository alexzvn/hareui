import { scaleBand, scaleLinear, scalePoint } from 'd3-scale'
import { stack as d3Stack, stackOffsetNone, stackOrderNone } from 'd3-shape'
import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject, onScopeDispose, provide, shallowReactive, watchEffect } from 'vue'

import type { ChartContext } from './context'
import { provideChartLabelViewBox } from './label'
import { percentValue } from './percent'
import type { ChartTick } from './scale'
import { measureText, resolveNumberDomain, thinTicks } from './scale'
import type {
  ChartAxisDomain,
  ChartAxisInterval,
  ChartOffset,
  ChartPoint,
  ChartSeries,
} from './types'

export type ChartAxisId = string | number

/** Axis settings registered by `ChartXAxis` / `ChartYAxis`. */
export type ChartAxisConfig = {
  axis: 'x' | 'y'
  id: ChartAxisId
  type?: 'number' | 'category'
  dataKey?: string
  domain?: ChartAxisDomain
  ticks?: (number | string)[]
  tickCount?: number
  allowDecimals?: boolean
  allowDataOverflow?: boolean
  hide?: boolean
  /** Width of a y axis / height of an x axis, in px. `'auto'` fits the widest tick label (y axes). */
  size?: number | 'auto'
  /** Tick size plus tick margin: the space between the plot and the labels, used by `size: 'auto'`. */
  tickSpace?: number
  orientation?: 'top' | 'bottom' | 'left' | 'right'
  /** Space before the first and after the last category, in px. */
  padding?: [number, number]
  reversed?: boolean
  interval?: ChartAxisInterval
  minTickGap?: number
  tickFormatter?: (value: number | string, index: number) => string
  unit?: string
  /** Tick label font size used to thin overlapping labels. */
  fontSize?: number
}

export type ResolvedAxis = {
  id: ChartAxisId
  axis: 'x' | 'y'
  type: 'number' | 'category'
  scaleType: 'point' | 'band' | 'linear'
  config: ChartAxisConfig
  hide: boolean
  orientation: 'top' | 'bottom' | 'left' | 'right'
  /** Width (y) or height (x) reserved for the axis. */
  size: number
  /** Box of the axis next to the plot area. */
  box: { x: number; y: number; width: number; height: number }
  /** Number axis: pixel position of a value. Category axis: start of the datum's band (or its point). */
  scale: (value: number) => number
  /** Pixel position of datum `index` along this axis (band center for band scales). */
  position: (index: number) => number
  /** Band width (0 for point and linear scales). */
  bandwidth: number
  domain: [number, number] | number[]
  range: [number, number]
  /** Visible ticks after overlap thinning. */
  ticks: ChartTick[]
  /** Every tick before thinning (grid lines use these). */
  allTicks: ChartTick[]
}

export type CartesianChartOptions = {
  /** Gap between bands, px or percent of the band. @defaultValue '10%' */
  barCategoryGap?: () => number | string | undefined
  /** Gap between bars of one band, px or percent. @defaultValue 4 */
  barGap?: () => number | string | undefined
  /** Default bar size, px or percent of the band. */
  barSize?: () => number | string | undefined
  /** Max bar size in px. */
  maxBarSize?: () => number | undefined
}

export type CartesianContext = {
  /** Plot area in SVG px. */
  offset: ComputedRef<ChartOffset>
  registerAxis: (get: () => ChartAxisConfig) => () => void
  axes: ComputedRef<ResolvedAxis[]>
  xAxis: (id?: ChartAxisId) => ResolvedAxis
  yAxis: (id?: ChartAxisId) => ResolvedAxis
  /** The axis data indexes run along: x in horizontal layout, y in vertical layout. */
  categoryAxis: ComputedRef<ResolvedAxis>
  /** `[base, value]` per datum (stacked: `[lower, upper]`); `null` where the value is missing. */
  seriesValues: (seriesId: string) => Array<[number, number] | null>
  /** Position and size of a bar series within its band. */
  barPosition: (seriesId: string) => { offset: number; size: number } | null
  /** True when bars lay out vertically (category on x). */
  horizontal: ComputedRef<boolean>
}

export const cartesianContextKey: InjectionKey<CartesianContext> = Symbol('hareui-cartesian-chart')

const sameId = (a: ChartAxisId | undefined, b: ChartAxisId | undefined) =>
  String(a ?? 0) === String(b ?? 0)

// Bar sizes and gaps pass non-finite values (`Infinity`, `'abc%'`) through instead of falling back, unlike polar layout.
const BAR_LENGTH = { keepNonFinite: true }

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) ? number : null
}

/** Adds axes, scales, stacking and bar layout to a chart root (area, bar, line, composed charts). */
export const useCartesianChart = (
  chart: ChartContext,
  options: CartesianChartOptions = {},
): CartesianContext => {
  const registry = shallowReactive(new Map<number, () => ChartAxisConfig>())
  let next = 0

  const registerAxis = (get: () => ChartAxisConfig) => {
    const key = next++
    registry.set(key, get)
    const unregister = () => registry.delete(key)
    onScopeDispose(unregister)
    return unregister
  }

  const horizontal = computed(() => chart.layout.value !== 'vertical')
  const visibleSeries = computed(() => chart.series.value.filter((series) => !series.hide))
  const hasBars = computed(() => visibleSeries.value.some((series) => series.kind === 'bar'))

  /** Registered axes plus implicit hidden axes for ids series use without an axis component (sparklines). */
  const configs = computed<ChartAxisConfig[]>(() => {
    const list = [...registry.values()].map((get) => get())
    const ensure = (axis: 'x' | 'y', id: ChartAxisId | undefined) => {
      if (!list.some((config) => config.axis === axis && sameId(config.id, id))) {
        const category = (axis === 'x') === horizontal.value
        list.push({ axis, id: id ?? 0, hide: true, type: category ? 'category' : 'number' })
      }
    }
    ensure('x', 0)
    ensure('y', 0)
    for (const series of chart.series.value) {
      ensure('x', series.xAxisId)
      ensure('y', series.yAxisId)
    }
    return list
  })

  // Two axes with the same id usually mean a root config prop (`x-axis`, `y-axis`) and a child `ChartXAxis` /
  // `ChartYAxis` both draw it.
  if (import.meta.env?.DEV) {
    const warned = new Set<string>()
    watchEffect(() => {
      const seen = new Set<string>()
      for (const get of registry.values()) {
        const config = get()
        const key = `${config.axis}:${String(config.id ?? 0)}`
        if (seen.has(key) && !warned.has(key)) {
          warned.add(key)
          console.warn(
            `[hareui] Two ${config.axis} axes with id "${String(config.id ?? 0)}" in one chart. When the chart root draws its axes from props, turn its axis off (\`:${config.axis}-axis="false"\`) before adding a Chart${config.axis.toUpperCase()}Axis, or give the extra axis its own id.`,
          )
        }
        seen.add(key)
      }
    })
  }

  const axisType = (config: ChartAxisConfig) =>
    config.type ?? (config.axis === 'x' ? 'category' : 'number')
  // Tick values and labels of a number axis. They depend on the data, not on the plot box.
  const numberTicks = (config: ChartAxisConfig) => {
    const data = chart.data.value
    const alongData = (config.axis === 'x') === horizontal.value && !!config.dataKey
    const extent: [number, number] = alongData
      ? (() => {
          const values = data
            .map((datum) => toNumber(datum[config.dataKey!]))
            .filter((value): value is number => value !== null)
          return values.length ? [Math.min(...values), Math.max(...values)] : [0, 0]
        })()
      : valueExtent(config.axis, config.id)
    return {
      alongData,
      ...resolveNumberDomain(extent, {
        domain: config.domain ?? (alongData ? ['auto', 'auto'] : undefined),
        ticks: config.ticks?.map(Number).filter(Number.isFinite),
        tickCount: config.tickCount,
        allowDecimals: config.allowDecimals,
        allowDataOverflow: config.allowDataOverflow,
      }),
    }
  }

  const tickText = (config: ChartAxisConfig, value: number | string, index: number) => {
    const text = config.tickFormatter ? config.tickFormatter(value, index) : String(value)
    return config.unit ? `${text}${config.unit}` : text
  }

  const categoryOf = (config: ChartAxisConfig, index: number): number | string => {
    const value = config.dataKey ? chart.data.value[index]?.[config.dataKey] : index
    return (value ?? index) as number | string
  }

  // Widest tick label plus the tick space: the width of an `'auto'` y axis.
  const autoSize = (config: ChartAxisConfig) => {
    const texts =
      axisType(config) === 'category'
        ? chart.data.value.map((_, index) => tickText(config, categoryOf(config, index), index))
        : numberTicks(config).ticks.map((value, index) => tickText(config, value, index))
    const widest = texts.reduce(
      (max, text) => Math.max(max, measureText(text, config.fontSize ?? 10)),
      0,
    )
    return Math.ceil(widest + (config.tickSpace ?? 8))
  }

  const axisSize = (config: ChartAxisConfig) => {
    if (config.hide) return 0
    if (config.size === 'auto') return config.axis === 'y' ? autoSize(config) : 30
    return config.size ?? (config.axis === 'x' ? 30 : 60)
  }
  const axisOrientation = (config: ChartAxisConfig) =>
    config.orientation ?? (config.axis === 'x' ? 'bottom' : 'left')

  const offset = computed<ChartOffset>(() => {
    const margin = chart.margin.value
    const sum = (side: string) =>
      configs.value
        .filter((config) => axisOrientation(config) === side)
        .reduce((total, config) => total + axisSize(config), 0)
    const left = margin.left + sum('left')
    const right = margin.right + sum('right')
    const top = margin.top + sum('top')
    const bottom = margin.bottom + sum('bottom')
    return {
      left,
      top,
      right,
      bottom,
      width: Math.max(chart.width.value - left - right, 0),
      height: Math.max(chart.height.value - top - bottom, 0),
    }
  })

  // Stacks: series (bars and areas alike) sharing a stackId on the same value axis, in template order.
  const stacks = computed(() => {
    const result = new Map<string, Array<[number, number] | null>>()
    const groups = new Map<string, ChartSeries[]>()
    for (const series of visibleSeries.value) {
      if (series.stackId === undefined || (series.kind !== 'area' && series.kind !== 'bar'))
        continue
      const valueAxisId = horizontal.value ? series.yAxisId : series.xAxisId
      const key = `${String(valueAxisId ?? 0)}:${String(series.stackId)}`
      groups.set(key, [...(groups.get(key) ?? []), series])
    }
    const data = chart.data.value
    for (const members of groups.values()) {
      const layers = d3Stack<Record<string, unknown>, string>()
        .keys(members.map((series) => series.id))
        .value(
          (datum, key) =>
            toNumber(datum[members.find((series) => series.id === key)!.dataKey]) ?? 0,
        )
        .order(stackOrderNone)
        .offset(stackOffsetNone)(data)
      layers.forEach((layer, layerIndex) => {
        const series = members[layerIndex]!
        result.set(
          series.id,
          layer.map((point, index) =>
            toNumber(data[index]?.[series.dataKey]) === null ? null : [point[0], point[1]],
          ),
        )
      })
    }
    return result
  })

  const rawValues = (series: ChartSeries): Array<number | null> => {
    return chart.data.value.map((datum) => toNumber(datum[series.dataKey]))
  }

  const valueExtent = (axis: 'x' | 'y', id: ChartAxisId): [number, number] => {
    let min = Infinity
    let max = -Infinity
    for (const series of visibleSeries.value) {
      if (!sameId(axis === 'x' ? series.xAxisId : series.yAxisId, id)) continue
      const stacked = stacks.value.get(series.id)
      const values = stacked
        ? stacked.flatMap((pair) => pair ?? [])
        : rawValues(series).filter((value): value is number => value !== null)
      for (const value of values) {
        if (value < min) min = value
        if (value > max) max = value
      }
    }
    return [min, max]
  }

  const axes = computed<ResolvedAxis[]>(() => {
    const plot = offset.value
    const data = chart.data.value
    const sideCursor: Record<string, number> = {
      left: plot.left,
      right: plot.left + plot.width,
      top: plot.top,
      bottom: plot.top + plot.height,
    }

    return configs.value.map((config) => {
      const type = axisType(config)
      const orientation = axisOrientation(config)
      const size = axisSize(config)
      const isX = config.axis === 'x'
      const [padStart, padEnd] = config.padding ?? [0, 0]
      let range: [number, number] = isX
        ? [plot.left + padStart, plot.left + plot.width - padEnd]
        : [plot.top + plot.height - padEnd, plot.top + padStart]
      // Category axes run top → bottom on y (first row on top).
      if (!isX && type === 'category')
        range = [plot.top + padStart, plot.top + plot.height - padEnd]
      if (config.reversed) range = [range[1], range[0]]

      let box: ResolvedAxis['box']
      if (isX) {
        const y = orientation === 'top' ? sideCursor.top! - size : sideCursor.bottom!
        if (orientation === 'top') sideCursor.top = y
        else sideCursor.bottom = y + size
        box = { x: plot.left, y, width: plot.width, height: size }
      } else {
        const x = orientation === 'right' ? sideCursor.right! : sideCursor.left! - size
        if (orientation === 'right') sideCursor.right = x + size
        else sideCursor.left = x
        box = { x, y: plot.top, width: size, height: plot.height }
      }

      const fontSize = config.fontSize ?? 10
      const format = (value: number | string, index: number) => tickText(config, value, index)
      const bounds: [number, number] = isX ? [0, chart.width.value] : [0, chart.height.value]
      const labelSize = (tick: { text: string }) =>
        isX ? measureText(tick.text, fontSize) : fontSize * 1.2
      const finish = (raw: Omit<ChartTick, 'labelCoordinate'>[]) => ({
        allTicks: raw.map((tick) => ({ ...tick, labelCoordinate: tick.coordinate })),
        ticks: thinTicks(
          raw,
          config.interval ?? 'preserveEnd',
          labelSize,
          bounds,
          config.minTickGap ?? 5,
        ),
      })

      if (type === 'category') {
        const indexes = data.map((_, index) => index)
        const band = hasBars.value
        const scale = band
          ? scaleBand<number>().domain(indexes).range(range)
          : scalePoint<number>().domain(indexes).range(range)
        const bandwidth = band ? scale.bandwidth() : 0
        const start = (index: number) => scale(index) ?? range[0]
        const position = (index: number) => start(index) + bandwidth / 2
        const tickIndexes = config.ticks?.length
          ? config.ticks
              .map((tick) =>
                indexes.find((index) => String(categoryOf(config, index)) === String(tick)),
              )
              .filter((index): index is number => index !== undefined)
          : indexes
        const raw = tickIndexes.map((index, order) => {
          const value = categoryOf(config, index)
          return { value, coordinate: position(index), index, text: format(value, order) }
        })
        return {
          id: config.id,
          axis: config.axis,
          type,
          scaleType: band ? 'band' : 'point',
          config,
          hide: !!config.hide,
          orientation,
          size,
          box,
          scale: start,
          position,
          bandwidth,
          domain: indexes,
          range,
          ...finish(raw),
        } satisfies ResolvedAxis
      }

      // Number axis. Along the category direction (e.g. a numeric x axis in a line chart) it positions data by `dataKey`.
      const { domain, ticks } = numberTicks(config)
      const scale = scaleLinear().domain(domain).range(range)
      // A row without a numeric value has no position (NaN); series skip it.
      const position = (index: number) =>
        scale(toNumber(data[index]?.[config.dataKey ?? '']) ?? Number.NaN)
      const raw = ticks.map((value, index) => ({
        value,
        coordinate: scale(value),
        index,
        text: format(value, index),
      }))
      return {
        id: config.id,
        axis: config.axis,
        type,
        scaleType: 'linear',
        config,
        hide: !!config.hide,
        orientation,
        size,
        box,
        scale: (value: number) => scale(value),
        position,
        bandwidth: 0,
        domain,
        range,
        ...finish(raw),
      } satisfies ResolvedAxis
    })
  })

  const findAxis = (axis: 'x' | 'y', id: ChartAxisId | undefined): ResolvedAxis => {
    const all = axes.value
    return (
      all.find((entry) => entry.axis === axis && sameId(entry.id, id)) ??
      all.find((entry) => entry.axis === axis)!
    )
  }

  const categoryAxis = computed(() => {
    const axis = horizontal.value ? 'x' : 'y'
    return (
      axes.value.find((entry) => entry.axis === axis && entry.type === 'category') ??
      axes.value.find((entry) => entry.axis === axis && !!entry.config.dataKey) ??
      findAxis(axis, 0)
    )
  })

  const valueAxisOf = (series: ChartSeries): ResolvedAxis => {
    return horizontal.value ? findAxis('y', series.yAxisId) : findAxis('x', series.xAxisId)
  }

  /** Default baseline: 0, clamped into the value axis domain. */
  const baseValue = (axis: ResolvedAxis): number => {
    const [a, b] = axis.domain as [number, number]
    const min = Math.min(a, b)
    const max = Math.max(a, b)
    if (min >= 0) return min
    if (max <= 0) return max
    return 0
  }

  const seriesValues = (seriesId: string): Array<[number, number] | null> => {
    const series = chart.series.value.find((entry) => entry.id === seriesId)
    if (!series) return []
    const stacked = stacks.value.get(series.id)
    if (stacked) return stacked
    const base = baseValue(valueAxisOf(series))
    return rawValues(series).map((value) => (value === null ? null : [base, value]))
  }

  // Bar slots per category axis: unstacked bars get one slot each, a stack shares one slot.
  const barLayout = computed(() => {
    const result = new Map<string, { offset: number; size: number }>()
    const category = categoryAxis.value
    const bandSize = category.bandwidth
    if (!bandSize) return result
    const slots: { ids: string[]; size?: number; max?: number }[] = []
    const stackSlots = new Map<string, { ids: string[]; size?: number; max?: number }>()
    for (const series of visibleSeries.value) {
      if (series.kind !== 'bar') continue
      const size =
        series.barSize === undefined
          ? undefined
          : percentValue(series.barSize, bandSize, 0, BAR_LENGTH)
      if (series.stackId !== undefined) {
        const key = String(series.stackId)
        const slot = stackSlots.get(key)
        if (slot) {
          slot.ids.push(series.id)
          slot.size ??= size
          slot.max ??= series.maxBarSize
          continue
        }
        const created = { ids: [series.id], size, max: series.maxBarSize }
        stackSlots.set(key, created)
        slots.push(created)
        continue
      }
      slots.push({ ids: [series.id], size, max: series.maxBarSize })
    }
    if (!slots.length) return result
    const rootSize =
      options.barSize?.() === undefined
        ? undefined
        : percentValue(options.barSize!(), bandSize, 0, BAR_LENGTH)
    for (const slot of slots) slot.size ??= rootSize
    let gap = percentValue(options.barGap?.() ?? 4, bandSize, 0, BAR_LENGTH)
    const count = slots.length
    const maxBarSize = options.maxBarSize?.()

    if (slots[0]!.size !== undefined) {
      let total = slots.reduce((sum, slot) => sum + (slot.size ?? 0), 0) + (count - 1) * gap
      let full = 0
      if (total >= bandSize) {
        total -= (count - 1) * gap
        gap = 0
      }
      if (total >= bandSize) {
        full = (bandSize / count) * 0.9
        total = count * full
      }
      let cursor = Math.trunc((bandSize - total) / 2) - gap
      let previous = 0
      for (const slot of slots) {
        const size = full || (slot.size ?? 0)
        cursor += previous + gap
        previous = size
        for (const id of slot.ids) result.set(id, { offset: cursor, size })
      }
      return result
    }

    const categoryGap = percentValue(options.barCategoryGap?.() ?? '10%', bandSize, 0, BAR_LENGTH)
    if (bandSize - 2 * categoryGap - (count - 1) * gap <= 0) gap = 0
    // A category gap over half the band leaves no room: bars collapse to 0 instead of drawing inverted.
    let original = Math.max(0, (bandSize - 2 * categoryGap - (count - 1) * gap) / count)
    if (original > 1) original = Math.trunc(original)
    slots.forEach((slot, index) => {
      const limit = slot.max ?? maxBarSize
      const size = limit !== undefined ? Math.min(original, limit) : original
      for (const id of slot.ids)
        result.set(id, {
          offset: categoryGap + (original + gap) * index + (original - size) / 2,
          size,
        })
    })
    return result
  })

  const context: CartesianContext = {
    offset,
    registerAxis,
    axes,
    xAxis: (id) => findAxis('x', id),
    yAxis: (id) => findAxis('y', id),
    categoryAxis,
    seriesValues,
    barPosition: (id) => barLayout.value.get(id) ?? null,
    horizontal,
  }

  // Axis-triggered hover: the datum nearest to the pointer along the category axis.
  chart.interaction.value = {
    trigger: 'axis',
    count: () => chart.data.value.length,
    hitTest(x, y) {
      const plot = offset.value
      if (x < plot.left || x > plot.left + plot.width || y < plot.top || y > plot.top + plot.height)
        return null
      const axis = categoryAxis.value
      const count = chart.data.value.length
      if (!count) return null
      const along = horizontal.value ? x : y
      let best = 0
      let distance = Infinity
      for (let index = 0; index < count; index++) {
        const current = Math.abs(axis.position(index) - along)
        if (current < distance) {
          distance = current
          best = index
        }
      }
      const coordinate: ChartPoint = horizontal.value
        ? { x: axis.position(best), y }
        : { x, y: axis.position(best) }
      return { index: best, coordinate }
    },
    coordinateOf(index) {
      if (index < 0 || index >= chart.data.value.length) return null
      const plot = offset.value
      const position = categoryAxis.value.position(index)
      return horizontal.value
        ? { x: position, y: plot.top + plot.height / 2 }
        : { x: plot.left + plot.width / 2, y: position }
    },
  }
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
  if (!context)
    throw new Error(
      `${component} must be used inside AreaChart, BarChart, LineChart or ComposedChart.`,
    )
  return context
}
