<template>
  <MapControlGroup>
    <MapControlButton :label="t('map.resetBearing')" @click="reset">
      <CompassIcon :class="ui.compassIcon({ class: controls.ui()?.compassIcon })" :style="needle" />
    </MapControlButton>
  </MapControlGroup>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

import { injectMapContext } from '@/components/map/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'

import { injectControlsContext } from './context'
import { CompassIcon } from './icons'
import MapControlButton from './MapControlButton.vue'
import MapControlGroup from './MapControlGroup.vue'
import theme from './theme'

const { t } = useLocale()
const context = injectMapContext('MapCompassControl')
const controls = injectControlsContext('MapCompassControl')
const map = context.map.value!
const ui = useComponentUI('mapControls', { theme, variantProps: () => ({}) })

const bearing = ref(map.getBearing())
const pitch = ref(map.getPitch())

// The needle turns against the map and tilts with it, so it keeps pointing north.
const needle = computed(() => ({
  transform: `rotateX(${pitch.value}deg) rotate(${-bearing.value}deg)`,
}))

const read = () => {
  bearing.value = map.getBearing()
  pitch.value = map.getPitch()
}

const reset = () => map.resetNorthPitch({ duration: 300 })

map.on('rotate', read)
map.on('pitch', read)

onBeforeUnmount(() => {
  map.off('rotate', read)
  map.off('pitch', read)
})
</script>
