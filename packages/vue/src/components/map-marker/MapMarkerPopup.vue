<template>
  <MapPopup
    v-if="open"
    ref="popup"
    :position="marker.position()"
    :close-button="closeButton"
    :dismissible="dismissible"
    :side="side"
    :side-offset="sideOffset"
    :label="marker.base.value?.getAttribute('aria-label') ?? undefined"
    :class="props.class"
    @close="close"
  >
    <template #default="{ close: closePopup }">
      <slot :close="closePopup" />
    </template>
  </MapPopup>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, useTemplateRef, watch } from 'vue'

import MapPopup from '@/components/map-popup/MapPopup.vue'

import { injectMarkerContext } from './context'
import type { MapMarkerPopupProps, MapMarkerPopupSlots } from './MapMarker.types'

const props = withDefaults(defineProps<MapMarkerPopupProps>(), {
  closeButton: false,
  dismissible: true,
  sideOffset: 16,
})

defineSlots<MapMarkerPopupSlots>()

/** Whether the popup is open. Pressing the marker toggles it. */
const open = defineModel<boolean>('open', { default: false })

const marker = injectMarkerContext('MapMarkerPopup')
const popupRef = useTemplateRef<InstanceType<typeof MapPopup>>('popup')

/** Closes the popup, handing focus back to the marker when it was inside. */
const close = () => {
  const hadFocus = popupRef.value?.contains(document.activeElement) ?? false
  open.value = false
  if (hadFocus) marker.base.value?.focus()
}

marker.popup.value = { isOpen: open, toggle: () => (open.value = !open.value) }

// Opened with the keyboard, the popup takes focus so its content is read next.
watch(open, async (isOpen) => {
  if (!isOpen || document.activeElement !== marker.base.value) return

  await nextTick()
  popupRef.value?.focus()
})

onBeforeUnmount(() => {
  marker.popup.value = undefined
})
</script>
