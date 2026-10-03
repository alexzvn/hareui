<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Select } from '@hareui/vue'

const options: ListBoxItem[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <Select class="w-[256px]" label="Primary variant" placeholder="Select one" variant="primary" :items="options" />
    <Select class="w-[256px]" label="Secondary variant" placeholder="Select one" variant="secondary" :items="options" />
  </div>
</template>
