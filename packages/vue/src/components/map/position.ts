import type { MapPoint, MapPosition } from './types'

/** `position` as `{ long, lat }`. */
export const toPoint = (position: MapPosition): MapPoint =>
  Array.isArray(position)
    ? { long: position[0], lat: position[1] }
    : { long: position.long, lat: position.lat }

/** `position` as the `[long, lat]` tuple maplibre-gl reads. */
export const toLngLat = (position: MapPosition): [number, number] =>
  Array.isArray(position) ? [position[0], position[1]] : [position.long, position.lat]

/** `point` in the same form as `like`: a tuple for a tuple, an object for an object. */
export const toPositionLike = <P extends MapPosition>(point: MapPoint, like: P): P =>
  (Array.isArray(like)
    ? [point.long, point.lat]
    : { ...like, long: point.long, lat: point.lat }) as P

/** Whether two positions are the same place. */
export const isSamePosition = (a: MapPosition, b: MapPosition) => {
  const [aLong, aLat] = toLngLat(a)
  const [bLong, bLat] = toLngLat(b)

  return aLong === bLong && aLat === bLat
}
