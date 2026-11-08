<template>
  <Teleport v-if="element" :to="element">
    <div
      ref="base"
      data-slot="map-marker"
      :role="isInteractive ? 'button' : 'img'"
      :tabindex="isInteractive ? 0 : undefined"
      :aria-label="label ?? t('map.marker')"
      :aria-haspopup="popup ? 'dialog' : undefined"
      :aria-expanded="popup ? popup.isOpen.value : undefined"
      :data-open="popup?.isOpen.value || undefined"
      :data-draggable="draggable || undefined"
      :class="ui.base()"
      @click="press"
      @keydown.enter.space.prevent="press"
      @pointerenter="hover(true)"
      @pointerleave="hover(false)"
      @focusin="isFocused = true"
      @focusout="isFocused = false"
    >
      <template v-if="hasOwnContent()">
        <slot />
      </template>
      <template v-else>
        <MapMarkerDot />
        <MapMarkerLabel v-if="label">{{ label }}</MapMarkerLabel>
        <slot />
      </template>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Marker } from 'maplibre-gl'
import type { VNode } from 'vue'
import {
  Comment,
  Fragment,
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  onWatcherCleanup,
  provide,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'

import { injectMapContext } from '@/components/map/context'
import { isSamePosition, toLngLat, toPositionLike } from '@/components/map/position'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'

import type { MarkerPopupHandle } from './context'
import { mapMarkerContextKey, mapPopupTriggerKey } from './context'
import type { MapMarkerEmits, MapMarkerProps, MapMarkerSlots } from './MapMarker.types'
import MapMarkerDot from './MapMarkerDot.vue'
import MapMarkerLabel from './MapMarkerLabel.vue'
import MapMarkerPopup from './MapMarkerPopup.vue'
import MapMarkerTooltip from './MapMarkerTooltip.vue'
import theme from './theme'

const props = withDefaults(defineProps<MapMarkerProps>(), { anchor: 'center', draggable: false })

const emit = defineEmits<MapMarkerEmits>()
const slots = defineSlots<MapMarkerSlots>()

const OVERLAYS = new Set<unknown>([MapMarkerTooltip, MapMarkerPopup, Comment])

const { t } = useLocale()
const instance = getCurrentInstance()
const context = injectMapContext('MapMarker')
const baseRef = useTemplateRef<HTMLDivElement>('base')
const element = shallowRef<HTMLElement>()
const popup = shallowRef<MarkerPopupHandle>()
const isHovered = ref(false)
const isFocused = ref(false)

const ui = useComponentUI('mapMarker', { theme, variantProps: () => ({}), props })

/** Whether the slot holds something other than a tooltip or popup, which replaces the default dot and label. */
const isContent = (nodes: VNode[]): boolean =>
  nodes.some((node) =>
    node.type === Fragment ? isContent(node.children as VNode[]) : !OVERLAYS.has(node.type),
  )

// Called while rendering, where reading the slot is allowed.
const hasOwnContent = () => isContent((slots.default?.() ?? []) as VNode[])

const isInteractive = computed(
  () => Boolean(popup.value) || props.draggable || Boolean(instance?.vnode.props?.onClick),
)

const hover = (value: boolean) => {
  isHovered.value = value
  emit('hover', value)
}

const press = (event: MouseEvent | KeyboardEvent) => {
  emit('click', event)
  popup.value?.toggle()
}

provide(mapMarkerContextKey, {
  ui: () => props.ui,
  position: () => props.position,
  color: () => props.color,
  base: baseRef,
  isActive: computed(() => isHovered.value || isFocused.value),
  popup,
})

provide(mapPopupTriggerKey, baseRef)

let marker: Marker | undefined

const readPosition = () => {
  const { lng, lat } = marker!.getLngLat()

  return { long: lng, lat }
}

watch(
  [context.map, () => props.anchor],
  ([map, anchor]) => {
    const library = context.maplibre.value
    if (!map || !library) return

    const target = document.createElement('div')
    marker = new library.Marker({ element: target, anchor, draggable: props.draggable })
      .setLngLat(toLngLat(props.position))
      .addTo(map)

    marker.on('drag', () => emit('update:position', toPositionLike(readPosition(), props.position)))
    marker.on('dragend', () => emit('dragend', readPosition()))
    element.value = target

    onWatcherCleanup(() => {
      marker?.remove()
      marker = undefined
    })
  },
  { immediate: true },
)

watch(
  () => props.position,
  (position) => {
    if (marker && !isSamePosition(position, marker.getLngLat().toArray()))
      marker.setLngLat(toLngLat(position))
  },
)

watch(
  () => props.draggable,
  (draggable) => marker?.setDraggable(draggable),
)

// A hovered, focused or open marker draws above its neighbours.
watch(
  () => isHovered.value || isFocused.value || Boolean(popup.value?.isOpen.value),
  (isRaised) => {
    if (element.value) element.value.style.zIndex = isRaised ? '1' : ''
  },
)

onBeforeUnmount(() => marker?.remove())
</script>
