import type { ChartPolarViewBox } from './label'
import { polarToCartesian } from './label'
import type { PolarGeometry } from './polar-geometry'
import { deltaAngle } from './polar-geometry'
import type { ChartPoint } from './types'

/** Geometry and spacing of a pie's slices. */
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

/** One laid-out pie slice. */
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
export const computePieSectors = (values: number[], options: PieLayoutOptions): PieSector[] => {
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

  // Negative values would sweep backwards over their neighbors; they count as empty slices.
  const clean = values.map((value) => (Number.isFinite(value) ? Math.max(0, value) : 0))
  const sum = clean.reduce((total, value) => total + value, 0)
  if (sum <= 0) return []

  const delta = deltaAngle(startAngle, endAngle)
  const sign = Math.sign(delta)
  const nonZeroCount = clean.filter((value) => value !== 0).length

  // A full pie also pads between its last and its first slice.
  const paddingCount = Math.abs(delta) >= 360 ? nonZeroCount : nonZeroCount - 1
  const totalPadding = paddingCount * paddingAngle

  // What is left of the sweep once minimum angles and padding are taken out, shared by value.
  const sharedAngle = Math.abs(delta) - nonZeroCount * minAngle - totalPadding

  const middleRadius = (innerRadius + outerRadius) / 2
  const sectors: PieSector[] = []

  clean.forEach((value, index) => {
    const isEmpty = value === 0
    const percent = value / sum
    const previous = sectors[index - 1]
    const gap = isEmpty ? 0 : paddingAngle
    const sectorStart = previous ? previous.endAngle + sign * gap : startAngle
    const sweep = (isEmpty ? 0 : minAngle) + percent * sharedAngle
    const sectorEnd = sectorStart + sign * sweep
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
