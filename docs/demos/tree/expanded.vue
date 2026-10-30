<template>
  <div class="flex w-72 flex-col gap-3">
    <div class="flex gap-2">
      <Button size="sm" variant="secondary" @click="expanded = folderKeys">Expand all</Button>
      <Button size="sm" variant="secondary" @click="expanded = []">Collapse all</Button>
    </div>
    <Tree v-model:expanded="expanded" :items="items" />
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Button, Tree } from '@hareui/vue'
import { ref } from 'vue'

const items: TreeItem[] = [
  {
    label: 'handbook',
    children: [
      { label: 'onboarding', children: [{ label: 'first-week.md' }, { label: 'tools.md' }] },
      { label: 'policies', children: [{ label: 'leave.md' }, { label: 'expenses.md' }] },
    ],
  },
  { label: 'templates', children: [{ label: 'one-on-one.md' }] },
]

const collectFolders = (list: TreeItem[]): string[] =>
  list.flatMap((item) => (item.children ? [item.label!, ...collectFolders(item.children)] : []))

const folderKeys = collectFolders(items)
const expanded = ref<string[]>(['handbook'])
</script>
