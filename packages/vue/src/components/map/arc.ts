import { toLngLat } from './position'
import type { MapPosition } from './types'

const SEGMENTS = 64
const RADIANS = Math.PI / 180

// Web Mercator, in degrees, so the bend looks the same on screen wherever the arc is.
const toY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * RADIANS) / 2)) / RADIANS
const toLat = (y: number) => (2 * Math.atan(Math.exp(y * RADIANS)) - Math.PI / 2) / RADIANS

/** The ends of an arc and how far its middle bends sideways, as a share of the distance between them. */
type Arc = { from: MapPosition; to: MapPosition; curvature: number }

/** The points of `arc`: a quadratic curve. Arcs across the antimeridian take the short way. */
export const arcPoints = ({ from, to, curvature }: Arc): [number, number][] => {
  const [x1, lat1] = toLngLat(from)
  const [long2, lat2] = toLngLat(to)

  // Shift the end by a turn when the short way crosses the antimeridian.
  const x2 = long2 - 360 * Math.round((long2 - x1) / 360)

  const y1 = toY(lat1)
  const y2 = toY(lat2)
  const dx = x2 - x1
  const dy = y2 - y1

  // The control point: the midpoint, moved along the left normal of the chord.
  const cx = (x1 + x2) / 2 - dy * curvature
  const cy = (y1 + y2) / 2 + dx * curvature

  return Array.from({ length: SEGMENTS + 1 }, (_, index) => {
    const t = index / SEGMENTS
    const u = 1 - t
    const x = u * u * x1 + 2 * u * t * cx + t * t * x2
    const y = u * u * y1 + 2 * u * t * cy + t * t * y2

    return [x, toLat(y)]
  })
}
