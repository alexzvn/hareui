<template>
  <ContextMenu :items="items">
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      Right-click the message
    </div>
    <template #content-top>
      <p class="px-4 pt-3 pb-1 text-xs text-muted">Sent today at 9:41</p>
    </template>
    <template #item-label="{ item }">
      <span class="flex items-center gap-2">
        {{ item.label }}
        <span
          v-if="item.isNew"
          class="rounded-full bg-accent-soft px-1.5 text-xs text-accent-soft-foreground"
        >
          New
        </span>
      </span>
    </template>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry, ContextMenuItem } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'

type MessageItem = ContextMenuItem & { isNew?: boolean }

const items: ContextMenuEntry<MessageItem>[] = [
  { value: 'reply', label: 'Reply' },
  { value: 'react', label: 'Add reaction', isNew: true },
  { value: 'thread', label: 'Start a thread' },
]
</script>
