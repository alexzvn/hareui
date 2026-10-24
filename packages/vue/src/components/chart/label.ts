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

export type ChartLabelViewBox = ChartCartesianViewBox | ChartPolarViewBox

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
export function provideChartLabels(
  items: () => ChartLabelItem[],
  position?: ChartLabelPosition,
): void {
  provide(chartLabelSourceKey, { items, position })
}

/** Roots and series: the box a single `ChartLabel` value is placed in (plot area, pie center, …). */
export function provideChartLabelViewBox(
  viewBox: () => ChartLabelViewBox | null,
  position?: ChartLabelPosition,
): void {
  provide(chartLabelSourceKey, { viewBox, position })
}

export function useChartLabelSource(): ChartLabelSource | null {
  return inject(chartLabelSourceKey, null)
}

export function isPolarViewBox(viewBox: ChartLabelViewBox): viewBox is ChartPolarViewBox {
  return 'cx' in viewBox
}

const RADIAN = Math.PI / 180

/** Point at `radius`/`angle` around a center. */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  return { x: cx + Math.cos(-RADIAN * angle) * radius, y: cy + Math.sin(-RADIAN * angle) * radius }
}

export type ChartLabelAttrs = {
  x: number
  y: number
  textAnchor: 'start' | 'middle' | 'end'
  dominantBaseline: 'auto' | 'central' | 'hanging'
}

/** Text anchor point of a label at `position` in its view box. */
export function labelAttrs(
  viewBox: ChartLabelViewBox,
  position: ChartLabelPosition,
  offset: number,
): ChartLabelAttrs {
  if (isPolarViewBox(viewBox)) {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = viewBox
    const midAngle = (startAngle + endAngle) / 2
    const midRadius = (innerRadius + outerRadius) / 2
    if (position === 'outside') {
      const point = polarToCartesian(cx, cy, outerRadius + offset, midAngle)
      const cos = Math.cos(-RADIAN * midAngle)
      const sin = Math.sin(-RADIAN * midAngle)
      const vertical = Math.abs(cos) < 1e-6
      const textAnchor = vertical ? 'middle' : cos > 0 ? 'start' : 'end'
      // Straight up or down, the text sits above / below the point instead of across it.
      const dominantBaseline = !vertical ? 'central' : sin < 0 ? 'auto' : 'hanging'
      return { ...point, textAnchor, dominantBaseline }
    }
    if (position === 'insideStart' || position === 'insideEnd' || position === 'end') {
      const sign = endAngle >= startAngle ? 1 : -1
      const angle =
        position === 'insideStart'
          ? startAngle + (sign * (offset / Math.max(midRadius, 1))) / RADIAN
          : position === 'insideEnd'
            ? endAngle - (sign * (offset / Math.max(midRadius, 1))) / RADIAN
            : endAngle + (sign * (offset / Math.max(midRadius, 1))) / RADIAN
      return {
        ...polarToCartesian(cx, cy, midRadius, angle),
        textAnchor: 'middle',
        dominantBaseline: 'central',
      }
    }
    if (position === 'center')
      return { x: cx, y: cy, textAnchor: 'middle', dominantBaseline: 'central' }
    return {
      ...polarToCartesian(cx, cy, midRadius, midAngle),
      textAnchor: 'middle',
      dominantBaseline: 'central',
    }
  }

  const { x, y, width, height } = viewBox
  // Negative sizes (bars below the baseline / drawn leftwards) flip the outer side.
  const vSign = height >= 0 ? 1 : -1
  const hSign = width >= 0 ? 1 : -1
  const top = { y: y - vSign * offset, end: vSign > 0 ? 'auto' : 'hanging' } as const
  const bottom = { y: y + height + vSign * offset, end: vSign > 0 ? 'hanging' : 'auto' } as const
  switch (position) {
    case 'top':
      return { x: x + width / 2, y: top.y, textAnchor: 'middle', dominantBaseline: top.end }
    case 'bottom':
      return { x: x + width / 2, y: bottom.y, textAnchor: 'middle', dominantBaseline: bottom.end }
    case 'left':
      return {
        x: x - hSign * offset,
        y: y + height / 2,
        textAnchor: hSign > 0 ? 'end' : 'start',
        dominantBaseline: 'central',
      }
    case 'right':
      return {
        x: x + width + hSign * offset,
        y: y + height / 2,
        textAnchor: hSign > 0 ? 'start' : 'end',
        dominantBaseline: 'central',
      }
    case 'insideLeft':
      return {
        x: x + hSign * offset,
        y: y + height / 2,
        textAnchor: hSign > 0 ? 'start' : 'end',
        dominantBaseline: 'central',
      }
    case 'insideRight':
      return {
        x: x + width - hSign * offset,
        y: y + height / 2,
        textAnchor: hSign > 0 ? 'end' : 'start',
        dominantBaseline: 'central',
      }
    case 'insideTop':
      return {
        x: x + width / 2,
        y: y + vSign * offset,
        textAnchor: 'middle',
        dominantBaseline: vSign > 0 ? 'hanging' : 'auto',
      }
    case 'insideBottom':
      return {
        x: x + width / 2,
        y: y + height - vSign * offset,
        textAnchor: 'middle',
        dominantBaseline: vSign > 0 ? 'auto' : 'hanging',
      }
    case 'insideTopLeft':
      return {
        x: x + hSign * offset,
        y: y + vSign * offset,
        textAnchor: 'start',
        dominantBaseline: 'hanging',
      }
    case 'insideTopRight':
      return {
        x: x + width - hSign * offset,
        y: y + vSign * offset,
        textAnchor: 'end',
        dominantBaseline: 'hanging',
      }
    case 'insideBottomLeft':
      return {
        x: x + hSign * offset,
        y: y + height - vSign * offset,
        textAnchor: 'start',
        dominantBaseline: 'auto',
      }
    case 'insideBottomRight':
      return {
        x: x + width - hSign * offset,
        y: y + height - vSign * offset,
        textAnchor: 'end',
        dominantBaseline: 'auto',
      }
    default:
      return {
        x: x + width / 2,
        y: y + height / 2,
        textAnchor: 'middle',
        dominantBaseline: 'central',
      }
  }
}
