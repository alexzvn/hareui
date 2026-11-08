import type {
  ExpressionSpecification,
  FilterSpecification,
  GeoJSONSource,
  LayerSpecification,
  Map as MapLibreMap,
} from 'maplibre-gl'

import { firstSymbolLayer } from './layer'
import type { MapPointer } from './pointer'
import type { MapLineType, MapPoint } from './types'

/** The parts drawn as lines: each kind shares one source, whatever the number of parts. */
export type LineKind = 'route' | 'arc' | 'polygon'

/** What a line part draws, colors already resolved. */
export type LineShape = {
  points: [long: number, lat: number][]
  color: string
  width: number
  /** Line opacity; for a polygon, the fill opacity (its outline is opaque). */
  opacity: number
  type: MapLineType
}

type LineHandlers = {
  click?: (position: MapPoint, event: MouseEvent) => void
  hover?: (isHovered: boolean) => void
}

/** A drawn line part: its kind, shape and pointer handlers. */
type LineEntry = { kind: LineKind; shape: LineShape; handlers: LineHandlers }

export type LineLayers = {
  /** Draws `entry`; returns the id that updates and removes it. */
  add: (entry: LineEntry) => number
  update: (id: number, entry: LineEntry) => void
  remove: (id: number) => void
  /** Listens to `map`'s pointer events over the lines. */
  attach: (map: MapLibreMap, pointer: MapPointer) => void
  /** Adds the sources and layers again on a new style. */
  redraw: () => void
}

const KINDS: LineKind[] = ['polygon', 'route', 'arc']
const TYPES: MapLineType[] = ['solid', 'dashed', 'dotted']

// Dash and gap lengths, in line widths. Dotted lines are zero-length dashes with round caps.
const DASHES: Record<MapLineType, number[] | undefined> = {
  solid: undefined,
  dashed: [2, 1.5],
  dotted: [0, 2],
}

const sourceId = (kind: LineKind) => `hareui-map-${kind}s`
const lineLayerId = (kind: LineKind, type: MapLineType) => `hareui-map-${kind}s-${type}`
const fillLayerId = 'hareui-map-polygons-fill'
const hitLayerId = (kind: LineKind) => `hareui-map-${kind}s-hit`

const isHovered: ExpressionSpecification = ['boolean', ['feature-state', 'hover'], false]
const isInteractive: FilterSpecification = ['==', ['get', 'interactive'], true]

const lineLayers = (kind: LineKind): LayerSpecification[] => {
  const source = sourceId(kind)
  const isPolygon = kind === 'polygon'
  const width: ExpressionSpecification = ['get', 'width']

  const lines = TYPES.map((type): LayerSpecification => ({
    id: lineLayerId(kind, type),
    type: 'line',
    source,
    filter: ['==', ['get', 'type'], type],
    layout: { 'line-cap': type === 'dashed' ? 'butt' : 'round', 'line-join': 'round' },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': ['case', isHovered, ['+', width, 1], width],
      'line-opacity': isPolygon ? 1 : ['case', isHovered, 1, ['get', 'opacity']],
      ...(DASHES[type] && { 'line-dasharray': ['literal', DASHES[type]] }),
    },
  }))

  if (isPolygon) {
    const fill: LayerSpecification = {
      id: fillLayerId,
      type: 'fill',
      source,
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': [
          'case',
          isHovered,
          ['min', ['+', ['get', 'opacity'], 0.12], 1],
          ['get', 'opacity'],
        ],
      },
    }

    const hit: LayerSpecification = {
      id: hitLayerId(kind),
      type: 'fill',
      source,
      filter: isInteractive,
      paint: { 'fill-color': '#000', 'fill-opacity': 0 },
    }

    return [fill, ...lines, hit]
  }

  // A wider transparent line that catches the pointer near thin lines.
  const hit: LayerSpecification = {
    id: hitLayerId(kind),
    type: 'line',
    source,
    filter: isInteractive,
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#000', 'line-opacity': 0, 'line-width': ['max', ['+', width, 8], 14] },
  }

  return [...lines, hit]
}

/** The shared sources and layers of routes, arcs and polygons, with hover state and pointer dispatch. */
export const createLineLayers = (isStyled: () => boolean): LineLayers => {
  const entries = new Map<number, LineEntry>()
  const pending = new Set<LineKind>()
  let nextId = 1
  let map: MapLibreMap | undefined
  let hovered: number | undefined

  const toFeature = (id: number, { kind, shape, handlers }: LineEntry) => ({
    type: 'Feature' as const,
    id,
    properties: {
      color: shape.color,
      width: shape.width,
      opacity: shape.opacity,
      type: shape.type,
      interactive: Boolean(handlers.click || handlers.hover),
    },
    geometry:
      kind === 'polygon'
        ? { type: 'Polygon' as const, coordinates: [closeRing(shape.points)] }
        : { type: 'LineString' as const, coordinates: shape.points },
  })

  const sync = (kind: LineKind) => {
    if (!map || !isStyled()) return

    const features = [...entries]
      .filter(([, entry]) => entry.kind === kind)
      .map(([id, entry]) => toFeature(id, entry))

    const data = { type: 'FeatureCollection' as const, features }
    const source = map.getSource<GeoJSONSource>(sourceId(kind))
    if (source) {
      void source.setData(data)
      return
    }

    if (features.length === 0) return

    map.addSource(sourceId(kind), { type: 'geojson', data })
    const before = kind === 'polygon' ? firstSymbolLayer(map) : undefined
    for (const layer of lineLayers(kind)) map.addLayer(layer, before)
  }

  const schedule = (kind: LineKind) => {
    if (pending.size === 0) {
      queueMicrotask(() => {
        for (const item of pending) sync(item)
        pending.clear()
      })
    }

    pending.add(kind)
  }

  const setHovered = (id: number | undefined) => {
    if (id === hovered) return

    const previous = hovered === undefined ? undefined : entries.get(hovered)
    if (previous && map?.getSource(sourceId(previous.kind))) {
      map.setFeatureState({ source: sourceId(previous.kind), id: hovered! }, { hover: false })
    }

    previous?.handlers.hover?.(false)
    hovered = id
    const next = id === undefined ? undefined : entries.get(id)
    if (next) {
      map?.setFeatureState({ source: sourceId(next.kind), id: id! }, { hover: true })
      next.handlers.hover?.(true)
    }
  }

  return {
    add: (entry) => {
      const id = nextId++
      entries.set(id, entry)
      schedule(entry.kind)

      return id
    },
    update: (id, entry) => {
      if (!entries.has(id)) return

      entries.set(id, entry)
      schedule(entry.kind)
    },
    remove: (id) => {
      const entry = entries.get(id)
      if (!entry) return

      if (hovered === id) setHovered(undefined)
      entries.delete(id)
      schedule(entry.kind)
    },
    attach: (target, pointer) => {
      map = target

      for (const kind of KINDS) {
        pointer.add({
          layers: [hitLayerId(kind)],
          hover: (feature) => setHovered(feature ? Number(feature.id) : undefined),
          click: (feature, event) => {
            const { lng, lat } = event.lngLat
            entries
              .get(Number(feature.id))
              ?.handlers.click?.({ long: lng, lat }, event.originalEvent)
          },
        })
      }

      map.on('style.load', () => {
        hovered = undefined
      })
    },
    redraw: () => {
      for (const kind of KINDS) sync(kind)
    },
  }
}

/** `points` with the first point repeated at the end, as GeoJSON polygon rings require. */
const closeRing = (points: [number, number][]) => {
  const first = points[0]
  const last = points.at(-1)
  if (!first || !last || (first[0] === last[0] && first[1] === last[1])) return points

  return [...points, first]
}
