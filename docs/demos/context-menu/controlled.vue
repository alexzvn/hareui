<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex items-center gap-3">
      <p class="text-sm text-muted">
        Menu is <strong>{{ isOpen ? 'open' : 'closed' }}</strong>
      </p>
      <Button size="sm" variant="secondary" @click="isOpen = true">Open menu</Button>
    </div>
    <ContextMenu v-model:open="isOpen" :items="items">
      <div
        class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
      >
        Right-click the playlist
      </div>
    </ContextMenu>
  </div>
</template>

<script setup lang="ts">
import type { ContextMenuEntry } from '@hareui/vue'
import { Button, ContextMenu } from '@hareui/vue'
import { ref } from 'vue'

const isOpen = ref(false)

const items: ContextMenuEntry[] = [
  { value: 'play', label: 'Play next' },
  { value: 'queue', label: 'Add to queue' },
  { value: 'download', label: 'Download' },
]
</script>
