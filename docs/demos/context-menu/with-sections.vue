<template>
  <ContextMenu :items="items">
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      Right-click the selection
    </div>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'

const items: ContextMenuEntry[] = [
  {
    type: 'section',
    label: 'Clipboard',
    items: [
      { value: 'cut', label: 'Cut', kbd: { keys: 'command', content: 'X' } },
      { value: 'copy', label: 'Copy', kbd: { keys: 'command', content: 'C' } },
      { value: 'paste', label: 'Paste', kbd: { keys: 'command', content: 'V' } },
    ],
  },
  { type: 'separator' },
  {
    type: 'section',
    label: 'Layer',
    items: [
      { value: 'group', label: 'Group layers' },
      { value: 'hide', label: 'Hide layer' },
      { value: 'remove', label: 'Remove layer', variant: 'danger' },
    ],
  },
]
</script>
