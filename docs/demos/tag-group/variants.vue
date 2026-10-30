<template>
  <div class="flex flex-col gap-8">
    <TagGroup selection-mode="single" variant="default" label="Default" :items="items" />
    <TagGroup selection-mode="single" variant="surface" label="Surface" :items="items" />
  </div>
</template>

<script setup lang="ts">
import type { TagGroupItem } from '@hareui/vue'
import { TagGroup } from '@hareui/vue'

const items: TagGroupItem[] = [
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming' },
]
</script>
