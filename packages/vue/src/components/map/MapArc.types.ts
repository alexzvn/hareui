import type { MapLineStyleProps } from './MapRoute.types'
import type { MapPosition } from './types'

/** Props of `MapArc`: a curved line between two positions, such as a flight or a transfer. */
export type MapArcProps = MapLineStyleProps & {
  /** Where the arc starts. */
  from: MapPosition
  /** Where the arc ends. */
  to: MapPosition
  /**
   * How far the arc bends sideways, as a share of its length. Negative values bend it the other way; `0` draws a
   * straight line.
   * @defaultValue 0.2
   */
  curvature?: number
}
