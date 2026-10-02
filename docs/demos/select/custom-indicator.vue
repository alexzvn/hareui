<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Select } from 'herouse'

const states = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]
</script>

<template>
  <Select class="w-[256px]" label="State" placeholder="Select one" :items="states" :ui="{ indicator: 'size-3' }">
    <template #indicator>
      <Icon icon="gravity-ui:chevrons-expand-vertical" />
    </template>
  </Select>
</template>
