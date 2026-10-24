<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete } from '@hareui/vue'
import { ref } from 'vue'

const items: ListBoxItem[] = [
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
  <div class="space-y-2">
    <Autocomplete
      v-model="selected"
      clearable
      class="w-[256px]"
      label="States"
      placeholder="Select states"
      selection-mode="multiple"
      search-label="Search states"
      search-placeholder="Search states..."
      :items="items"
    >
      <template #empty> No results found </template>
    </Autocomplete>
    <p class="text-sm text-muted">
      Selected: {{ selected.length > 0 ? selected.join(', ') : 'None' }}
    </p>
  </div>
</template>
