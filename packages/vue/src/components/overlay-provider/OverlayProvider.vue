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

// Overlays whose root emitted `enter`, i.e. a HareUI overlay (directly or as a wrapper's root): they unmount after
// their own `after:leave`. Any other component falls back to the document's exit animations alone.
const lifecycleIds = new Set<symbol>()
const leaveResolvers = new Map<symbol, () => void>()

// `after:leave` that arrived before the provider started waiting for it.
const leftIds = new Set<symbol>()

const settleLeave = (id: symbol) => {
  const resolve = leaveResolvers.get(id)
  leaveResolvers.delete(id)
  if (resolve) return resolve()
  leftIds.add(id)
}

const getListeners = (overlay: Overlay) => {
  const listeners: Record<string, (...args: never[]) => void> = {
    'update:open': (value: boolean) => {
      overlay.isOpen = value
    },
    enter: () => {
      lifecycleIds.add(overlay.id)
      leftIds.delete(overlay.id)
    },
    'after:leave': () => settleLeave(overlay.id),
  }

  if (hasCloseEvent(overlay.component))
    listeners.close = (value?: unknown) => close(overlay.id, value)

  return listeners
}

// A HareUI overlay's `after:leave` fires once its node is gone; any other component waits for the document's exit
// animations instead.
const afterLeave = (id: symbol): Promise<void> => {
  if (!lifecycleIds.has(id)) return afterExitAnimations()
  if (leftIds.delete(id)) return Promise.resolve()

  return new Promise<void>((resolve) => leaveResolvers.set(id, resolve))
}

// One pending exit per overlay; reopening drops it, so a stale exit never unmounts a reopened (or re-closed) overlay.
const pendingExits = new Map<symbol, symbol>()

const unmountAfterExit = async (id: symbol) => {
  const exit = Symbol('exit')
  pendingExits.set(id, exit)
  await afterLeave(id)
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
      if (ids.includes(id)) continue
      pendingExits.delete(id)

      // Reopened, unmounted or removed: the stale exit settles and then stops at its `pendingExits` check.
      leaveResolvers.get(id)?.()
      leaveResolvers.delete(id)
    }

    for (const id of ids) {
      if (!pendingExits.has(id)) void unmountAfterExit(id)
    }
  },
  { flush: 'post', immediate: true },
)

const mountedIds = computed(() => mountedOverlays.value.map((overlay) => overlay.id))

// However an overlay stops rendering (after its exit, `unmount(id)`, removal from `overlays`), its lifecycle tracking
// goes with it: the next render may not emit `enter`, and a stale `after:leave` must not end a later exit early.
watch(mountedIds, (ids, previousIds) => {
  for (const id of previousIds) {
    if (ids.includes(id)) continue
    lifecycleIds.delete(id)
    leftIds.delete(id)
  }
})
</script>
