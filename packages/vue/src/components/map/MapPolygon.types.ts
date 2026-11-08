import type { MapColor, MapLineType, MapPosition } from './types'

/** Props of `MapPolygon`: a filled area with an outline, such as a district or a delivery zone. */
export type MapPolygonProps = {
  /** The corners of the area, in order. The ring closes by itself. */
  points: MapPosition[]
  /** The fill and outline color. */
  color?: MapColor
  /** The fill opacity, from 0 to 1. Hovering an area that listens to `click` or `hover` fills it a little more. */
  opacity?: number
  /** The outline width in pixels; `0` hides the outline. */
  width?: number
  /**
   * How the outline is drawn.
   * @defaultValue 'solid'
   */
  type?: MapLineType
}
