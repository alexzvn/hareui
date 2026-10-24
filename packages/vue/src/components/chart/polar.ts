import { arc } from 'd3-shape'
import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject, onScopeDispose, provide, shallowReactive, watchEffect } from 'vue'

import type { ChartContext } from './context'
import type { ChartPolarViewBox } from './label'
import { polarToCartesian } from './label'
import { percentValue } from './percent'
import { resolveNumberDomain } from './scale'
import type { ChartLegendItem, ChartSlice } from './series-config'
import type { ChartAxisDomain, ChartDatum, ChartPoint } from './types'

// Polar angles are in degrees, 0° at 3 o'clock, positive counter-clockwise.

export { polarToCartesian }

const RADIAN = Math.PI / 180

/** Radius and angle (degrees, -180..180) of a point around a center. */
export function cartesianToPolar(
  cx: number,
  cy: number,
  x: number,
  y: number,
): { radius: number; angle: number } {
  const dx = x - cx
  const dy = y - cy
  // `|| 0` turns -0 (from atan2(-0, …)) into 0.
  return { radius: Math.sqrt(dx * dx + dy * dy), angle: Math.atan2(-dy, dx) / RADIAN || 0 }
}

/** Plot area of a polar chart: the chart minus its margins. */
export type PolarBox = {
  left: number
  top: number
  width: number
  height: number
}

/** Center and radii as given on a root or a `ChartPie`: px, or percentage strings. */
export type PolarGeometryInput = {
  cx?: number | string
  cy?: number | string
  innerRadius?: number | string
  outerRadius?: number | string
}

/** Center and radii in px. */
export type PolarGeometry = {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
}

/**
 * Center and radii of a polar chart or a pie inside `box`. `cx`/`cy` are relative to the box width/height (default:
 * its middle); radii to half its shorter side (default: 0 and 80%).
 */
export function resolvePolarGeometry(box: PolarBox, input: PolarGeometryInput): PolarGeometry {
  const maxRadius = Math.min(box.width, box.height) / 2
  return {
    cx: box.left + percentValue(input.cx ?? '50%', box.width, box.width / 2),
    cy: box.top + percentValue(input.cy ?? '50%', box.height, box.height / 2),
    innerRadius: percentValue(input.innerRadius ?? 0, maxRadius, 0),
    outerRadius: percentValue(input.outerRadius ?? '80%', maxRadius, maxRadius * 0.8),
  }
}

/** Signed sweep from `startAngle` to `endAngle`, at most one turn. */
export function deltaAngle(startAngle: number, endAngle: number): number {
  return Math.sign(endAngle - startAngle) * Math.min(Math.abs(endAngle - startAngle), 360)
}

/** Angular distance between two angles, 0–180°. */
function angleDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

/** True when `angle` lies on the sweep from `startAngle` to `endAngle` (full turns contain every angle). */
export function angleInSweep(angle: number, startAngle: number, endAngle: number): boolean {
  const sweep = deltaAngle(startAngle, endAngle)
  if (Math.abs(sweep) >= 360) return true
  const from = Math.min(startAngle, startAngle + sweep)
  const offset = (((angle - from) % 360) + 360) % 360
  return offset <= Math.abs(sweep) + 1e-9
}

/**
 * Text placement of an angle axis label: anchored away from the center
 * horizontally, and above / below the spoke only at the top and bottom of the circle.
 */
export function angleTickAnchor(
  angle: number,
  orientation: 'outer' | 'inner' = 'outer',
): { textAnchor: 'start' | 'middle' | 'end'; dy: string } {
  const cos = Math.cos(-RADIAN * angle)
  const sin = Math.sin(-RADIAN * angle)
  const outer = orientation === 'outer'
  const eps = 1e-5
  const textAnchor =
    cos > eps ? (outer ? 'start' : 'end') : cos < -eps ? (outer ? 'end' : 'start') : 'middle'
  if (Math.abs(cos) > eps) return { textAnchor, dy: '0.355em' }
  // Top of the circle: text sits above the point; bottom: below it.
  const above = outer ? sin < 0 : sin > 0
  return { textAnchor, dy: above ? '0em' : '0.71em' }
}

export type ChartSector = {
  cornerRadius?: number
} & ChartPolarViewBox

const sectorArc = arc<{
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  cornerRadius: number
}>().cornerRadius((d) => d.cornerRadius)

/**
 * SVG path of a sector (annular when `innerRadius` > 0), relative to the sector center: render it with
 * `transform="translate(cx, cy)"`. Corners are rounded up to half the ring thickness; full rings stay plain.
 */
export function sectorPath(sector: Omit<ChartSector, 'cx' | 'cy'>): string {
  const innerRadius = Math.max(0, Math.min(sector.innerRadius, sector.outerRadius))
  const outerRadius = Math.max(0, sector.outerRadius)
  if (outerRadius <= 0 || sector.startAngle === sector.endAngle) return ''
  const cornerRadius = Math.min(
    Math.max(sector.cornerRadius ?? 0, 0),
    (outerRadius - innerRadius) / 2,
  )
  // d3: radians, 0 at 12 o'clock, clockwise.
  return (
    sectorArc({
      innerRadius,
      outerRadius,
      startAngle: (90 - sector.startAngle) * RADIAN,
      endAngle: (90 - sector.endAngle) * RADIAN,
      cornerRadius,
    }) ?? ''
  )
}

// ── Pie ────────────────────────────────────────────────────────────────────

export type PieLayoutOptions = {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  /** Degrees between sectors; negative values overlap them. */
  paddingAngle?: number
  /** Minimum sweep of a non-zero sector. */
  minAngle?: number
}

export type PieSector = {
  index: number
  value: number
  /** Share of the total, 0–1. */
  percent: number
  midAngle: number
  middleRadius: number
  /** Tooltip anchor: the middle of the sector. */
  tooltipPosition: ChartPoint
} & ChartPolarViewBox

/** A pie's slices plus the sweep they share, so hover can tell padding gaps from the open part of a half pie. */
export type PieItemGroup = {
  sectors: PieSector[]
  startAngle: number
  endAngle: number
  /** Center and radii the pie is drawn with (also when it has no sectors). */
  geometry: PolarGeometry
}

/** Sector angles of a pie, including padding and minimum angles. */
export function computePieSectors(values: number[], options: PieLayoutOptions): PieSector[] {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    paddingAngle = 0,
    minAngle = 0,
  } = options
  const delta = deltaAngle(startAngle, endAngle)
  const sign = Math.sign(delta)
  // Negative values would sweep backwards over their neighbors; they count as empty slices.
  const clean = values.map((value) => (Number.isFinite(value) ? Math.max(0, value) : 0))
  const nonZero = clean.filter((value) => value !== 0).length
  const totalPadding = (Math.abs(delta) >= 360 ? nonZero : nonZero - 1) * paddingAngle
  const realTotalAngle = Math.abs(delta) - nonZero * minAngle - totalPadding
  const sum = clean.reduce((total, value) => total + value, 0)
  if (sum <= 0) return []
  const middleRadius = (innerRadius + outerRadius) / 2
  const sectors: PieSector[] = []
  clean.forEach((value, index) => {
    const percent = value / sum
    const previous = sectors[index - 1]
    const sectorStart = previous
      ? previous.endAngle + sign * paddingAngle * (value !== 0 ? 1 : 0)
      : startAngle
    const sectorEnd = sectorStart + sign * ((value !== 0 ? minAngle : 0) + percent * realTotalAngle)
    const midAngle = (sectorStart + sectorEnd) / 2
    sectors.push({
      index,
      value,
      percent,
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle: sectorStart,
      endAngle: sectorEnd,
      midAngle,
      middleRadius,
      tooltipPosition: polarToCartesian(cx, cy, middleRadius, midAngle),
    })
  })
  return sectors
}

// ── Bars on a radial band ──────────────────────────────────────────────────

export type RadialBarSizing = {
  barSize?: number | string
  maxBarSize?: number
}

/**
 * Offset and thickness of each bar inside a band: fixed sizes are centered
 * with `barGap` between them, otherwise `barCategoryGap` is left on both sides and the rest is shared.
 */
export function bandBarPositions(
  bandSize: number,
  bars: RadialBarSizing[],
  options: {
    barSize?: number | string
    barGap?: number | string
    barCategoryGap?: number | string
    maxBarSize?: number
  } = {},
): Array<{ offset: number; size: number }> {
  const count = bars.length
  if (!count || bandSize <= 0) return bars.map(() => ({ offset: 0, size: 0 }))
  let gap = percentValue(options.barGap ?? 4, bandSize, 0)
  const sizes = bars.map((bar) => bar.barSize ?? options.barSize)
  const fixed =
    sizes[0] !== undefined && Number.isFinite(percentValue(sizes[0], bandSize, Number.NaN))
  if (fixed) {
    const resolved = sizes.map((size) => percentValue(size, bandSize, 0))
    let sum = resolved.reduce((total, size) => total + size, 0) + (count - 1) * gap
    if (sum >= bandSize) {
      sum -= (count - 1) * gap
      gap = 0
    }
    let fullSize = bandSize / count
    let useFull = false
    if (sum >= bandSize && fullSize > 0) {
      useFull = true
      fullSize *= 0.9
      sum = count * fullSize
    }
    // The centering offset is truncated to an integer, which keeps bar edges on whole pixels.
    let offset = Math.trunc((bandSize - sum) / 2) - gap
    let previousSize = 0
    return resolved.map((size) => {
      offset += previousSize + gap
      previousSize = useFull ? fullSize : size
      return { offset, size: previousSize }
    })
  }
  const categoryGap = percentValue(options.barCategoryGap ?? '10%', bandSize, 0)
  if (bandSize - 2 * categoryGap - (count - 1) * gap <= 0) gap = 0
  let originalSize = Math.max(0, (bandSize - 2 * categoryGap - (count - 1) * gap) / count)
  if (originalSize > 1) originalSize = Math.trunc(originalSize)
  return bars.map((bar, index) => {
    const max = bar.maxBarSize ?? options.maxBarSize
    const size = max !== undefined ? Math.min(originalSize, max) : originalSize
    return { offset: categoryGap + (originalSize + gap) * index + (originalSize - size) / 2, size }
  })
}

// ── Polar context ──────────────────────────────────────────────────────────

export type PolarChartKind = 'pie' | 'radar' | 'radialBar'

export type PolarAngleAxisConfig = {
  dataKey?: string
  /** `category` spreads the data evenly around the circle; `number` maps values onto the sweep. */
  type?: 'category' | 'number'
  domain?: ChartAxisDomain
  tickCount?: number
  allowDecimals?: boolean
  allowDataOverflow?: boolean
  ticks?: number[]
  reversed?: boolean
}

export type PolarRadiusAxisConfig = {
  dataKey?: string
  type?: 'category' | 'number'
  domain?: ChartAxisDomain
  tickCount?: number
  allowDecimals?: boolean
  allowDataOverflow?: boolean
  ticks?: number[]
  reversed?: boolean
}

export type PolarTick = {
  value: number | string
  index: number
  /** Angle in degrees (angle axis) or radius in px (radius axis). */
  coordinate: number
}

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

/** Props of the `#center` slot of PieChart and RadialChart. */
export type ChartPolarCenterSlotProps = {
  /** Sum of the visible slice (or ring) values. */
  total: number
  /** Hovered or focused slice (or ring), or `null`. */
  active: ChartLegendItem | null
}

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
  registerAngleAxis: (get: () => PolarAngleAxisConfig) => () => void
  registerRadiusAxis: (get: () => PolarRadiusAxisConfig) => () => void
  /** Radial bar charts: offset and thickness of a series' bars inside each ring band. */
  radialBarPosition: (seriesId: string) => { offset: number; size: number }
  /**
   * Item-triggered series (pie): the slices, the sweep and the geometry of each pie, for hover, keyboard navigation and
   * the center.
   */
  registerItems: (seriesId: string, get: () => PieItemGroup) => () => void
  /** Total and hovered slice for the `#center` slot. */
  center: ComputedRef<ChartPolarCenterSlotProps>
}

export const polarContextKey: InjectionKey<PolarContext> = Symbol('hareui-chart-polar')

const DEFAULTS: Record<PolarChartKind, { startAngle: number; endAngle: number }> = {
  pie: { startAngle: 0, endAngle: 360 },
  radar: { startAngle: 90, endAngle: -270 },
  radialBar: { startAngle: 0, endAngle: 360 },
}

function numbersOf(data: ChartDatum[], keys: string[]): number[] {
  const values: number[] = []
  for (const datum of data) {
    for (const key of keys) {
      const value = Number(datum[key])
      if (datum[key] !== undefined && datum[key] !== '' && Number.isFinite(value))
        values.push(value)
    }
  }
  return values
}

function categoryAxis(
  count: number,
  range: [number, number],
  data: ChartDatum[],
  dataKey: string | undefined,
  reversed = false,
  centered = false,
): ResolvedPolarAxis {
  const [start, end] = reversed ? [range[1], range[0]] : range
  const bandwidth = count ? (end - start) / count : 0
  const at = (index: number) => start + index * bandwidth
  const domain = data.map((datum, index) => (dataKey ? (datum[dataKey] ?? index) : index))
  return {
    type: 'category',
    dataKey,
    range,
    domain,
    bandwidth: Math.abs(bandwidth),
    scale: at,
    at,
    ticks: domain.map((value, index) => ({
      value,
      index,
      coordinate: at(index) + (centered ? bandwidth / 2 : 0),
    })),
  }
}

function numberAxis(
  values: number[],
  range: [number, number],
  config: Partial<PolarRadiusAxisConfig>,
  fallbackDomain: ChartAxisDomain,
): ResolvedPolarAxis {
  const extent: [number, number] = values.length
    ? [Math.min(...values), Math.max(...values)]
    : [0, 0]
  const { domain, ticks } = resolveNumberDomain(extent, {
    domain: config.domain ?? fallbackDomain,
    tickCount: config.tickCount ?? 5,
    allowDecimals: config.allowDecimals ?? true,
    allowDataOverflow: config.allowDataOverflow ?? false,
    ticks: config.ticks,
  })
  const [start, end] = config.reversed ? [range[1], range[0]] : range
  const span = domain[1] - domain[0]
  const scale = (value: number) =>
    span === 0 ? start : start + ((value - domain[0]) / span) * (end - start)
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

/**
 * Polar layout of a chart root (PieChart, RadarChart, RadialChart): center and radii, angle and radius
 * axes, radial bar bands, and the tooltip interaction. Call in the root's setup after `useChartRoot`.
 */
export function usePolarChart(chart: ChartContext, options: PolarChartOptions): PolarContext {
  const { kind } = options
  const angleAxes = shallowReactive(new Map<number, () => PolarAngleAxisConfig>())
  const radiusAxes = shallowReactive(new Map<number, () => PolarRadiusAxisConfig>())
  const items = shallowReactive(new Map<string, () => PieItemGroup>())
  let nextKey = 0

  function register<T>(map: Map<number, T>, get: T) {
    const key = nextKey++
    map.set(key, get)
    const unregister = () => map.delete(key)
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
  const geometry = computed(
    () => (kind === 'pie' ? [...items.values()][0]?.().geometry : undefined) ?? rootGeometry.value,
  )
  const cx = computed(() => geometry.value.cx)
  const cy = computed(() => geometry.value.cy)
  const innerRadius = computed(() => geometry.value.innerRadius)
  const outerRadius = computed(() => geometry.value.outerRadius)
  const startAngle = computed(() => options.startAngle?.() ?? DEFAULTS[kind].startAngle)
  const endAngle = computed(() => options.endAngle?.() ?? DEFAULTS[kind].endAngle)

  const visibleSeries = computed(() =>
    chart.series.value.filter(
      (series) => !series.hide && (series.kind === 'radar' || series.kind === 'radialBar'),
    ),
  )
  const seriesValues = computed(() =>
    numbersOf(
      chart.data.value,
      visibleSeries.value.map((series) => series.dataKey),
    ),
  )

  // A chart has one angle axis and one radius axis; extra axes are ignored.
  const angleConfig = computed(() => [...angleAxes.values()][0]?.())
  const radiusConfig = computed(() => [...radiusAxes.values()][0]?.())

  const angleAxis = computed<ResolvedPolarAxis>(() => {
    const config = angleConfig.value
    const range: [number, number] = [
      startAngle.value,
      startAngle.value + deltaAngle(startAngle.value, endAngle.value),
    ]
    const type = config?.type ?? (kind === 'radialBar' ? 'number' : 'category')
    if (type === 'category')
      return categoryAxis(
        chart.data.value.length,
        range,
        chart.data.value,
        config?.dataKey,
        config?.reversed,
      )
    // Radial bars fill the sweep up to the largest value; no rounding of the domain.
    return numberAxis(seriesValues.value, range, config ?? {}, [0, 'dataMax'])
  })

  const radiusAxis = computed<ResolvedPolarAxis>(() => {
    const config = radiusConfig.value
    const range: [number, number] = [innerRadius.value, outerRadius.value]
    const type = config?.type ?? (kind === 'radialBar' ? 'category' : 'number')
    if (type === 'category')
      return categoryAxis(
        chart.data.value.length,
        range,
        chart.data.value,
        config?.dataKey,
        config?.reversed,
        true,
      )
    return numberAxis(seriesValues.value, range, config ?? {}, [0, 'auto'])
  })

  const barPositions = computed(() => {
    const bars = visibleSeries.value.filter((series) => series.kind === 'radialBar')
    const positions = bandBarPositions(
      radiusAxis.value.bandwidth,
      bars.map((bar) => ({ barSize: bar.barSize, maxBarSize: bar.maxBarSize })),
      {
        barSize: options.barSize?.(),
        barGap: options.barGap?.(),
        barCategoryGap: options.barCategoryGap?.(),
        maxBarSize: options.maxBarSize?.(),
      },
    )
    return new Map(bars.map((bar, index) => [bar.id, positions[index]!]))
  })

  // Generated mode reads the resolved slices (the chart data holds only the visible ones, so the active index
  // points into them). Composition mode sums the hovered pie, or the first visible pie or radial bar.
  const center = computed<ChartPolarCenterSlotProps>(() => {
    const index = chart.active.index
    const slices = options.slices?.()
    if (slices) {
      const visible = slices.filter((slice) => !slice.hidden)
      const slice = index === null ? undefined : visible[index]
      return {
        total: visible.reduce((sum, item) => sum + item.value, 0),
        active: slice
          ? {
              key: slice.key,
              name: slice.name,
              color: slice.color,
              hidden: false,
              value: slice.value,
              percent: slice.percent,
            }
          : null,
      }
    }
    const series =
      chart.series.value.find((item) => item.id === chart.active.seriesId) ??
      chart.series.value.find(
        (item) => !item.hide && (item.kind === 'pie' || item.kind === 'radialBar'),
      )
    if (!series) return { total: 0, active: null }
    const count =
      series.kind === 'pie'
        ? (items.get(series.id)?.().sectors.length ?? 0)
        : chart.data.value.length
    const entries = Array.from(
      { length: count },
      (_, position) => chart.payloadAt(position, series.id)[0],
    )
    const valueOf = (raw: unknown) => (Number.isFinite(Number(raw)) ? Number(raw) : 0)
    const total = entries.reduce((sum, entry) => sum + valueOf(entry?.value), 0)
    const entry = index === null ? undefined : entries[index]
    if (!entry) return { total, active: null }
    const value = valueOf(entry.value)
    return {
      total,
      active: {
        key: entry.name,
        name: entry.name,
        color: entry.color,
        hidden: false,
        value,
        percent: total === 0 ? 0 : (value / total) * 100,
      },
    }
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
    registerAngleAxis: (get) => register(angleAxes, get),
    registerRadiusAxis: (get) => register(radiusAxes, get),
    radialBarPosition: (seriesId) => barPositions.value.get(seriesId) ?? { offset: 0, size: 0 },
    registerItems: (seriesId, get) => {
      items.set(seriesId, get)
      const unregister = () => items.delete(seriesId)
      onScopeDispose(unregister)
      return unregister
    },
    center,
  }

  /**
   * Row under a point. Radar snaps to the nearest spoke anywhere on the chart, so the tooltip stays
   * up between spokes; radial bars use the ring band under the pointer and return `null` outside the rings.
   */
  function hitTest(x: number, y: number) {
    const { radius, angle } = cartesianToPolar(cx.value, cy.value, x, y)
    const [r0, r1] = radiusAxis.value.range
    if (
      kind !== 'radar' &&
      (radius < Math.min(r0, r1) ||
        radius > Math.max(r0, r1) ||
        !angleInSweep(angle, startAngle.value, endAngle.value))
    )
      return null
    const count = chart.data.value.length
    if (!count) return null
    let index: number
    if (kind === 'radar') {
      const axis = angleAxis.value
      index = 0
      let best = Infinity
      for (let i = 0; i < count; i++) {
        const distance = angleDistance(angle, axis.at(i))
        if (distance < best) {
          best = distance
          index = i
        }
      }
    } else {
      const axis = radiusAxis.value
      const step = (axis.range[1] - axis.range[0]) / count
      index = Math.min(count - 1, Math.max(0, Math.floor((radius - axis.range[0]) / step)))
    }
    return { index, coordinate: { x, y } }
  }

  /**
   * Slice under a point. Inside a pie's ring band, or in the space between two nested rings, the slice with
   * the nearest angle wins, so the tooltip stays up across padding gaps. The hole and the outside return `null`.
   */
  function pieHitTest(x: number, y: number) {
    const pies = chart.series.value.flatMap((series) => {
      const group = items.get(series.id)?.()
      const first = group?.sectors[0]
      if (!group || !first) return []
      const { radius, angle } = cartesianToPolar(first.cx, first.cy, x, y)
      if (!angleInSweep(angle, group.startAngle, group.endAngle)) return []
      const inner = Math.min(first.innerRadius, first.outerRadius)
      const outer = Math.max(first.innerRadius, first.outerRadius)
      const distance = radius < inner ? inner - radius : radius > outer ? radius - outer : 0
      return [
        { seriesId: series.id, sectors: group.sectors, angle, distance, beyond: radius > outer },
      ]
    })
    // Pies later in the template draw on top, so they win where bands overlap.
    let pie = pies.filter((item) => item.distance === 0).at(-1)
    if (!pie) {
      // Between nested rings: one band lies inside the pointer and another outside it.
      const below = pies
        .filter((item) => item.beyond)
        .reduce<(typeof pies)[number] | undefined>(
          (best, item) => (!best || item.distance < best.distance ? item : best),
          undefined,
        )
      const above = pies
        .filter((item) => !item.beyond)
        .reduce<(typeof pies)[number] | undefined>(
          (best, item) => (!best || item.distance < best.distance ? item : best),
          undefined,
        )
      if (!below || !above) return null
      // The ring the pointer came from keeps the tooltip until the pointer reaches the other one, so it doesn't flicker midway.
      pie =
        [below, above].find((item) => item.seriesId === chart.active.seriesId) ??
        (below.distance <= above.distance ? below : above)
    }
    let hit: PieSector | undefined
    let best = Infinity
    for (const sector of pie.sectors) {
      if (sector.startAngle === sector.endAngle) continue
      const distance = angleInSweep(pie.angle, sector.startAngle, sector.endAngle)
        ? 0
        : Math.min(
            angleDistance(pie.angle, sector.startAngle),
            angleDistance(pie.angle, sector.endAngle),
          )
      // `<=`: overlapping slices (negative padding) resolve to the later one, which is drawn on top.
      if (distance <= best) {
        best = distance
        hit = sector
      }
    }
    return hit
      ? { index: hit.index, seriesId: pie.seriesId, coordinate: hit.tooltipPosition }
      : null
  }

  /** Every pie slice in keyboard order: pies in template order, slices in data order. */
  function pieItems() {
    return chart.series.value.flatMap((series) => {
      const get = items.get(series.id)
      return get
        ? get().sectors.map((sector) => ({
            seriesId: series.id,
            index: sector.index,
            coordinate: sector.tooltipPosition,
          }))
        : []
    })
  }

  function coordinateOf(index: number): ChartPoint | null {
    if (kind === 'pie') return pieItems()[index]?.coordinate ?? null
    if (kind === 'radar') {
      // Anchor at the first visible radar's point, where its active dot is drawn.
      const angle = angleAxis.value.at(index)
      const datum = chart.data.value[index]
      const raw = visibleSeries.value
        .map((series) => datum?.[series.dataKey])
        .find((value) => value !== undefined && value !== '' && Number.isFinite(Number(value)))
      const radius = raw === undefined ? outerRadius.value : radiusAxis.value.scale(Number(raw))
      return polarToCartesian(cx.value, cy.value, radius, angle)
    }
    const band = radiusAxis.value
    return polarToCartesian(
      cx.value,
      cy.value,
      band.at(index) + band.bandwidth / 2,
      startAngle.value,
    )
  }

  chart.interaction.value = {
    trigger: kind === 'pie' ? 'item' : 'axis',
    hitTest: kind === 'pie' ? pieHitTest : hitTest,
    items: kind === 'pie' ? pieItems : undefined,
    coordinateOf,
    count: () => (kind === 'pie' ? pieItems().length : chart.data.value.length),
  }
  // Radar and radial rows come from the chart data: a shorter array drops an active row that no longer exists.
  if (kind !== 'pie') {
    watchEffect(() => {
      const index = chart.active.index
      if (index !== null && index >= chart.data.value.length) chart.setActive(null)
    })
  }
  chart.tooltipLabel.value = (index) => {
    if (kind !== 'radar') return undefined
    const key = angleConfig.value?.dataKey
    const value = key ? chart.data.value[index]?.[key] : undefined
    return value ?? undefined
  }

  provide(polarContextKey, context)
  return context
}

/** The enclosing polar root's layout. Throws outside PieChart, RadarChart and RadialChart. */
export function usePolarContext(component = 'Polar chart part'): PolarContext {
  const context = inject(polarContextKey, null)
  if (!context)
    throw new Error(`${component} must be used inside a PieChart, RadarChart or RadialChart.`)
  return context
}

/** Radar outline through `points`, closed back to the first one. */
export function polygonPath(points: ChartPoint[]): string {
  if (!points.length) return ''
  const round = (value: number) => Math.round(value * 1e4) / 1e4
  return `${points.map((point, index) => `${index ? 'L' : 'M'}${round(point.x)},${round(point.y)}`).join('')}L${round(points[0]!.x)},${round(points[0]!.y)}Z`
}
