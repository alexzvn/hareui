<template>
  <div class="space-y-4">
    <Select
      v-model:open="isOpen"
      class="w-[256px]"
      label="State"
      placeholder="Select one"
      :items="states"
    />
    <Button @click="isOpen = !isOpen"> {{ isOpen ? 'Close' : 'Open' }} Select </Button>
    <p class="text-sm text-muted">Select is {{ isOpen ? 'open' : 'closed' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Button, Select } from '@hareui/vue'
import { ref } from 'vue'

const states: ListBoxItem[] = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]

const isOpen = ref(false)
</script>
