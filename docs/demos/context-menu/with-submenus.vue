<template>
  <ContextMenu
    v-model="selected"
    :items="items"
    @action="(value) => console.log(`Selected: ${value}`)"
  >
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      Right-click the board
    </div>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry, ContextMenuValue } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'
import { ref } from 'vue'

const selected = ref<ContextMenuValue[]>(['rulers', 'comfortable'])

const items: ContextMenuEntry[] = [
  { value: 'zoom-in', label: 'Zoom in', kbd: { keys: 'command', content: '+' } },
  { value: 'zoom-out', label: 'Zoom out', kbd: { keys: 'command', content: '-' } },
  { value: 'fit', label: 'Zoom to fit', disabled: true },
  {
    value: 'arrange',
    label: 'Arrange',
    items: [
      { value: 'front', label: 'Bring to front', kbd: { keys: 'command', content: ']' } },
      { value: 'back', label: 'Send to back', kbd: { keys: 'command', content: '[' } },
      { type: 'separator' },
      { value: 'distribute', label: 'Distribute evenly' },
    ],
  },
  { type: 'separator' },
  {
    type: 'section',
    selectionMode: 'multiple',
    items: [
      { value: 'rulers', label: 'Show rulers', kbd: { keys: ['command', 'shift'], content: 'R' } },
      { value: 'guides', label: 'Show guides' },
    ],
  },
  { type: 'separator' },
  {
    type: 'section',
    label: 'Density',
    selectionMode: 'single',
    indicator: 'dot',
    items: [
      { value: 'compact', label: 'Compact' },
      { value: 'comfortable', label: 'Comfortable' },
      { value: 'spacious', label: 'Spacious' },
    ],
  },
]
</script>
