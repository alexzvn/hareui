<script setup lang="ts">
import { Autocomplete, Button } from 'herouse'
import { ref } from 'vue'

const items = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]

const isOpen = ref(false)
</script>

<template>
  <div class="space-y-4">
    <Autocomplete
      v-model:open="isOpen"
      clearable
      class="w-[256px]"
      label="State"
      placeholder="Select one"
      search-label="Search states"
      search-placeholder="Search states..."
      :items="items"
    >
      <template #empty>
        No results found
      </template>
    </Autocomplete>
    <Button @click="isOpen = !isOpen">
      {{ isOpen ? 'Close' : 'Open' }} Autocomplete
    </Button>
    <p class="text-sm text-muted">
      Autocomplete is {{ isOpen ? 'open' : 'closed' }}
    </p>
  </div>
</template>
