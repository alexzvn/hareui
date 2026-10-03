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
const countries: ListBoxItem[] = [
  { value: 'argentina', label: 'Argentina' },
  { value: 'venezuela', label: 'Venezuela' },
  { value: 'japan', label: 'Japan' },
  { value: 'france', label: 'France' },
  { value: 'italy', label: 'Italy' },
  { value: 'spain', label: 'Spain' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <Autocomplete
      disabled
      clearable
      class="w-[256px]"
      label="State"
      placeholder="Select one"
      search-label="Search states"
      search-placeholder="Search states..."
      default-value="california"
      :items="items"
    >
      <template #empty>
        No results found
      </template>
    </Autocomplete>
    <Autocomplete
      disabled
      clearable
      class="w-[256px]"
      label="Countries to Visit"
      placeholder="Select countries"
      selection-mode="multiple"
      :default-value="['argentina', 'japan', 'france']"
      search-label="Search countries"
      search-placeholder="Search countries..."
      :items="countries"
    >
      <template #empty>
        No results found
      </template>
    </Autocomplete>
  </div>
</template>
