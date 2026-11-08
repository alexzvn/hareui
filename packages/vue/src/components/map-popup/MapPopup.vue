<template>
  <Teleport v-if="target" :to="target">
    <div
      ref="card"
      role="dialog"
      tabindex="-1"
      data-slot="map-popup"
      :aria-label="label"
      :class="ui.base()"
    >
      <ResolvedCloseButton
        v-if="closeButton"
        data-slot="map-popup-close"
        :close-button="closeButton"
        label-key="map.closePopup"
        :class="ui.close()"
        @click="close"
      />
      <slot :close="close" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Popup, PositionAnchor } from 'maplibre-gl'
import {
  inject,
  onBeforeUnmount,
  onMounted,
  onWatcherCleanup,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'

import ResolvedCloseButton from '@/components/close-button/ResolvedCloseButton.vue'
import { mapPopupTriggerKey } from '@/components/map-marker/context'
import type { MapOverlaySide } from '@/components/map-marker/MapMarker.types'
import { injectMapContext } from '@/components/map/context'
import { isSamePosition, toLngLat } from '@/components/map/position'
import { useComponentUI } from '@/composables/useComponentUI'

import type { MapPopupEmits, MapPopupProps, MapPopupSlots } from './MapPopup.types'
import theme from './theme'

const props = withDefaults(defineProps<MapPopupProps>(), {
  closeButton: false,
  dismissible: true,
  sideOffset: 8,
})

const emit = defineEmits<MapPopupEmits>()

defineSlots<MapPopupSlots>()

// The side the popup opens on is the opposite of the point maplibre-gl anchors it by.
const ANCHORS: Record<MapOverlaySide, PositionAnchor> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

const context = injectMapContext('MapPopup')
const cardRef = useTemplateRef<HTMLDivElement>('card')
const target = shallowRef<HTMLElement>()
const trigger = inject(mapPopupTriggerKey, undefined)

const ui = useComponentUI('mapPopup', {
  theme,
  variantProps: () => ({ closeButton: Boolean(props.closeButton) }),
  props,
})

const close = () => emit('close')

const dismiss = () => {
  if (props.dismissible) close()
}

/** A press outside the popup closes it. A press on the marker that opened it is the marker's to handle. */
const onPointerDown = (event: PointerEvent) => {
  const node = event.target as Node | null
  if (!node || cardRef.value?.contains(node) || trigger?.value?.contains(node)) return

  dismiss()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') dismiss()
}

let popup: Popup | undefined

watch(
  [context.map, () => props.side, () => props.sideOffset],
  ([map, side, offset]) => {
    const library = context.maplibre.value
    if (!map || !library) return

    const element = document.createElement('div')
    popup = new library.Popup({
      anchor: side && ANCHORS[side],
      offset,
      closeButton: false,
      closeOnClick: false,
      closeOnMove: false,
      focusAfterOpen: false,
      maxWidth: 'none',
    })
      .setLngLat(toLngLat(props.position))
      .setDOMContent(element)
      .addTo(map)

    target.value = element

    onWatcherCleanup(() => {
      popup?.remove()
      popup = undefined
    })
  },
  { immediate: true },
)

watch(
  () => props.position,
  (position, previous) => {
    if (!previous || !isSamePosition(position, previous)) popup?.setLngLat(toLngLat(position))
  },
)

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown, true)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
  popup?.remove()
})

defineExpose({
  focus: () => cardRef.value?.focus(),
  contains: (node: Node | null) => Boolean(node && cardRef.value?.contains(node)),
})
</script>
