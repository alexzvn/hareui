import type {
  GeoJSONSource,
  GeoJSONSourceSpecification,
  LayerSpecification,
  Map as MapLibreMap,
} from 'maplibre-gl'

type PaintName = Parameters<MapLibreMap['setPaintProperty']>[1]
type LayoutName = Parameters<MapLibreMap['setLayoutProperty']>[1]

type FeatureCollection = Extract<GeoJSONSourceSpecification['data'], { type: 'FeatureCollection' }>

/** The first label layer of the style, so data layers go under the place names. */
export const firstSymbolLayer = (map: MapLibreMap) =>
  map.getStyle().layers.find((layer) => layer.type === 'symbol')?.id

/** A GeoJSON source and the layers drawn from it. */
type GeoJSONLayers = {
  id: string
  /** Source options besides the data, such as clustering. */
  source?: Omit<GeoJSONSourceSpecification, 'type' | 'data'>
  data: FeatureCollection
  layers: LayerSpecification[]
  /** The layer the new layers go under; on top of the style when unset. */
  before?: string
}

/**
 * Puts `data` in the GeoJSON source `id` and shows `layers` on it, adding them on the first call. Later calls update
 * the data and every paint and layout property in place.
 */
export const syncGeoJSONLayers = (
  map: MapLibreMap,
  { id, source, data, layers, before }: GeoJSONLayers,
) => {
  const existing = map.getSource<GeoJSONSource>(id)

  if (!existing) {
    map.addSource(id, { ...source, type: 'geojson', data })
    for (const layer of layers) map.addLayer(layer, before)

    return
  }

  void existing.setData(data)

  for (const layer of layers) {
    for (const [name, value] of Object.entries(('paint' in layer && layer.paint) || {})) {
      map.setPaintProperty(layer.id, name as PaintName, value)
    }

    for (const [name, value] of Object.entries(('layout' in layer && layer.layout) || {})) {
      map.setLayoutProperty(layer.id, name as LayoutName, value)
    }
  }
}

/** Removes the `layers` and the source `id`, if the style still has them. */
export const removeGeoJSONLayers = (
  map: MapLibreMap,
  { id, layers }: { id: string; layers: string[] },
) => {
  for (const layer of layers) if (map.getLayer(layer)) map.removeLayer(layer)
  if (map.getSource(id)) map.removeSource(id)
}

/** `color` (as `rgb()` or `rgba()`) with its alpha set to `alpha`. */
export const withAlpha = (color: string, alpha: number) => {
  const [red = 0, green = 0, blue = 0] = color.match(/[\d.]+/g)?.map(Number) ?? []

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
