<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'

const items: DropdownEntry[] = [
  { value: 'new-file', label: 'New file' },
  { value: 'copy-link', label: 'Copy link' },
  { value: 'edit-file', label: 'Edit file' },
  { value: 'delete-file', label: 'Delete file', variant: 'danger' },
]
</script>

<template>
  <Dropdown :items="items" @action="(key) => console.log(`Selected: ${key}`)">
    <Button variant="secondary"> Actions </Button>
  </Dropdown>
</template>
