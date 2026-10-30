<template>
  <Autocomplete
    clearable
    class="w-[256px]"
    label="State"
    placeholder="Select one"
    search-label="Search states"
    search-placeholder="Search states..."
    description="Select your state of residence"
    :items="items"
  >
    <template #empty> No results found </template>
  </Autocomplete>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete } from '@hareui/vue'

const items: ListBoxItem[] = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]
</script>
