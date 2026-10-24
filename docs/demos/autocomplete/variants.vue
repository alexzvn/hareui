<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete, TagGroup } from '@hareui/vue'
import { ref } from 'vue'

const items: ListBoxItem[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
]

const selectedKey1 = ref<string | null>(null)
const selectedKey2 = ref<string | null>(null)
const selectedKeys1 = ref<string[]>([])
const selectedKeys2 = ref<string[]>([])

function onRemoveTags1(ids: string[]) {
  selectedKeys1.value = selectedKeys1.value.filter((key) => !ids.includes(key))
}
function onRemoveTags2(ids: string[]) {
  selectedKeys2.value = selectedKeys2.value.filter((key) => !ids.includes(key))
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-semibold">Single Select Variants</h3>
      <div class="flex flex-col gap-4">
        <Autocomplete
          v-model="selectedKey1"
          clearable
          class="w-[256px]"
          label="Primary variant"
          placeholder="Select one"
          variant="primary"
          search-placeholder="Search..."
          :items="items"
        >
          <template #empty> No results found </template>
        </Autocomplete>
        <Autocomplete
          v-model="selectedKey2"
          clearable
          class="w-[256px]"
          label="Secondary variant"
          placeholder="Select one"
          variant="secondary"
          search-placeholder="Search..."
          :items="items"
        >
          <template #empty> No results found </template>
        </Autocomplete>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-semibold">Multiple Select Variants</h3>
      <div class="flex flex-col gap-4">
        <Autocomplete
          v-model="selectedKeys1"
          clearable
          class="w-[256px]"
          label="Primary variant"
          placeholder="Select multiple"
          selection-mode="multiple"
          variant="primary"
          search-placeholder="Search..."
          :items="items"
        >
          <template #value="{ selectedItems, isPlaceholder, text }">
            <template v-if="isPlaceholder">
              {{ text }}
            </template>
            <TagGroup
              v-else
              size="sm"
              removable
              aria-label="Selected"
              :items="selectedItems.map((item) => ({ id: String(item.value), label: item.label }))"
              @remove="onRemoveTags1"
            />
          </template>
          <template #empty> No results found </template>
        </Autocomplete>
        <Autocomplete
          v-model="selectedKeys2"
          clearable
          class="w-[256px]"
          label="Secondary variant"
          placeholder="Select multiple"
          selection-mode="multiple"
          variant="secondary"
          search-placeholder="Search..."
          :items="items"
        >
          <template #value="{ selectedItems, isPlaceholder, text }">
            <template v-if="isPlaceholder">
              {{ text }}
            </template>
            <TagGroup
              v-else
              size="sm"
              variant="surface"
              removable
              aria-label="Selected"
              :items="selectedItems.map((item) => ({ id: String(item.value), label: item.label }))"
              @remove="onRemoveTags2"
            />
          </template>
          <template #empty> No results found </template>
        </Autocomplete>
      </div>
    </div>
  </div>
</template>
