<template>
  <div class="flex flex-col gap-8">
    <div class="w-sm">
      <TagGroup
        selection-mode="single"
        removable
        label="Default Remove Button"
        description="Click the X to remove tags"
        :items="tags"
        @remove="onRemoveTags"
      >
        <template #empty>
          <EmptyState class="p-1"> No categories found </EmptyState>
        </template>
      </TagGroup>
    </div>
    <div class="w-md">
      <TagGroup
        selection-mode="single"
        removable
        label="Custom Remove Button"
        description="Custom remove button with icon"
        :items="frameworks"
        @remove="onRemoveFrameworks"
      >
        <template #removeButton>
          <Icon icon="gravity-ui:circle-xmark-fill" />
        </template>
        <template #empty>
          <EmptyState class="p-1"> No frameworks found </EmptyState>
        </template>
      </TagGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TagGroupItem } from '@hareui/vue'
import { EmptyState, TagGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const tags = ref<TagGroupItem[]>([
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'shopping', label: 'Shopping' },
])

const frameworks = ref<TagGroupItem[]>([
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'angular', label: 'Angular' },
  { id: 'svelte', label: 'Svelte' },
])

const onRemoveTags = (ids: string[]) => {
  tags.value = tags.value.filter((tag) => !ids.includes(tag.id))
}

const onRemoveFrameworks = (ids: string[]) => {
  frameworks.value = frameworks.value.filter((framework) => !ids.includes(framework.id))
}
</script>
