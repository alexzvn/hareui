<template>
  <!-- Attributes fall through to the root element -->
  <Select
    class="w-[256px]"
    data-testid="state-select"
    label="State"
    placeholder="Select one"
    :items="states"
  />
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Select } from '@hareui/vue'

const states: ListBoxItem[] = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]
</script>
