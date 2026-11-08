<template>
  <MapControlGroup v-if="canLocate">
    <MapControlButton
      :icon="LocateIcon"
      :label="t('map.locate')"
      :pending="isLocating"
      @click="locate"
    />
  </MapControlGroup>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { injectMapContext } from '@/components/map/context'
import { useLocale } from '@/composables/useLocale'

import { LocateIcon } from './icons'
import MapControlButton from './MapControlButton.vue'
import MapControlGroup from './MapControlGroup.vue'
import type { MapLocateControlEmits, MapLocateControlProps } from './MapControls.types'

const props = withDefaults(defineProps<MapLocateControlProps>(), { zoom: 14 })

const emit = defineEmits<MapLocateControlEmits>()

const { t } = useLocale()
const context = injectMapContext('MapLocateControl')
const canLocate = ref(false)
const isLocating = ref(false)

const locate = () => {
  isLocating.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      isLocating.value = false
      const { longitude, latitude } = position.coords
      context.api.flyTo({ center: { long: longitude, lat: latitude }, zoom: props.zoom })
      emit('locate', position)
    },
    (error) => {
      isLocating.value = false
      emit('error', error)
    },
  )
}

onMounted(() => {
  canLocate.value = 'geolocation' in navigator
})
</script>
