<template>
  <MapControlGroup>
    <MapControlButton
      :icon="ZoomInIcon"
      :label="t('map.zoomIn')"
      :disabled="zoom >= maxZoom"
      @click="zoomBy(1)"
    />
    <MapControlButton
      :icon="ZoomOutIcon"
      :label="t('map.zoomOut')"
      :disabled="zoom <= minZoom"
      @click="zoomBy(-1)"
    />
  </MapControlGroup>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import { injectMapContext } from '@/components/map/context'
import { useLocale } from '@/composables/useLocale'

import { ZoomInIcon, ZoomOutIcon } from './icons'
import MapControlButton from './MapControlButton.vue'
import MapControlGroup from './MapControlGroup.vue'

const { t } = useLocale()
const context = injectMapContext('MapZoomControl')
const map = context.map.value!

const zoom = ref(map.getZoom())
const minZoom = ref(map.getMinZoom())
const maxZoom = ref(map.getMaxZoom())

const read = () => {
  zoom.value = map.getZoom()
  minZoom.value = map.getMinZoom()
  maxZoom.value = map.getMaxZoom()
}

const zoomBy = (delta: number) => map.zoomTo(map.getZoom() + delta, { duration: 300 })

map.on('zoom', read)
onBeforeUnmount(() => map.off('zoom', read))
</script>
