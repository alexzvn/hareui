<script setup lang="ts">
import type { TagGroupItem } from '@hareui/vue'
import { TagGroup } from '@hareui/vue'

const tagClass =
  'rounded-full border border-neutral-300/80 bg-white/80 px-2.5 py-1 text-sm font-medium text-neutral-700 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-colors data-[selected=true]:border-neutral-500 data-[selected=true]:bg-neutral-900 data-[selected=true]:text-neutral-50 dark:border-neutral-600/80 dark:bg-neutral-900/60 dark:text-neutral-200 dark:ring-white/10 dark:data-[selected=true]:border-neutral-400 dark:data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:text-neutral-900'

const items: TagGroupItem[] = [
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'shopping', label: 'Shopping' },
]
</script>

<template>
  <TagGroup
    aria-label="Topics"
    selection-mode="single"
    :items="items"
    :ui="{ list: 'gap-2', tag: tagClass }"
  />
</template>
