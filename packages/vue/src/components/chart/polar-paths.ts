import { arc } from 'd3-shape'

import type { ChartPolarViewBox } from './label'
import { RADIAN } from './polar-geometry'
import type { ChartPoint } from './types'

/** A pie slice or radial bar: its view box plus rounded corners. */
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

/** d3 angles: radians, 0 at 12 o'clock, clockwise. */
const toArcAngle = (angle: number) => (90 - angle) * RADIAN

/**
 * SVG path of a sector (annular when `innerRadius` > 0), relative to the sector center: render it with
 * `transform="translate(cx, cy)"`. Corners are rounded up to half the ring thickness; full rings stay plain.
 */
export const sectorPath = (sector: Omit<ChartSector, 'cx' | 'cy'>): string => {
  const innerRadius = Math.max(0, Math.min(sector.innerRadius, sector.outerRadius))
  const outerRadius = Math.max(0, sector.outerRadius)
  if (outerRadius <= 0 || sector.startAngle === sector.endAngle) return ''

  const maxCornerRadius = (outerRadius - innerRadius) / 2
  const cornerRadius = Math.min(Math.max(sector.cornerRadius ?? 0, 0), maxCornerRadius)

  const path = sectorArc({
    innerRadius,
    outerRadius,
    startAngle: toArcAngle(sector.startAngle),
    endAngle: toArcAngle(sector.endAngle),
    cornerRadius,
  })

  return path ?? ''
}

const round = (value: number) => Math.round(value * 1e4) / 1e4

const toPathPoint = (point: ChartPoint) => `${round(point.x)},${round(point.y)}`

/** Radar outline through `points`, closed back to the first one. */
export const polygonPath = (points: ChartPoint[]): string => {
  const [first] = points
  if (!first) return ''

  const outline = points.map((point, index) => `${index ? 'L' : 'M'}${toPathPoint(point)}`)

  return `${outline.join('')}L${toPathPoint(first)}Z`
}
