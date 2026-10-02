<script setup lang="ts">
import { Autocomplete, TagGroup } from 'herouse'
import { ref } from 'vue'

const tags = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'nextjs', label: 'Next.js' },
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
    label="Tags"
    placeholder="Select tags"
    selection-mode="multiple"
    :search="false"
    :items="tags"
  >
    <template #value="{ selectedItems, isPlaceholder, text }">
      <template v-if="isPlaceholder">
        {{ text }}
      </template>
      <TagGroup v-else size="sm" removable aria-label="Selected" :items="selectedItems.map(item => ({ id: String(item.value), label: item.label }))" @remove="onRemoveTags" />
    </template>
    <template #empty>
      No tags found
    </template>
  </Autocomplete>
</template>
