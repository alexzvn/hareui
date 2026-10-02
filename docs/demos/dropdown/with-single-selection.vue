<script setup lang="ts">
import type { DropdownEntry, DropdownValue } from 'herouse'
import { Button, Dropdown } from 'herouse'
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
    <Button aria-label="Menu" variant="secondary">
      Fruit
    </Button>
  </Dropdown>
</template>
