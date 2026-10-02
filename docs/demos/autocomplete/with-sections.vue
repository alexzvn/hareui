<script setup lang="ts">
import type { ListBoxEntry } from 'herouse'
import { Autocomplete } from 'herouse'

const countries: ListBoxEntry[] = [
  {
    type: 'section',
    label: 'North America',
    items: [
      { value: 'usa', label: 'United States' },
      { value: 'canada', label: 'Canada' },
      { value: 'mexico', label: 'Mexico' },
    ],
  },
  { type: 'separator' },
  {
    type: 'section',
    label: 'Europe',
    items: [
      { value: 'uk', label: 'United Kingdom' },
      { value: 'france', label: 'France' },
      { value: 'germany', label: 'Germany' },
      { value: 'spain', label: 'Spain' },
      { value: 'italy', label: 'Italy' },
    ],
  },
  { type: 'separator' },
  {
    type: 'section',
    label: 'Asia',
    items: [
      { value: 'japan', label: 'Japan' },
      { value: 'china', label: 'China' },
      { value: 'india', label: 'India' },
      { value: 'south-korea', label: 'South Korea' },
    ],
  },
]
</script>

<template>
  <Autocomplete
    clearable
    class="w-[256px]"
    label="Country"
    placeholder="Select a country"
    search-label="Search countries"
    search-placeholder="Search countries..."
    :items="countries"
  >
    <template #empty>
      No results found
    </template>
  </Autocomplete>
</template>
