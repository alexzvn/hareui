<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete } from '@hareui/vue'
import { ref } from 'vue'

const items: ListBoxItem[] = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]

const selectedKey = ref<string | null>(null)
</script>

<template>
  <Autocomplete
    v-model="selectedKey"
    clearable
    class="w-[256px]"
    label="State"
    placeholder="Select one"
    search-label="Search states"
    search-placeholder="Search states..."
    :items="items"
  >
    <template #indicator>
      <Icon class="size-3" icon="gravity-ui:chevrons-expand-vertical" />
    </template>
    <template #empty>
      No results found
    </template>
  </Autocomplete>
</template>
