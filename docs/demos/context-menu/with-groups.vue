<template>
  <ContextMenu :items="groups">
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      Right-click the contact
    </div>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'

// Each inner array is a group; a separator is drawn between groups.
const groups: ContextMenuEntry[][] = [
  [
    { value: 'call', label: 'Call' },
    { value: 'message', label: 'Send message' },
  ],
  [
    { value: 'favorite', label: 'Add to favorites' },
    { value: 'edit', label: 'Edit contact' },
  ],
  [{ value: 'block', label: 'Block contact', variant: 'danger' }],
]
</script>
