<script setup lang="ts">
import { Autocomplete, TagGroup } from '@hareui/vue'
import { ref } from 'vue'

const emails = [
  { value: 'alice@example.com', label: 'Alice Johnson', description: 'alice@example.com', textValue: 'alice@example.com' },
  { value: 'bob@example.com', label: 'Bob Smith', description: 'bob@example.com', textValue: 'bob@example.com' },
  { value: 'charlie@example.com', label: 'Charlie Brown', description: 'charlie@example.com', textValue: 'charlie@example.com' },
  { value: 'diana@example.com', label: 'Diana Prince', description: 'diana@example.com', textValue: 'diana@example.com' },
  { value: 'eve@example.com', label: 'Eve Wilson', description: 'eve@example.com', textValue: 'eve@example.com' },
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
    label="To"
    placeholder="Add recipients"
    selection-mode="multiple"
    search-label="Search emails"
    search-placeholder="Search emails..."
    :items="emails"
  >
    <template #value="{ selectedItems, isPlaceholder, text }">
      <template v-if="isPlaceholder">
        {{ text }}
      </template>
      <TagGroup v-else size="sm" removable aria-label="Selected" :items="selectedItems.map(item => ({ id: String(item.value), label: String(item.value) }))" @remove="onRemoveTags" />
    </template>
    <template #empty>
      No recipients found
    </template>
  </Autocomplete>
</template>
