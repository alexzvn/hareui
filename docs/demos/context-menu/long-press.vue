<template>
  <ContextMenu :items="items" :press-open-delay="500">
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      Press and hold here on a touch screen
    </div>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'

const items: ContextMenuEntry[] = [
  { value: 'save', label: 'Save image' },
  { value: 'share', label: 'Share' },
  { value: 'favorite', label: 'Add to favorites' },
]
</script>
