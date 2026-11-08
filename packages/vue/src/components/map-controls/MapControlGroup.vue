<template>
  <ButtonGroup
    data-slot="map-control-group"
    orientation="vertical"
    variant="tertiary"
    separator
    :class="ui.group({ class: controls.ui()?.group })"
  >
    <slot />
  </ButtonGroup>
</template>

<script setup lang="ts">
import ButtonGroup from '@/components/button-group/ButtonGroup.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import { injectControlsContext } from './context'
import type { MapControlGroupProps, MapControlGroupSlots } from './MapControls.types'
import theme from './theme'

const props = defineProps<MapControlGroupProps>()

defineSlots<MapControlGroupSlots>()

const controls = injectControlsContext('MapControlGroup')

const ui = useComponentUI('mapControls', {
  theme,
  variantProps: () => ({}),
  props,
  classSlot: 'group',
})
</script>
