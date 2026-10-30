<template>
  <slot />
</template>

<script setup lang="ts">
// Internal: keeps the menu's own open state in step with the ContextMenu `open` state, so the menu can
// be opened, closed or held by `v-model:open` / `defaultOpen`. Wraps the trigger, which must be mounted
// first: an open request without a pointer anchors the menu to the trigger's bottom-start corner.
// Not exported.
import { injectContextMenuRootContext } from 'reka-ui'
import { onMounted, watch } from 'vue'

const props = defineProps<{
  /** The open state the menu must follow. */
  open: boolean
}>()

const context = injectContextMenuRootContext()

// The menu positions itself at the pointer of the `contextmenu` event that opened it; this one points at
// the trigger's bottom-start corner. It doesn't bubble, so page listeners never see it.
const openAtTrigger = (trigger: HTMLElement) => {
  const rect = trigger.getBoundingClientRect()
  const event = new MouseEvent('contextmenu', {
    cancelable: true,
    clientX: rect.left,
    clientY: rect.bottom,
  })

  trigger.dispatchEvent(event)
}

const sync = () => {
  const isMenuOpen = context.open.value
  if (props.open === isMenuOpen) return

  const trigger = context.triggerElement.value
  if (props.open && trigger) {
    openAtTrigger(trigger)
    return
  }

  context.onOpenChange(props.open)
}

watch([() => props.open, context.open], sync, { flush: 'post' })
onMounted(sync)
</script>
