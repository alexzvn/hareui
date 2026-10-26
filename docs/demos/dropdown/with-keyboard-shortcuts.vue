<template>
  <Dropdown :items="items" @action="(key) => console.log(`Selected: ${key}`)">
    <Button variant="secondary"> Actions </Button>
  </Dropdown>
</template>

<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'

const items: DropdownEntry[] = [
  { value: 'new', label: 'New', kbd: { keys: ['command'], content: 'N' } },
  { value: 'open', label: 'Open', kbd: { keys: ['command'], content: 'O' } },
  { value: 'save', label: 'Save', kbd: { keys: ['command'], content: 'S' } },
  {
    value: 'delete',
    label: 'Delete',
    variant: 'danger',
    kbd: { keys: ['command', 'shift'], content: 'D' },
  },
]
</script>
