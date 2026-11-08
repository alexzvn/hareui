export { default as Map } from './Map.vue'
export { default as MapArc } from './MapArc.vue'
export { default as MapClusterLayer } from './MapClusterLayer.vue'
export { default as MapHeatmap } from './MapHeatmap.vue'
export { default as MapPolygon } from './MapPolygon.vue'
export { default as MapRoute } from './MapRoute.vue'
export { useMap } from './useMap'

export type {
  MapArcItem,
  MapControlsOptions,
  MapEmits,
  MapMarkerItem,
  MapMarkerSlotProps,
  MapPolygonItem,
  MapProps,
  MapRouteItem,
  MapSlots,
} from './Map.types'

export type { MapArcProps } from './MapArc.types'

export type {
  MapClusterLayerEmits,
  MapClusterLayerProps,
  MapClusterOptions,
} from './MapClusterLayer.types'

export type { MapHeatmapPoint, MapHeatmapProps } from './MapHeatmap.types'
export type { MapPolygonProps } from './MapPolygon.types'
export type { MapLineEmits, MapRouteProps } from './MapRoute.types'

export type {
  MapCameraOptions,
  MapColor,
  MapExposed,
  MapFitOptions,
  MapLineType,
  MapPoint,
  MapPosition,
  MapStyle,
  MapViewport,
  UseMapReturn,
} from './types'
