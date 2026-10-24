<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: DropdownEntry[] = [
  {
    value: 'new-file',
    label: 'New file',
    icon: 'gravity-ui:square-plus',
    kbd: { keys: ['command'], content: 'N' },
  },
  {
    value: 'open-file',
    label: 'Open file',
    icon: 'gravity-ui:folder-open',
    kbd: { keys: ['command'], content: 'O' },
  },
  {
    value: 'save-file',
    label: 'Save file',
    icon: 'gravity-ui:floppy-disk',
    kbd: { keys: ['command'], content: 'S' },
  },
  {
    value: 'delete-file',
    label: 'Delete file',
    icon: 'gravity-ui:trash-bin',
    variant: 'danger',
    kbd: { keys: ['command', 'shift'], content: 'D' },
  },
]
</script>

<template>
  <Dropdown :items="items" @action="(key) => console.log(`Selected: ${key}`)">
    <Button variant="secondary"> Actions </Button>
    <template #item-leading="{ item }">
      <Icon
        class="size-4 shrink-0"
        :class="item.variant === 'danger' ? 'text-danger' : 'text-muted'"
        :icon="item.icon"
      />
    </template>
  </Dropdown>
</template>
