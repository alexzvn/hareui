<template>
  <!-- Drawn on the map canvas. -->
</template>

<script setup lang="ts">
import type { MapLineEmits, MapRouteProps } from './MapRoute.types'
import { toLngLat } from './position'
import { useLineLayer } from './useLineLayer'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<MapRouteProps>(), { type: 'solid' })

const emit = defineEmits<MapLineEmits>()

useLineLayer({
  part: 'MapRoute',
  kind: 'route',
  shape: ({ resolveColor, readNumber }) => ({
    points: props.points.map(toLngLat),
    color: resolveColor(props.color, '--map-route-color'),
    width: props.width ?? readNumber('--map-route-width', 4),
    opacity: props.opacity ?? readNumber('--map-route-opacity', 0.9),
    type: props.type,
  }),
  emit,
})
</script>
