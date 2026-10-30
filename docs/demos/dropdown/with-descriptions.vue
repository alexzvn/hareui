<template>
  <Dropdown :items="items" @action="(key) => console.log(`Selected: ${key}`)">
    <Button variant="secondary"> Actions </Button>
    <template #item-leading="{ item }">
      <div class="flex h-8 items-start justify-center pt-px">
        <Icon
          class="size-4 shrink-0"
          :class="item.variant === 'danger' ? 'text-danger' : 'text-muted'"
          :icon="item.icon"
        />
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import type { DropdownEntry, DropdownItem } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'
import { Icon } from '@iconify/vue'

type IconItem = DropdownItem & { icon: string }

const items: DropdownEntry<IconItem>[] = [
  {
    value: 'new-file',
    label: 'New file',
    description: 'Create a new file',
    icon: 'gravity-ui:square-plus',
    kbd: { keys: ['command'], content: 'N' },
  },
  {
    value: 'open-file',
    label: 'Open file',
    description: 'Open an existing file',
    icon: 'gravity-ui:folder-open',
    kbd: { keys: ['command'], content: 'O' },
  },
  {
    value: 'save-file',
    label: 'Save file',
    description: 'Save the current file',
    icon: 'gravity-ui:floppy-disk',
    kbd: { keys: ['command'], content: 'S' },
  },
  {
    value: 'delete-file',
    label: 'Delete file',
    description: 'Move to trash',
    icon: 'gravity-ui:trash-bin',
    variant: 'danger',
    kbd: { keys: ['command', 'shift'], content: 'D' },
  },
]
</script>
