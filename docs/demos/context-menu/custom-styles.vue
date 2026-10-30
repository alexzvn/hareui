<template>
  <ContextMenu
    :items="items"
    :ui="{ popover: 'min-w-64 rounded-xl', item: 'rounded-lg', separator: 'my-0.5' }"
  >
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      Right-click the event
    </div>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'

const items: ContextMenuEntry[] = [
  { value: 'join', label: 'Join call' },
  { value: 'reschedule', label: 'Reschedule' },
  { type: 'separator' },
  { value: 'decline', label: 'Decline', variant: 'danger' },
]
</script>
