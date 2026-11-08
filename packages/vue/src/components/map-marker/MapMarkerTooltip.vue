<template>
  <span
    v-if="isVisible"
    :id="id"
    role="tooltip"
    data-slot="map-marker-tooltip"
    :class="ui.tooltip({ class: marker.ui()?.tooltip })"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, useId, watchEffect } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { injectMarkerContext } from './context'
import type { MapMarkerTooltipProps, MapMarkerTooltipSlots } from './MapMarker.types'
import theme from './theme'

const props = withDefaults(defineProps<MapMarkerTooltipProps>(), { side: 'top' })

defineSlots<MapMarkerTooltipSlots>()

const marker = injectMarkerContext('MapMarkerTooltip')
const id = useId()

const ui = useComponentUI('mapMarker', {
  theme,
  variantProps: () => ({ side: props.side }),
  props,
  classSlot: 'tooltip',
})

// Hidden while the marker's popup is open, which shows more than the tooltip would.
const isVisible = computed(() => marker.isActive.value && !marker.popup.value?.isOpen.value)

// Points at the tooltip only while it shows.
watchEffect(() => {
  marker.base.value?.toggleAttribute('aria-describedby', isVisible.value)
  if (isVisible.value) marker.base.value?.setAttribute('aria-describedby', id)
})

onBeforeUnmount(() => marker.base.value?.removeAttribute('aria-describedby'))
</script>
