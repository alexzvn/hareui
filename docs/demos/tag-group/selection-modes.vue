<script setup lang="ts">
import type { TagGroupItem } from '@hareui/vue'
import { TagGroup } from '@hareui/vue'
import { ref } from 'vue'

const items: TagGroupItem[] = [
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'shopping', label: 'Shopping' },
]
const single = ref<string[]>(['news'])
const multiple = ref<string[]>(['news', 'travel'])
</script>

<template>
  <div class="flex flex-col gap-8">
    <TagGroup
      v-model:selected="single"
      selection-mode="single"
      label="Single Selection"
      description="Choose one category"
      :items="items"
    />
    <TagGroup
      v-model:selected="multiple"
      selection-mode="multiple"
      label="Multiple Selection"
      description="Choose multiple categories"
      :items="items"
    />
  </div>
</template>
