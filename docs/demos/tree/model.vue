<template>
  <div class="flex w-72 flex-col gap-3">
    <Tree v-model="selected" :items="items" />
    <p class="text-xs text-muted">Selected: {{ selected?.label ?? 'nothing' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'
import { ref } from 'vue'

const items: TreeItem[] = [
  {
    label: 'recipes',
    defaultExpanded: true,
    children: [
      {
        label: 'breakfast',
        defaultExpanded: true,
        children: [{ label: 'shakshuka.md' }, { label: 'oat-pancakes.md' }],
      },
      { label: 'soups', children: [{ label: 'miso.md' }, { label: 'minestrone.md' }] },
      { label: 'index.md' },
    ],
  },
  { label: 'photos', children: [{ label: 'cover.jpg' }] },
  { label: 'shopping-list.txt' },
]

const selected = ref<TreeItem>()
</script>
