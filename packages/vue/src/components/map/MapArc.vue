<template>
  <!-- Drawn on the map canvas. -->
</template>

<script setup lang="ts">
import { arcPoints } from './arc'
import type { MapArcProps } from './MapArc.types'
import type { MapLineEmits } from './MapRoute.types'
import { useLineLayer } from './useLineLayer'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<MapArcProps>(), { curvature: 0.2, type: 'solid' })

const emit = defineEmits<MapLineEmits>()

useLineLayer({
  part: 'MapArc',
  kind: 'arc',
  shape: ({ resolveColor, readNumber }) => ({
    points: arcPoints(props),
    color: resolveColor(props.color, '--map-arc-color'),
    width: props.width ?? readNumber('--map-arc-width', 2),
    opacity: props.opacity ?? readNumber('--map-arc-opacity', 0.85),
    type: props.type,
  }),
  emit,
})
</script>
