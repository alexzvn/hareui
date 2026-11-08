<template>
  <MapControlGroup v-if="canFullscreen">
    <MapControlButton
      :icon="isFullscreen ? ExitFullscreenIcon : FullscreenIcon"
      :label="isFullscreen ? t('map.exitFullscreen') : t('map.fullscreen')"
      @click="toggle"
    />
  </MapControlGroup>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { injectMapContext } from '@/components/map/context'
import { useLocale } from '@/composables/useLocale'

import { ExitFullscreenIcon, FullscreenIcon } from './icons'
import MapControlButton from './MapControlButton.vue'
import MapControlGroup from './MapControlGroup.vue'

const { t } = useLocale()
const context = injectMapContext('MapFullscreenControl')
const canFullscreen = ref(false)
const isFullscreen = ref(false)

const sync = () => {
  isFullscreen.value =
    document.fullscreenElement !== null && document.fullscreenElement === context.root.value
}

const toggle = () => {
  if (document.fullscreenElement) {
    void document.exitFullscreen()
    return
  }

  void context.root.value?.requestFullscreen()
}

onMounted(() => {
  canFullscreen.value = document.fullscreenEnabled === true
  document.addEventListener('fullscreenchange', sync)
})

onBeforeUnmount(() => document.removeEventListener('fullscreenchange', sync))
</script>
