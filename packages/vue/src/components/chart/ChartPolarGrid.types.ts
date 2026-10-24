import type { ClassValue } from '@/utils/tv'

/** Props of `ChartPolarGrid`: the rings and spokes behind a polar chart. */
export type ChartPolarGridProps = {
  /**
   * Shape of the rings: polygons through the angle axis ticks, or circles.
   * @defaultValue 'polygon'
   */
  gridType?: 'polygon' | 'circle'
  /**
   * Draws the spokes from the center to every angle axis tick.
   * @defaultValue true
   */
  radialLines?: boolean
  /** Angles of the spokes, in degrees. Defaults to the angle axis ticks. */
  polarAngles?: number[]
  /** Radii of the rings, in px. Defaults to the radius axis ticks. */
  polarRadius?: number[]
  /** Line color. Defaults to the theme's muted color. */
  stroke?: string
  /** Dash pattern of the lines, e.g. `'3 3'`. */
  strokeDasharray?: string
  /** Additional classes merged into the grid group. */
  class?: ClassValue
}
