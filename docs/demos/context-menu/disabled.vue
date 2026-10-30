<template>
  <ContextMenu :items="items" disabled>
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      This area keeps the browser's own menu
    </div>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'

const items: ContextMenuEntry[] = [
  { value: 'reply', label: 'Reply' },
  { value: 'forward', label: 'Forward' },
]
</script>
