<template>
  <!-- Drawn on the map canvas. -->
</template>

<script setup lang="ts" generic="T extends MapPoint = MapPoint">
import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl'
import { getCurrentInstance, onBeforeUnmount, useId } from 'vue'

import { injectMapContext, useStyleEffect } from './context'
import { removeGeoJSONLayers, syncGeoJSONLayers } from './layer'
import type { MapClusterLayerEmits, MapClusterLayerProps } from './MapClusterLayer.types'
import type { MapPoint } from './types'

defineOptions({ inheritAttrs: false })

const props = defineProps<MapClusterLayerProps<T>>()

const emit = defineEmits<MapClusterLayerEmits<T>>()

const context = injectMapContext('MapClusterLayer')
const id = `hareui-map-clusters-${useId()}`
const countLayer = `${id}-count`
const pointLayer = `${id}-points`

const isFontStack = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length > 0 && value.every((name) => typeof name === 'string')

/** The upright font stack of the style's labels, so counts draw with glyphs the style ships. */
const labelFont = (map: MapLibreMap) =>
  map
    .getStyle()
    .layers.map((layer) => (layer.type === 'symbol' ? layer.layout?.['text-font'] : undefined))
    .filter(isFontStack)
    .find((stack) => !stack.some((name) => /italic/i.test(name)))

const sourceOptions = () => ({
  cluster: true,
  clusterRadius: props.cluster?.distance ?? 50,
  clusterMaxZoom: props.cluster?.maxZoom ?? 14,
})

let appliedOptions = ''

useStyleEffect(context, {
  draw: (map) => {
    const { resolveColor } = context
    const [small, medium, large] = props.cluster?.colors ?? []
    const [mediumFrom, largeFrom] = props.cluster?.steps ?? [100, 750]
    const ring = resolveColor(undefined, '--map-point-ring-color')
    const options = sourceOptions()

    const features = props.points.map((point, index) => ({
      type: 'Feature' as const,
      properties: {
        index,
        color: resolveColor(
          typeof props.color === 'function' ? props.color(point) : props.color,
          '--map-point-color',
        ),
      },
      geometry: { type: 'Point' as const, coordinates: [point.long, point.lat] },
    }))

    const existing = map.getSource<GeoJSONSource>(id)
    const optionsKey = JSON.stringify(options)
    if (existing && optionsKey !== appliedOptions) void existing.setClusterOptions(options)
    appliedOptions = optionsKey

    const font = labelFont(map)
    syncGeoJSONLayers(map, {
      id,
      source: options,
      data: { type: 'FeatureCollection', features },
      layers: [
        {
          id,
          type: 'circle',
          source: id,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              resolveColor(small, '--map-cluster-small'),
              mediumFrom,
              resolveColor(medium, '--map-cluster-medium'),
              largeFrom,
              resolveColor(large, '--map-cluster-large'),
            ],
            'circle-opacity': 0.9,
            'circle-radius': ['step', ['get', 'point_count'], 16, mediumFrom, 22, largeFrom, 28],
            'circle-stroke-width': 2,
            'circle-stroke-color': ring,
          },
        },
        {
          id: countLayer,
          type: 'symbol',
          source: id,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 12,
            'text-allow-overlap': true,
            ...(font && { 'text-font': font }),
          },
          paint: { 'text-color': resolveColor(undefined, '--map-cluster-text-color') },
        },
        {
          id: pointLayer,
          type: 'circle',
          source: id,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': ['get', 'color'],
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': ring,
          },
        },
      ],
    })
  },
  remove: (map) => removeGeoJSONLayers(map, { id, layers: [countLayer, pointLayer, id] }),
})

/** Zooms in on a cluster until it splits. */
const expand = async (map: MapLibreMap, cluster: { id: number; center: [number, number] }) => {
  const zoom = await map.getSource<GeoJSONSource>(id)?.getClusterExpansionZoom(cluster.id)
  if (zoom !== undefined) map.easeTo({ center: cluster.center, zoom })
}

// Single points react to the pointer only while someone listens to `pointClick`.
const listensToPoints = Boolean(getCurrentInstance()?.vnode.props?.onPointClick)

const stopPointer = context.pointer.add({
  layers: listensToPoints ? [id, pointLayer] : [id],
  click: (feature, event) => {
    const map = context.map.value

    const [long = 0, lat = 0] =
      feature.geometry.type === 'Point' ? feature.geometry.coordinates : []

    if (feature.layer.id === id) {
      const count = Number(feature.properties.point_count)
      emit('clusterClick', count, { long, lat })
      if (map) void expand(map, { id: Number(feature.properties.cluster_id), center: [long, lat] })

      return
    }

    const point = props.points[Number(feature.properties.index)]
    if (point) emit('pointClick', point, event.originalEvent)
  },
})

onBeforeUnmount(stopPointer)
</script>
