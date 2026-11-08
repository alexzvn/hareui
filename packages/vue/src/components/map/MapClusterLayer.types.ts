import type { MapColor, MapPoint } from './types'

/** How `MapClusterLayer` groups nearby points. */
export type MapClusterOptions = {
  /**
   * The colors of small, medium and large groups.
   * @defaultValue the `--map-cluster-small`, `--map-cluster-medium` and `--map-cluster-large` variables
   */
  colors?: [small: MapColor, medium: MapColor, large: MapColor]
  /**
   * The point counts at which a group becomes medium and large.
   * @defaultValue [100, 750]
   */
  steps?: [medium: number, large: number]
  /**
   * How close points must be to group, in pixels.
   * @defaultValue 50
   */
  distance?: number
  /**
   * The zoom level above which points no longer group.
   * @defaultValue 14
   */
  maxZoom?: number
}

/** Props of `MapClusterLayer`: many points that group into counted circles while zoomed out. */
export type MapClusterLayerProps<T extends MapPoint = MapPoint> = {
  /** The items to draw: a position plus any data of the app's own. */
  points: T[]
  /**
   * The color of single points, or a function that picks one per item.
   * @defaultValue the `--map-point-color` variable
   */
  color?: MapColor | ((point: T) => MapColor)
  /** How nearby points group. */
  cluster?: MapClusterOptions
}

/** Events of `MapClusterLayer`. */
export type MapClusterLayerEmits<T extends MapPoint = MapPoint> = {
  /** A single point was clicked; `point` is the item from `points`. */
  pointClick: [point: T, event: MouseEvent]
  /** A group was clicked. The map zooms in until the group splits. */
  clusterClick: [count: number, position: MapPoint]
}
