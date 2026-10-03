<script setup lang="ts">
import { Autocomplete, TagGroup } from '@hareui/vue'
import { ref } from 'vue'

const items = [
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'florida', label: 'Florida' },
  { value: 'new-york', label: 'New York' },
  { value: 'illinois', label: 'Illinois' },
  { value: 'pennsylvania', label: 'Pennsylvania' },
]

const selectedKeys = ref<string[]>([])

function onRemoveTags(ids: string[]) {
  selectedKeys.value = selectedKeys.value.filter(key => !ids.includes(key))
}
</script>

<template>
  <Autocomplete
    v-model="selectedKeys"
    clearable
    class="w-[256px]"
    label="States"
    placeholder="Select states"
    selection-mode="multiple"
    search-placeholder="Search..."
    :items="items"
  >
    <template #value="{ selectedItems, isPlaceholder, text }">
      <template v-if="isPlaceholder">
        {{ text }}
      </template>
      <TagGroup v-else size="sm" removable aria-label="Selected" :items="selectedItems.map(item => ({ id: String(item.value), label: item.label }))" @remove="onRemoveTags" />
    </template>
    <template #empty>
      No results found
    </template>
  </Autocomplete>
</template>
