<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { ComboBox } from '@hareui/vue'

const animals: ListBoxItem[] = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'bird', label: 'Bird' },
  { value: 'fish', label: 'Fish' },
  { value: 'hamster', label: 'Hamster' },
]

// Plain case-insensitive substring match (the default also ignores accents)
function filter(text: string, inputValue: string) {
  if (!inputValue) return true
  return text.toLowerCase().includes(inputValue.toLowerCase())
}
</script>

<template>
  <ComboBox
    class="w-[256px]"
    label="Animal (custom filter)"
    placeholder="Search animals..."
    :filter="filter"
    :items="animals"
  />
</template>
