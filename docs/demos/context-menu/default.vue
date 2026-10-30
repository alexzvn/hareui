<template>
  <ContextMenu :items="items" @action="(value) => console.log(`Selected: ${value}`)">
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      Right-click the note
    </div>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'

const items: ContextMenuEntry[] = [
  { value: 'edit', label: 'Edit note', kbd: { keys: 'command', content: 'E' } },
  { value: 'pin', label: 'Pin to top', kbd: { keys: ['command', 'shift'], content: 'T' } },
  { value: 'lock', label: 'Lock note', disabled: true },
  { type: 'separator' },
  { value: 'export', label: 'Export as PDF' },
  { value: 'print', label: 'Print', kbd: { keys: 'command', content: 'P' } },
]
</script>
