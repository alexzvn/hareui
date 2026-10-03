<script setup lang="ts">
import { Select } from '@hareui/vue'

const states = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]
const countries = [
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
    <Select disabled class="w-[256px]" default-value="california" label="State" placeholder="Select one" :items="states" />
    <Select
      disabled
      class="w-[256px]"
      label="Countries to Visit"
      placeholder="Select countries"
      selection-mode="multiple"
      :default-value="['argentina', 'japan', 'france']"
      :items="countries"
    />
  </div>
</template>
