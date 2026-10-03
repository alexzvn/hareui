<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Select } from '@hareui/vue'
import { ref } from 'vue'

const states: ListBoxItem[] = [
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'florida', label: 'Florida' },
  { value: 'new-york', label: 'New York' },
  { value: 'illinois', label: 'Illinois' },
  { value: 'pennsylvania', label: 'Pennsylvania' },
]

const selected = ref<string[]>(['california', 'texas'])
</script>

<template>
  <div class="space-y-4">
    <Select
      v-model="selected"
      class="w-[256px]"
      label="States (controlled multiple)"
      placeholder="Select states"
      selection-mode="multiple"
      :items="states"
    />
    <p class="text-sm text-muted">
      Selected: {{ selected.length > 0 ? selected.join(', ') : 'None' }}
    </p>
  </div>
</template>
