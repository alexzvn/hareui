<template>
  <div class="flex flex-col items-center gap-4">
    <ContextMenu v-model="columns" :items="items" selection-mode="multiple">
      <div
        class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
      >
        Right-click the table header
      </div>
    </ContextMenu>
    <p class="text-sm text-muted">Visible columns: {{ columns.join(', ') || 'none' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ContextMenuEntry, ContextMenuValue } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'
import { ref } from 'vue'

const columns = ref<ContextMenuValue[]>(['owner', 'status'])

const items: ContextMenuEntry[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'status', label: 'Status' },
  { value: 'due', label: 'Due date' },
  { value: 'budget', label: 'Budget' },
]
</script>
