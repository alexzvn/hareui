<template>
  <!-- Drawn on the map canvas. -->
</template>

<script setup lang="ts" generic="T extends MapHeatmapPoint = MapHeatmapPoint">
import type { ExpressionSpecification } from 'maplibre-gl'
import { useId } from 'vue'

import { injectMapContext, useStyleEffect } from './context'
import { firstSymbolLayer, removeGeoJSONLayers, syncGeoJSONLayers, withAlpha } from './layer'
import type { MapHeatmapPoint, MapHeatmapProps } from './MapHeatmap.types'

defineOptions({ inheritAttrs: false })

const DEFAULT_COLORS = [
  'var(--map-heatmap-low)',
  'var(--map-heatmap-medium)',
  'var(--map-heatmap-high)',
]

const props = withDefaults(defineProps<MapHeatmapProps<T>>(), {
  radius: 24,
  intensity: 1,
  opacity: 0.8,
})

const context = injectMapContext('MapHeatmap')
const sourceId = `hareui-map-heatmap-${useId()}`

/** Transparent where there's nothing, then the colors evenly from low to high density. */
const ramp = (colors: string[]): ExpressionSpecification => {
  const stops = colors.flatMap((color, index) => [
    0.15 + (0.85 * index) / Math.max(colors.length - 1, 1),
    color,
  ])

  return [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    withAlpha(colors[0] ?? 'rgb(0, 0, 0)', 0),
    ...stops,
  ]
}

useStyleEffect(context, {
  draw: (map) => {
    const colors = (props.colors ?? DEFAULT_COLORS).map((color) =>
      context.resolveColor(color, '--map-heatmap-low'),
    )

    const features = props.points.map((point) => ({
      type: 'Feature' as const,
      properties: { weight: point.weight ?? 1 },
      geometry: { type: 'Point' as const, coordinates: [point.long, point.lat] },
    }))

    syncGeoJSONLayers(map, {
      id: sourceId,
      data: { type: 'FeatureCollection', features },
      layers: [
        {
          id: sourceId,
          type: 'heatmap',
          source: sourceId,
          paint: {
            'heatmap-weight': ['get', 'weight'],
            'heatmap-intensity': props.intensity,
            'heatmap-radius': props.radius,
            'heatmap-opacity': props.opacity,
            'heatmap-color': ramp(colors),
          },
        },
      ],
      before: firstSymbolLayer(map),
    })
  },
  remove: (map) => removeGeoJSONLayers(map, { id: sourceId, layers: [sourceId] }),
})
</script>
