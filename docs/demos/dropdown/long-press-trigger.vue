<script setup lang="ts">
import type { DropdownEntry } from 'herouse'
import { Button, Dropdown } from 'herouse'

const items: DropdownEntry[] = [
  { value: 'new-file', label: 'New file' },
  { value: 'open-file', label: 'Open file' },
  { value: 'save-file', label: 'Save file' },
  { value: 'delete-file', label: 'Delete file', variant: 'danger' },
]
</script>

<template>
  <Dropdown :items="items" trigger="longPress">
    <Button aria-label="Menu" variant="secondary">
      Long Press
    </Button>
  </Dropdown>
</template>
