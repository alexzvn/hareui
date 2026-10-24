import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'

/** Rectangle a label is placed against (a bar, a point as a 0×0 box, or the plot area). */
export type ChartCartesianViewBox = {
  x: number
  y: number
  width: number
  height: number
}

/** Sector a label is placed against; angles in degrees, 0 = 3 o'clock, counter-clockwise. */
export type ChartPolarViewBox = {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
}

/** Shape a label is placed against: a rectangle (bars, points, plot area) or a sector (pie, radial bar). */
export type ChartLabelViewBox = ChartCartesianViewBox | ChartPolarViewBox

/**
 * Where a label sits relative to its view box. Rectangles use the sides (`top`, `left`, …), `inside*`
 * edges and corners, or `center`. Sectors use `outside`, `insideStart`, `insideEnd`, `end`, `center`
 * (the pie center), and fall back to the middle of the sector.
 */
export type ChartLabelPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'inside'
  | 'insideTop'
  | 'insideBottom'
  | 'insideLeft'
  | 'insideRight'
  | 'insideTopLeft'
  | 'insideTopRight'
  | 'insideBottomLeft'
  | 'insideBottomRight'
  | 'outside'
  | 'insideStart'
  | 'insideEnd'
  | 'end'

/** One label slot of a series: a datum and the shape its label is placed against. */
export type ChartLabelItem = {
  index: number
  /** Default text: the series value (or the `dataKey` value of `ChartLabel`). */
  value: number | string | undefined
  datum: Record<string, unknown>
  viewBox: ChartLabelViewBox
}

export type ChartLabelSource = {
  /** Labels per datum (inside a series), or `undefined` for a single label (directly in a root). */
  items?: () => ChartLabelItem[]
  /** Box of a single label. */
  viewBox?: () => ChartLabelViewBox | null
  /** Default `position` of labels in this source. */
  position?: ChartLabelPosition
}

const chartLabelSourceKey: InjectionKey<ChartLabelSource> = Symbol('hareui-chart-label')

/** Series: feeds `ChartLabel` children one item per datum. */
export const provideChartLabels = (
  items: () => ChartLabelItem[],
  position?: ChartLabelPosition,
): void => {
  provide(chartLabelSourceKey, { items, position })
}

/** Roots and series: the box a single `ChartLabel` value is placed in (plot area, pie center, …). */
export const provideChartLabelViewBox = (
  viewBox: () => ChartLabelViewBox | null,
  position?: ChartLabelPosition,
): void => {
  provide(chartLabelSourceKey, { viewBox, position })
}

export const useChartLabelSource = (): ChartLabelSource | null => {
  return inject(chartLabelSourceKey, null)
}

export const isPolarViewBox = (viewBox: ChartLabelViewBox): viewBox is ChartPolarViewBox => {
  return 'cx' in viewBox
}

const RADIAN = Math.PI / 180

/** Center of a polar chart, in px. */
type PolarCenter = { cx: number; cy: number }

/** A point in polar coordinates; the angle in degrees, 0 = 3 o'clock, counter-clockwise. */
type PolarCoordinate = { radius: number; angle: number }

/** Point at `radius`/`angle` around a center. */
export const polarToCartesian = (
  { cx, cy }: PolarCenter,
  { radius, angle }: PolarCoordinate,
): { x: number; y: number } => {
  return { x: cx + Math.cos(-RADIAN * angle) * radius, y: cy + Math.sin(-RADIAN * angle) * radius }
}

export type ChartLabelAttrs = {
  x: number
  y: number
  textAnchor: 'start' | 'middle' | 'end'
  dominantBaseline: 'auto' | 'central' | 'hanging'
}

type LabelPlacement = { position: ChartLabelPosition; offset: number }

type PolarEdgePosition = 'insideStart' | 'insideEnd' | 'end'

const isPolarEdgePosition = (position: ChartLabelPosition): position is PolarEdgePosition =>
  position === 'insideStart' || position === 'insideEnd' || position === 'end'

type OutsideDirection = { cos: number; sin: number; isVertical: boolean }

// Straight up or down, the text is centred on the point; otherwise it starts on the side facing away from the center.
const outsideTextAnchor = ({ cos, isVertical }: OutsideDirection) => {
  if (isVertical) return 'middle'

  return cos > 0 ? 'start' : 'end'
}

// Straight up or down, the text sits above / below the point instead of across it.
const outsideBaseline = ({ sin, isVertical }: OutsideDirection) => {
  if (!isVertical) return 'central'

  return sin < 0 ? 'auto' : 'hanging'
}

const polarOutsideLabel = (viewBox: ChartPolarViewBox, offset: number): ChartLabelAttrs => {
  const { cx, cy, outerRadius, startAngle, endAngle } = viewBox
  const midAngle = (startAngle + endAngle) / 2
  const point = polarToCartesian({ cx, cy }, { radius: outerRadius + offset, angle: midAngle })
  const cos = Math.cos(-RADIAN * midAngle)
  const direction = { cos, sin: Math.sin(-RADIAN * midAngle), isVertical: Math.abs(cos) < 1e-6 }

  return {
    ...point,
    textAnchor: outsideTextAnchor(direction),
    dominantBaseline: outsideBaseline(direction),
  }
}

const polarEdgeAngle = (
  position: PolarEdgePosition,
  { startAngle, endAngle, shift }: { startAngle: number; endAngle: number; shift: number },
): number => {
  if (position === 'insideStart') return startAngle + shift
  if (position === 'insideEnd') return endAngle - shift

  return endAngle + shift
}

const polarLabelAttrs = (
  viewBox: ChartPolarViewBox,
  { position, offset }: LabelPlacement,
): ChartLabelAttrs => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = viewBox
  const midAngle = (startAngle + endAngle) / 2
  const midRadius = (innerRadius + outerRadius) / 2
  if (position === 'outside') return polarOutsideLabel(viewBox, offset)

  if (isPolarEdgePosition(position)) {
    const sign = endAngle >= startAngle ? 1 : -1
    const shift = (sign * (offset / Math.max(midRadius, 1))) / RADIAN
    const angle = polarEdgeAngle(position, { startAngle, endAngle, shift })

    return {
      ...polarToCartesian({ cx, cy }, { radius: midRadius, angle }),
      textAnchor: 'middle',
      dominantBaseline: 'central',
    }
  }

  if (position === 'center')
    return { x: cx, y: cy, textAnchor: 'middle', dominantBaseline: 'central' }

  return {
    ...polarToCartesian({ cx, cy }, { radius: midRadius, angle: midAngle }),
    textAnchor: 'middle',
    dominantBaseline: 'central',
  }
}

// Negative sizes (bars below the baseline / drawn leftwards) flip the outer side: `hSign`/`vSign` are -1 then.
type CartesianLabelFrame = ChartCartesianViewBox & { offset: number; hSign: 1 | -1; vSign: 1 | -1 }

const cartesianCenterLabel = ({ x, y, width, height }: CartesianLabelFrame): ChartLabelAttrs => ({
  x: x + width / 2,
  y: y + height / 2,
  textAnchor: 'middle',
  dominantBaseline: 'central',
})

// Positions not listed (`center`, `inside` and the polar-only ones) center the label in the box.
const cartesianLabels: Partial<
  Record<ChartLabelPosition, (frame: CartesianLabelFrame) => ChartLabelAttrs>
> = {
  top: ({ x, y, width, offset, vSign }) => ({
    x: x + width / 2,
    y: y - vSign * offset,
    textAnchor: 'middle',
    dominantBaseline: vSign > 0 ? 'auto' : 'hanging',
  }),
  bottom: ({ x, y, width, height, offset, vSign }) => ({
    x: x + width / 2,
    y: y + height + vSign * offset,
    textAnchor: 'middle',
    dominantBaseline: vSign > 0 ? 'hanging' : 'auto',
  }),
  left: ({ x, y, height, offset, hSign }) => ({
    x: x - hSign * offset,
    y: y + height / 2,
    textAnchor: hSign > 0 ? 'end' : 'start',
    dominantBaseline: 'central',
  }),
  right: ({ x, y, width, height, offset, hSign }) => ({
    x: x + width + hSign * offset,
    y: y + height / 2,
    textAnchor: hSign > 0 ? 'start' : 'end',
    dominantBaseline: 'central',
  }),
  insideLeft: ({ x, y, height, offset, hSign }) => ({
    x: x + hSign * offset,
    y: y + height / 2,
    textAnchor: hSign > 0 ? 'start' : 'end',
    dominantBaseline: 'central',
  }),
  insideRight: ({ x, y, width, height, offset, hSign }) => ({
    x: x + width - hSign * offset,
    y: y + height / 2,
    textAnchor: hSign > 0 ? 'end' : 'start',
    dominantBaseline: 'central',
  }),
  insideTop: ({ x, y, width, offset, vSign }) => ({
    x: x + width / 2,
    y: y + vSign * offset,
    textAnchor: 'middle',
    dominantBaseline: vSign > 0 ? 'hanging' : 'auto',
  }),
  insideBottom: ({ x, y, width, height, offset, vSign }) => ({
    x: x + width / 2,
    y: y + height - vSign * offset,
    textAnchor: 'middle',
    dominantBaseline: vSign > 0 ? 'auto' : 'hanging',
  }),
  insideTopLeft: ({ x, y, offset, hSign, vSign }) => ({
    x: x + hSign * offset,
    y: y + vSign * offset,
    textAnchor: 'start',
    dominantBaseline: 'hanging',
  }),
  insideTopRight: ({ x, y, width, offset, hSign, vSign }) => ({
    x: x + width - hSign * offset,
    y: y + vSign * offset,
    textAnchor: 'end',
    dominantBaseline: 'hanging',
  }),
  insideBottomLeft: ({ x, y, height, offset, hSign, vSign }) => ({
    x: x + hSign * offset,
    y: y + height - vSign * offset,
    textAnchor: 'start',
    dominantBaseline: 'auto',
  }),
  insideBottomRight: ({ x, y, width, height, offset, hSign, vSign }) => ({
    x: x + width - hSign * offset,
    y: y + height - vSign * offset,
    textAnchor: 'end',
    dominantBaseline: 'auto',
  }),
}

/** Text anchor point of a label at `position` in its view box. */
export const labelAttrs = (
  viewBox: ChartLabelViewBox,
  placement: LabelPlacement,
): ChartLabelAttrs => {
  if (isPolarViewBox(viewBox)) return polarLabelAttrs(viewBox, placement)

  const frame: CartesianLabelFrame = {
    ...viewBox,
    offset: placement.offset,
    hSign: viewBox.width >= 0 ? 1 : -1,
    vSign: viewBox.height >= 0 ? 1 : -1,
  }

  const place = cartesianLabels[placement.position] ?? cartesianCenterLabel

  return place(frame)
}
