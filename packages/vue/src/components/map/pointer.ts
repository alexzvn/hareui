import type { Map as MapLibreMap, MapGeoJSONFeature, MapMouseEvent, PointLike } from 'maplibre-gl'

/** Layers that react to the pointer, and what happens when it presses or moves over their features. */
type PointerTarget = {
  layers: readonly string[]
  click?: (feature: MapGeoJSONFeature, event: MapMouseEvent) => void
  hover?: (feature: MapGeoJSONFeature | undefined) => void
}

export type MapPointer = {
  /** Starts dispatching pointer events over `target`'s layers; returns the function that stops it. */
  add: (target: PointerTarget) => () => void
  /** Listens to `map`'s pointer events: a pointer cursor and hover over targets, clicks on the topmost one. */
  attach: (map: MapLibreMap) => void
}

/** One pointer listener per map for every interactive layer the parts add, topmost feature first. */
export const createPointer = (): MapPointer => {
  const targets = new Set<PointerTarget>()
  let hovered: { target: PointerTarget; id: unknown } | undefined

  const hit = (map: MapLibreMap, point: PointLike) => {
    const owners = new Map<string, PointerTarget>()
    for (const target of targets) {
      for (const layer of target.layers) if (map.getLayer(layer)) owners.set(layer, target)
    }

    if (owners.size === 0) return undefined

    const [feature] = map.queryRenderedFeatures(point, { layers: [...owners.keys()] })
    const target = feature && owners.get(feature.layer.id)

    return target && feature ? { target, feature } : undefined
  }

  const hover = (next: { target: PointerTarget; feature: MapGeoJSONFeature } | undefined) => {
    if (hovered?.target === next?.target && hovered?.id === next?.feature.id) return

    hovered?.target.hover?.(undefined)
    hovered = next && { target: next.target, id: next.feature.id }
    next?.target.hover?.(next.feature)
  }

  return {
    add: (target) => {
      targets.add(target)

      return () => {
        targets.delete(target)
        if (hovered?.target === target) hovered = undefined
      }
    },
    attach: (map) => {
      map.on('mousemove', (event) => {
        const found = hit(map, event.point)
        map.getCanvas().style.cursor = found ? 'pointer' : ''
        hover(found)
      })

      map.on('mouseout', () => {
        map.getCanvas().style.cursor = ''
        hover(undefined)
      })

      map.on('click', (event) => {
        const found = hit(map, event.point)
        found?.target.click?.(found.feature, event)
      })

      // A new style starts without the features that were hovered.
      map.on('style.load', () => {
        hovered = undefined
      })
    },
  }
}
