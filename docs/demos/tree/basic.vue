<template>
  <Tree :items="items" class="w-72" />
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'

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
</script>
