import type { ClassValue } from '@/utils/tv'

/** Where `ChartPolarGrid` draws its lines, the `positions` prop. Unset keys follow the axis ticks. */
export type ChartPolarGridPositions = {
  /**
   * Angles of the spokes, in degrees.
   * @defaultValue the angle axis ticks
   */
  angles?: number[]
  /**
   * Radii of the rings, in px.
   * @defaultValue the radius axis ticks
   */
  radii?: number[]
}

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
  /** Spoke angles and ring radii. Each defaults to its axis ticks. */
  positions?: ChartPolarGridPositions
  /** Line color. Defaults to the theme's muted color. */
  stroke?: string
  /** Dash pattern of the lines, e.g. `'3 3'`. */
  strokeDasharray?: string
  /** Additional classes merged into the grid group. */
  class?: ClassValue
}
