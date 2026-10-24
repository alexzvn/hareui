<script setup lang="ts">
import type { DropdownEntry, DropdownValue } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'
import { ref } from 'vue'

const selected = ref<DropdownValue[]>(['apple'])

const items: DropdownEntry[] = [
  {
    type: 'section',
    label: 'Select a fruit',
    items: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
  },
  { value: 'orange', label: 'Orange' },
  { value: 'pear', label: 'Pear' },
]
</script>

<template>
  <Dropdown v-model="selected" class="min-w-[256px]" :items="items" selection-mode="single">
    <Button variant="secondary"> Fruits </Button>
    <template #indicator="{ selected: isSelected }">
      <svg
        v-if="isSelected"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="text-accent-soft-foreground"
          clip-rule="evenodd"
          d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m3.1-8.55a.75.75 0 1 0-1.2-.9L7.419 8.858L6.03 7.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.13-.08z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </template>
  </Dropdown>
</template>
