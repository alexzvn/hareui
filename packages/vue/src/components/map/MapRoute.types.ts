import type { MapColor, MapLineType, MapPoint, MapPosition } from './types'

/** Line style props shared by `MapRoute` and `MapArc`. */
export type MapLineStyleProps = {
  /** The line color. */
  color?: MapColor
  /** The line width in pixels. */
  width?: number
  /** The line opacity, from 0 to 1. Hovering a line that listens to `click` or `hover` draws it opaque. */
  opacity?: number
  /**
   * How the line is drawn.
   * @defaultValue 'solid'
   */
  type?: MapLineType
}

/** Props of `MapRoute`: a line through a list of positions, such as a path from a routing service. */
export type MapRouteProps = MapLineStyleProps & {
  /** The positions the line goes through, in order. */
  points: MapPosition[]
}

/** Events of `MapRoute`, `MapArc` and `MapPolygon`. Listening to one makes the shape react to the pointer. */
export type MapLineEmits = {
  /** The shape was clicked, at `position`. */
  click: [position: MapPoint, event: MouseEvent]
  /** The pointer moved onto the shape (`true`) or off it (`false`). */
  hover: [isHovered: boolean]
}
