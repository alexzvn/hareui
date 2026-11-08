<template>
  <Tooltip :text="label" :side="tooltipSide" :delay="500" :portal="map.root.value ?? true">
    <Button
      data-slot="map-control-button"
      variant="tertiary"
      icon-only
      :aria-label="label"
      :aria-pressed="active === undefined ? undefined : active"
      :data-active="active || undefined"
      :disabled="disabled"
      :pending="pending"
      :class="ui.button({ class: controls.ui()?.button })"
      @click="emit('click', $event)"
    >
      <slot>
        <IconRenderer v-if="icon" :icon="icon" :class="ui.icon({ class: controls.ui()?.icon })" />
      </slot>
    </Button>
  </Tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Button from '@/components/button/Button.vue'
import { injectMapContext } from '@/components/map/context'
import Tooltip from '@/components/tooltip/Tooltip.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { IconRenderer } from '@/utils/icon'

import { injectControlsContext } from './context'
import type {
  MapControlButtonEmits,
  MapControlButtonProps,
  MapControlButtonSlots,
} from './MapControls.types'
import theme from './theme'

const props = withDefaults(defineProps<MapControlButtonProps>(), {
  active: undefined,
  disabled: false,
  pending: false,
})

const emit = defineEmits<MapControlButtonEmits>()

defineSlots<MapControlButtonSlots>()

const map = injectMapContext('MapControlButton')
const controls = injectControlsContext('MapControlButton')

const ui = useComponentUI('mapControls', {
  theme,
  variantProps: () => ({}),
  props,
  classSlot: 'button',
})

// The tooltip opens towards the middle of the map.
const tooltipSide = computed(() => (controls.position().endsWith('right') ? 'left' : 'right'))
</script>
