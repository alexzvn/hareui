<template>
  <Select class="w-[256px]" :items="options" label="State" placeholder="Select one" required />
</template>

<script setup lang="ts">
import { Select } from '@hareui/vue'

const options = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]
</script>
