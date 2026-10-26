<template>
  <Surface class="w-[380px] space-y-4 rounded-3xl p-6">
    <Autocomplete
      v-model="selectedKey"
      clearable
      full-width
      label="State"
      placeholder="Select one"
      variant="secondary"
      search-label="Search states"
      search-placeholder="Search states..."
      :items="items"
    >
      <template #empty> No results found </template>
    </Autocomplete>
  </Surface>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete, Surface } from '@hareui/vue'
import { ref } from 'vue'

const items: ListBoxItem[] = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]

const selectedKey = ref<string | null>(null)
</script>
