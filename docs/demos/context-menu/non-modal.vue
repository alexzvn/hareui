<template>
  <ContextMenu :items="items" :modal="false">
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      Right-click, then hover the page
    </div>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'

const items: ContextMenuEntry[] = [
  { value: 'refresh', label: 'Refresh' },
  { value: 'settings', label: 'Widget settings' },
]
</script>
