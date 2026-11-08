import type { Map as MapLibreMap, StyleSpecification } from 'maplibre-gl'
import type { Ref, ShallowRef } from 'vue'

/** A position as an object: longitude and latitude in degrees. Every map event reports positions in this form. */
export type MapPoint = {
  /** Longitude in degrees, from -180 (west) to 180 (east). */
  long: number
  /** Latitude in degrees, from -90 (south) to 90 (north). */
  lat: number
}

/** A position on the map: `{ long, lat }` or `[long, lat]`. */
export type MapPosition = MapPoint | [long: number, lat: number]

/**
 * A color: a theme color name, or any CSS color, `var()` and `oklch()` included. Colors follow the page's color
 * scheme.
 */
export type MapColor = 'default' | 'accent' | 'success' | 'warning' | 'danger' | (string & {})

/** How a line is drawn. */
export type MapLineType = 'solid' | 'dashed' | 'dotted'

/** The camera: what the map shows and from which angle. */
export type MapViewport = {
  /** The position at the center of the map. */
  center: MapPoint
  /** The zoom level, from 0 (the whole world) to 22. */
  zoom: number
  /** The rotation in degrees, clockwise from north. */
  bearing: number
  /** The tilt in degrees, from 0 (looking straight down) to 85. */
  pitch: number
}

/** A map style: the URL of a style document, or the style object itself. */
export type MapStyle = string | StyleSpecification

/** Options of `flyTo` and `fitPoints`. */
export type MapCameraOptions = {
  /**
   * Length of the camera move in milliseconds. `0` jumps without animating.
   * @defaultValue maplibre-gl's own, about a second
   */
  duration?: number
}

/** Options of `fitPoints`. */
export type MapFitOptions = MapCameraOptions & {
  /**
   * Space in pixels kept free around the points, on every side or per side.
   * @defaultValue 40
   */
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
  /** The highest zoom level to fit at, so a single point or a close group isn't shown too close. */
  maxZoom?: number
}

type MapCamera = {
  /** Moves the camera, animated unless `duration` is `0`. */
  flyTo: (
    viewport: Partial<Omit<MapViewport, 'center'>> & { center?: MapPosition },
    options?: MapCameraOptions,
  ) => void
  /** Moves the camera so that every position in `points` is in view. */
  fitPoints: (points: MapPosition[], options?: MapFitOptions) => void
}

/** What `useMap()` returns inside a `Map`. */
export type UseMapReturn = MapCamera & {
  /** The maplibre-gl `Map`, once it's created. For sources and layers of your own. */
  map: Readonly<ShallowRef<MapLibreMap | undefined>>
  /** Whether the map has drawn for the first time. */
  isLoaded: Readonly<Ref<boolean>>
}

/** What a template ref on `Map` exposes. */
export type MapExposed = MapCamera & {
  /** The maplibre-gl `Map`, once it's created. For sources and layers of your own. */
  map: MapLibreMap | undefined
  /** Whether the map has drawn for the first time. */
  isLoaded: boolean
}
