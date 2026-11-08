<template>
  <span data-slot="map-marker-dot" :style="style" :class="ui.dot({ class: marker.ui()?.dot })" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { toCssColor } from '@/components/map/color'
import { useComponentUI } from '@/composables/useComponentUI'

import { injectMarkerContext } from './context'
import type { MapMarkerDotProps } from './MapMarker.types'
import theme from './theme'

const props = defineProps<MapMarkerDotProps>()

const marker = injectMarkerContext('MapMarkerDot')

const ui = useComponentUI('mapMarker', { theme, variantProps: () => ({}), props, classSlot: 'dot' })

const style = computed(() => {
  const color = props.color ?? marker.color()

  return {
    '--map-marker-color': color && toCssColor(color),
    '--map-marker-ring-color': props.ringColor && toCssColor(props.ringColor),
  }
})
</script>
