import type { MapColor, MapPoint } from './types'

/** A heatmap item: a position, weighted by `weight`, plus any data of the app's own. */
export type MapHeatmapPoint = MapPoint & {
  /**
   * How much the item counts towards the density around it.
   * @defaultValue 1
   */
  weight?: number
}

/** Props of `MapHeatmap`: the density of many items as a color ramp. */
export type MapHeatmapProps<T extends MapHeatmapPoint = MapHeatmapPoint> = {
  /** The items to draw. */
  points: T[]
  /**
   * The ramp from low to high density. Empty areas stay transparent.
   * @defaultValue the `--map-heatmap-low`, `--map-heatmap-medium` and `--map-heatmap-high` variables
   */
  colors?: MapColor[]
  /**
   * How far each item spreads, in pixels.
   * @defaultValue 24
   */
  radius?: number
  /**
   * Multiplies the density, so sparse data still shows.
   * @defaultValue 1
   */
  intensity?: number
  /**
   * The opacity of the whole layer, from 0 to 1.
   * @defaultValue 0.8
   */
  opacity?: number
}
