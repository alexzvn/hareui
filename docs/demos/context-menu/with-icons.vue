<template>
  <ContextMenu :items="items">
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      Right-click the document
    </div>
    <template #item-leading="{ item }">
      <Icon
        class="size-4 shrink-0"
        :class="item.variant === 'danger' ? 'text-danger' : 'text-muted'"
        :icon="item.icon"
      />
    </template>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry, ContextMenuItem } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'

type IconItem = ContextMenuItem & { icon: string }

const items: ContextMenuEntry<IconItem>[] = [
  { value: 'open', label: 'Open', icon: 'gravity-ui:folder-open' },
  { value: 'rename', label: 'Rename', icon: 'gravity-ui:pencil', kbd: { keys: 'enter' } },
  { value: 'link', label: 'Copy link', icon: 'gravity-ui:link' },
  { type: 'separator' },
  {
    value: 'delete',
    label: 'Move to trash',
    icon: 'gravity-ui:trash-bin',
    variant: 'danger',
    kbd: { keys: ['command', 'delete'] },
  },
]
</script>
