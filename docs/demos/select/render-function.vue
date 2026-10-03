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

<template>
  <!-- HeroUI's `render` prop has no Vue equivalent (plan drop: render functions); attributes fall through to the root instead. -->
  <Select class="w-[256px]" data-custom="foo" label="State" placeholder="Select one" :items="states" />
</template>
