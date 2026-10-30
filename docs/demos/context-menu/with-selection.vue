<template>
  <div class="flex flex-col items-center gap-4">
    <ContextMenu v-model="selected" :items="items" selection-mode="single">
      <div
        class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
      >
        Right-click to sort the files
      </div>
    </ContextMenu>
    <p class="text-sm text-muted">Sorted by: {{ selected[0] ?? 'nothing' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ContextMenuEntry, ContextMenuValue } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'
import { ref } from 'vue'

const selected = ref<ContextMenuValue[]>(['name'])

const items: ContextMenuEntry[] = [
  {
    type: 'section',
    label: 'Sort by',
    items: [
      { value: 'name', label: 'Name' },
      { value: 'size', label: 'Size' },
      { value: 'modified', label: 'Last modified' },
    ],
  },
]
</script>
