<template>
  <Dropdown :items="items" @action="(key) => console.log(`Selected: ${key}`)">
    <Button variant="secondary"> Actions </Button>
  </Dropdown>
</template>

<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: DropdownEntry[] = [
  {
    value: 'new-file',
    label: 'New file',
    icon: icon('square-plus'),
    kbd: { keys: ['command'], content: 'N' },
  },
  {
    value: 'open-file',
    label: 'Open file',
    icon: icon('folder-open'),
    kbd: { keys: ['command'], content: 'O' },
  },
  {
    value: 'save-file',
    label: 'Save file',
    icon: icon('floppy-disk'),
    kbd: { keys: ['command'], content: 'S' },
  },
  {
    value: 'delete-file',
    label: 'Delete file',
    icon: icon('trash-bin'),
    variant: 'danger',
    kbd: { keys: ['command', 'shift'], content: 'D' },
  },
]
</script>
