import type { Map as MapLibreMap, MapOptions } from 'maplibre-gl'

import type { MapControlsPosition } from '@/components/map-controls/MapControls.types'
import type { MapMarkerProps } from '@/components/map-marker/MapMarker.types'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type { MapArcProps } from './MapArc.types'
import type { MapClusterLayerProps } from './MapClusterLayer.types'
import type { MapHeatmapProps } from './MapHeatmap.types'
import type { MapPolygonProps } from './MapPolygon.types'
import type { MapRouteProps } from './MapRoute.types'
import type theme from './theme'
import type { MapPoint, MapStyle, MapViewport } from './types'

type MapTheme = typeof theme

/** A marker of the `markers` prop. Add fields of your own; events and slots hand the item back. */
export type MapMarkerItem = MapMarkerProps & {
  /** Identifies the marker across updates. Defaults to its index. */
  id?: string | number
  /** Renders the marker with the `#<slot>-marker`, `#<slot>-tooltip` and `#<slot>-popup` slots. */
  slot?: string
}

/** A route of the `routes` prop. */
export type MapRouteItem = MapRouteProps & { id?: string | number }

/** An arc of the `arcs` prop. */
export type MapArcItem = MapArcProps & { id?: string | number }

/** A polygon of the `polygons` prop. */
export type MapPolygonItem = MapPolygonProps & { id?: string | number }

/** The controls of the `controls` prop. */
export type MapControlsOptions = {
  /**
   * The corner of the map the controls sit in.
   * @defaultValue 'bottom-right'
   */
  position?: MapControlsPosition
  /**
   * Shows the zoom in and out buttons.
   * @defaultValue true
   */
  zoom?: boolean
  /**
   * Shows the compass, which turns the map back to north.
   * @defaultValue false
   */
  compass?: boolean
  /**
   * Shows the button that centers the map on the user's position.
   * @defaultValue false
   */
  locate?: boolean
  /**
   * Shows the fullscreen toggle.
   * @defaultValue false
   */
  fullscreen?: boolean
}

/** Props of `Map`. */
export type MapProps<M extends MapMarkerItem = MapMarkerItem, P extends MapPoint = MapPoint> = {
  /** The lowest zoom level the map allows. */
  minZoom?: number
  /** The highest zoom level the map allows. */
  maxZoom?: number
  /**
   * How the globe is flattened. `globe` draws a sphere while zoomed out.
   * @defaultValue 'mercator'
   */
  projection?: 'mercator' | 'globe'
  /**
   * Whether the map reacts to the pointer, touch and keyboard.
   * @defaultValue true
   */
  interactive?: boolean
  /**
   * The map style: a style URL or object, or a `{ light, dark }` pair that follows the color scheme.
   * @defaultValue OpenFreeMap's Positron in light mode and Dark in dark mode
   */
  mapStyle?: MapStyle | { light: MapStyle; dark: MapStyle }
  /** The style of a `{ light, dark }` pair to show. Defaults to the color scheme of the page. */
  colorMode?: 'light' | 'dark'
  /**
   * Shows the loader over the map, for data still loading. The loader also shows until the map first draws.
   * @defaultValue false
   */
  loading?: boolean
  /** Markers drawn with `MapMarker`, customised with the `#marker`, `#tooltip` and `#popup` slots. */
  markers?: M[]
  /** Routes drawn with `MapRoute`. */
  routes?: MapRouteItem[]
  /** Arcs drawn with `MapArc`. */
  arcs?: MapArcItem[]
  /** Polygons drawn with `MapPolygon`. */
  polygons?: MapPolygonItem[]
  /** A heatmap drawn with `MapHeatmap`. */
  heatmap?: MapHeatmapProps
  /** Points drawn with `MapClusterLayer`. */
  clusters?: MapClusterLayerProps<P>
  /**
   * Control buttons drawn with `MapControls`; `true` shows the zoom buttons.
   * @defaultValue false
   */
  controls?: boolean | MapControlsOptions
  /**
   * Other maplibre-gl map options, read once when the map is created.
   * @see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/
   */
  options?: Omit<MapOptions, 'container' | 'style' | 'center' | 'zoom' | 'bearing' | 'pitch'>
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<MapTheme>
}

/** Events of `Map`. */
export type MapEmits<M extends MapMarkerItem = MapMarkerItem, P extends MapPoint = MapPoint> = {
  /** The map drew for the first time. */
  load: [map: MapLibreMap]
  /** The map was clicked somewhere other than a marker, a popup or a control, at `position`. */
  click: [position: MapPoint, event: MouseEvent]
  /** The camera stopped moving. Suits reloading the data in view. */
  moveend: [viewport: MapViewport]
  /** A marker of `markers` was pressed. */
  markerClick: [marker: M, event: MouseEvent | KeyboardEvent]
  /** A draggable marker of `markers` was dropped at `position`. */
  markerDragend: [marker: M, position: MapPoint]
  /** A route of `routes` was clicked, at `position`. */
  routeClick: [route: MapRouteItem, position: MapPoint, event: MouseEvent]
  /** An arc of `arcs` was clicked, at `position`. */
  arcClick: [arc: MapArcItem, position: MapPoint, event: MouseEvent]
  /** A polygon of `polygons` was clicked, at `position`. */
  polygonClick: [polygon: MapPolygonItem, position: MapPoint, event: MouseEvent]
  /** A single point of `clusters` was clicked. */
  pointClick: [point: P, event: MouseEvent]
}

/** Props of the marker slots of `Map`. */
export type MapMarkerSlotProps<M extends MapMarkerItem = MapMarkerItem> = {
  marker: M
}

/** Slots of `Map`. */
export type MapSlots<M extends MapMarkerItem = MapMarkerItem> = {
  /** Parts (`MapMarker`, `MapRoute`, `MapControls`…) and overlays such as a legend. Parts appear once the map exists. */
  default?: () => unknown
  /** The content of every marker of `markers`. */
  marker?: (props: MapMarkerSlotProps<M>) => unknown
  /** A tooltip for every marker of `markers`. */
  tooltip?: (props: MapMarkerSlotProps<M>) => unknown
  /** A popup for every marker of `markers`, opened by pressing it. */
  popup?: (props: MapMarkerSlotProps<M> & { close: () => void }) => unknown
} & {
  [key: `${string}-marker`]: (props: MapMarkerSlotProps<M>) => unknown
  [key: `${string}-tooltip`]: (props: MapMarkerSlotProps<M>) => unknown
  [key: `${string}-popup`]: (props: MapMarkerSlotProps<M> & { close: () => void }) => unknown
}
