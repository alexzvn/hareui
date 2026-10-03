<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Select } from '@hareui/vue'

const countries: ListBoxItem[] = [
  { value: 'argentina', label: 'Argentina' },
  { value: 'venezuela', label: 'Venezuela' },
  { value: 'japan', label: 'Japan' },
  { value: 'france', label: 'France' },
  { value: 'italy', label: 'Italy' },
  { value: 'spain', label: 'Spain' },
  { value: 'thailand', label: 'Thailand' },
  { value: 'new-zealand', label: 'New Zealand' },
  { value: 'iceland', label: 'Iceland' },
]
</script>

<template>
  <Select
    class="w-[256px]"
    label="Countries to Visit"
    placeholder="Select countries"
    selection-mode="multiple"
    :items="countries"
  />
</template>
