<script setup lang="ts">
import type { DropdownEntry, DropdownValue } from 'herouse'
import { Button, Dropdown } from 'herouse'
import { ref } from 'vue'

// One `v-model` holds every section's selection: "Text Style" is multiple, "Text Alignment" single.
const selected = ref<DropdownValue[]>(['bold', 'italic', 'left'])

const items: DropdownEntry[] = [
  {
    type: 'section',
    label: 'Actions',
    items: [
      { value: 'cut', label: 'Cut', kbd: { keys: ['command'], content: 'X' } },
      { value: 'copy', label: 'Copy', kbd: { keys: ['command'], content: 'C' } },
      { value: 'paste', label: 'Paste', kbd: { keys: ['command'], content: 'U' } },
    ],
  },
  { type: 'separator' },
  {
    type: 'section',
    label: 'Text Style',
    selectionMode: 'multiple',
    items: [
      { value: 'bold', label: 'Bold', kbd: { keys: ['command'], content: 'B' } },
      { value: 'italic', label: 'Italic', kbd: { keys: ['command'], content: 'I' } },
      { value: 'underline', label: 'Underline', kbd: { keys: ['command'], content: 'U' } },
    ],
  },
  { type: 'separator' },
  {
    type: 'section',
    label: 'Text Alignment',
    selectionMode: 'single',
    indicator: 'dot',
    items: [
      { value: 'left', label: 'Left', kbd: { keys: ['alt'], content: 'A' } },
      { value: 'center', label: 'Center', kbd: { keys: ['alt'], content: 'H' } },
      { value: 'right', label: 'Right', kbd: { keys: ['alt'], content: 'D' } },
    ],
  },
]
</script>

<template>
  <Dropdown v-model="selected" class="min-w-[256px]" :items="items">
    <Button aria-label="Menu" variant="secondary">
      Styles
    </Button>
  </Dropdown>
</template>
