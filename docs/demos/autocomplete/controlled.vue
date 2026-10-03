<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete } from '@hareui/vue'
import { computed, ref } from 'vue'

const states: ListBoxItem[] = [
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'florida', label: 'Florida' },
  { value: 'new-york', label: 'New York' },
  { value: 'illinois', label: 'Illinois' },
  { value: 'pennsylvania', label: 'Pennsylvania' },
]

const state = ref<string | null>('california')
const selectedState = computed(() => states.find(s => s.value === state.value))
</script>

<template>
  <div class="space-y-2">
    <Autocomplete
      v-model="state"
      clearable
      class="w-[256px]"
      label="State (controlled)"
      placeholder="Select a state"
      search-label="Search states"
      search-placeholder="Search states..."
      :items="states"
    >
      <template #empty>
        No results found
      </template>
    </Autocomplete>
    <p class="text-sm text-muted">
      Selected: {{ selectedState?.label || 'None' }}
    </p>
  </div>
</template>
