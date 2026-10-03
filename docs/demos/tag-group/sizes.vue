<script setup lang="ts">
import type { TagGroupItem } from '@hareui/vue'
import { TagGroup } from '@hareui/vue'

const items: TagGroupItem[] = [
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <TagGroup selection-mode="single" size="sm" label="Small" :items="items" />
    <TagGroup selection-mode="single" size="md" label="Medium" :items="items" />
    <TagGroup selection-mode="single" size="lg" label="Large" :items="items" />
  </div>
</template>
