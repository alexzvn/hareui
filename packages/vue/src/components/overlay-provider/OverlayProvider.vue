<template>
  <component
    :is="overlay.component"
    v-for="overlay in mountedOverlays"
    :key="overlay.id"
    v-bind="overlay.props"
    :open="overlay.isOpen"
    v-on="getListeners(overlay)"
  />
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed, watch } from 'vue'

import { useOverlay } from '@/composables/useOverlay'

import { afterExitAnimations } from './exitAnimations'
import type { Overlay } from './OverlayProvider.types'

const { overlays, close, unmount } = useOverlay()

const mountedOverlays = computed(() => overlays.filter((overlay) => overlay.isMounted))

// Ids of overlays that are closed but still rendered, i.e. playing their exit animation.
const closingIds = computed(() =>
  mountedOverlays.value.filter((overlay) => !overlay.isOpen).map((overlay) => overlay.id),
)

// Binding `onClose` to a component without a `close` event would fall through to its root as an attribute.
const hasCloseEvent = (component: Component): boolean => {
  const { emits } = component as { emits?: unknown }
  if (Array.isArray(emits)) return emits.includes('close')

  return typeof emits === 'object' && emits !== null && 'close' in emits
}

const getListeners = (overlay: Overlay) => {
  const onOpenChange = (value: boolean) => {
    overlay.isOpen = value
  }

  if (!hasCloseEvent(overlay.component)) return { 'update:open': onOpenChange }

  return {
    'update:open': onOpenChange,
    close: (value?: unknown) => close(overlay.id, value),
  }
}

// One pending exit per overlay; reopening drops it, so a stale exit never unmounts a reopened (or re-closed) overlay.
const pendingExits = new Map<symbol, symbol>()

const unmountAfterExit = async (id: symbol) => {
  const exit = Symbol('exit')
  pendingExits.set(id, exit)
  await afterExitAnimations()
  if (pendingExits.get(id) !== exit) return

  pendingExits.delete(id)

  // A dismissed overlay resolves its `open()` promises with `undefined`; one closed with a value already resolved them.
  close(id)
  unmount(id)
}

watch(
  closingIds,
  (ids) => {
    for (const id of pendingExits.keys()) {
      if (!ids.includes(id)) pendingExits.delete(id)
    }

    for (const id of ids) {
      if (!pendingExits.has(id)) void unmountAfterExit(id)
    }
  },
  { flush: 'post', immediate: true },
)
</script>
