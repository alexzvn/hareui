<template>
  <div data-slot="map-controls" :class="ui.base()">
    <slot>
      <MapZoomControl />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'

import { injectMapContext } from '@/components/map/context'
import { useComponentUI } from '@/composables/useComponentUI'

import { mapControlsContextKey } from './context'
import type { MapControlsProps, MapControlsSlots } from './MapControls.types'
import MapZoomControl from './MapZoomControl.vue'
import theme from './theme'

const props = withDefaults(defineProps<MapControlsProps>(), { position: 'bottom-right' })

defineSlots<MapControlsSlots>()

injectMapContext('MapControls')

const ui = useComponentUI('mapControls', {
  theme,
  variantProps: () => ({ position: props.position }),
  props,
})

provide(mapControlsContextKey, { ui: () => props.ui, position: () => props.position })
</script>
