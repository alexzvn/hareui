import { percentValue } from './percent'
import type { ChartPoint } from './types'

// Polar angles are in degrees, 0° at 3 o'clock, positive counter-clockwise.

/** Radians per degree. */
export const RADIAN = Math.PI / 180

/** A sweep from `startAngle` to `endAngle`, in degrees. */
export type AngleSweep = {
  startAngle: number
  endAngle: number
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

/** Radius and angle (degrees, -180..180) of `point` around `center`. */
export const cartesianToPolar = (
  center: ChartPoint,
  point: ChartPoint,
): { radius: number; angle: number } => {
  const dx = point.x - center.x
  const dy = point.y - center.y
  const radius = Math.sqrt(dx * dx + dy * dy)

  // `|| 0` turns -0 (from atan2(-0, …)) into 0.
  const angle = Math.atan2(-dy, dx) / RADIAN || 0

  return { radius, angle }
}

/**
 * Center and radii of a polar chart or a pie inside `box`. `cx`/`cy` are relative to the box width/height (default:
 * its middle); radii to half its shorter side (default: 0 and 80%).
 */
export const resolvePolarGeometry = (box: PolarBox, input: PolarGeometryInput): PolarGeometry => {
  const maxRadius = Math.min(box.width, box.height) / 2

  return {
    cx: box.left + percentValue(input.cx ?? '50%', box.width, box.width / 2),
    cy: box.top + percentValue(input.cy ?? '50%', box.height, box.height / 2),
    innerRadius: percentValue(input.innerRadius ?? 0, maxRadius, 0),
    outerRadius: percentValue(input.outerRadius ?? '80%', maxRadius, maxRadius * 0.8),
  }
}

/** Signed sweep from `startAngle` to `endAngle`, at most one turn. */
export const deltaAngle = (startAngle: number, endAngle: number): number => {
  const span = endAngle - startAngle

  return Math.sign(span) * Math.min(Math.abs(span), 360)
}

/** Angular distance between two angles, 0–180°. */
export const angleDistance = (a: number, b: number): number => {
  const distance = Math.abs(a - b) % 360

  return distance > 180 ? 360 - distance : distance
}

/** True when `angle` lies on `sweep` (full turns contain every angle). */
export const angleInSweep = (angle: number, sweep: AngleSweep): boolean => {
  const { startAngle } = sweep
  const delta = deltaAngle(startAngle, sweep.endAngle)
  if (Math.abs(delta) >= 360) return true

  // Walk the sweep counter-clockwise from its lower end, whichever direction it runs.
  const from = Math.min(startAngle, startAngle + delta)
  const offset = (((angle - from) % 360) + 360) % 360

  return offset <= Math.abs(delta) + 1e-9
}
