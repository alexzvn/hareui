<template>
  <!-- Drawn on the map canvas. -->
</template>

<script setup lang="ts">
import type { MapPolygonProps } from './MapPolygon.types'
import type { MapLineEmits } from './MapRoute.types'
import { toLngLat } from './position'
import { useLineLayer } from './useLineLayer'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<MapPolygonProps>(), { type: 'solid' })

const emit = defineEmits<MapLineEmits>()

useLineLayer({
  part: 'MapPolygon',
  kind: 'polygon',
  shape: ({ resolveColor, readNumber }) => ({
    points: props.points.map(toLngLat),
    color: resolveColor(props.color, '--map-polygon-color'),
    width: props.width ?? readNumber('--map-polygon-width', 2),
    opacity: props.opacity ?? readNumber('--map-polygon-opacity', 0.18),
    type: props.type,
  }),
  emit,
})
</script>
