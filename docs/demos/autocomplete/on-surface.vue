<script setup lang="ts">
import { Autocomplete, Surface } from 'herouse'
import { ref } from 'vue'

const items = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]

const selectedKey = ref<string | null>(null)
</script>

<template>
  <Surface class="w-[320px] rounded-3xl p-6">
    <Autocomplete
      v-model="selectedKey"
      clearable
      class="w-full"
      label="State"
      placeholder="Select one"
      variant="secondary"
      search-label="Search states"
      search-placeholder="Search states..."
      :items="items"
    >
      <template #empty>
        No results found
      </template>
    </Autocomplete>
  </Surface>
</template>
