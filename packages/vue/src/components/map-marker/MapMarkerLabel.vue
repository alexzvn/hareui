<template>
  <span
    data-slot="map-marker-label"
    aria-hidden="true"
    :class="ui.label({ class: marker.ui()?.label })"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

import { injectMarkerContext } from './context'
import type { MapMarkerLabelProps, MapMarkerLabelSlots } from './MapMarker.types'
import theme from './theme'

const props = withDefaults(defineProps<MapMarkerLabelProps>(), { position: 'top' })

defineSlots<MapMarkerLabelSlots>()

const marker = injectMarkerContext('MapMarkerLabel')

const ui = useComponentUI('mapMarker', {
  theme,
  variantProps: () => ({ labelPosition: props.position }),
  props,
  classSlot: 'label',
})
</script>
