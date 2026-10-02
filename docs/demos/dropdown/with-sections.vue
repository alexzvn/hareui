<script setup lang="ts">
import type { DropdownEntry } from 'herouse'
import { Button, Dropdown } from 'herouse'
import { Icon } from '@iconify/vue'

const items: DropdownEntry[] = [
  {
    type: 'section',
    label: 'Actions',
    items: [
      { value: 'new-file', label: 'New file', description: 'Create a new file', icon: 'gravity-ui:square-plus', kbd: { keys: ['command'], content: 'N' } },
      { value: 'edit-file', label: 'Edit file', description: 'Make changes', icon: 'gravity-ui:pencil', kbd: { keys: ['command'], content: 'E' } },
    ],
  },
  { type: 'separator' },
  {
    type: 'section',
    label: 'Danger zone',
    items: [
      { value: 'delete-file', label: 'Delete file', description: 'Move to trash', icon: 'gravity-ui:trash-bin', variant: 'danger', kbd: { keys: ['command', 'shift'], content: 'D' } },
    ],
  },
]
</script>

<template>
  <Dropdown :items="items" @action="(key) => console.log(`Selected: ${key}`)">
    <Button aria-label="Menu" icon-only variant="secondary">
      <Icon class="outline-none" height="16" icon="gravity-ui:ellipsis-vertical" width="16" />
    </Button>
    <template #item-leading="{ item }">
      <div class="flex h-8 items-start justify-center pt-px">
        <Icon class="size-4 shrink-0" :class="item.variant === 'danger' ? 'text-danger' : 'text-muted'" :icon="item.icon" />
      </div>
    </template>
  </Dropdown>
</template>
