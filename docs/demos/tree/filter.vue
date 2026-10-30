<template>
  <div class="flex w-80 flex-col gap-3">
    <SearchField
      v-model="query"
      aria-label="Filter changed files"
      placeholder="Filter changed files"
    />
    <Tree v-model:expanded="expanded" :items="filtered" empty="No changed files match.">
      <template #item-trailing="{ item }">
        <span v-if="item.changes" class="text-xs text-muted tabular-nums">{{ item.changes }}</span>
      </template>
    </Tree>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { SearchField, Tree } from '@hareui/vue'
import { computed, ref, watch } from 'vue'

const items: TreeItem[] = [
  {
    label: 'mobile/src',
    children: [
      {
        label: 'screens',
        children: [
          { label: 'CheckoutScreen.tsx', changes: '+42 −8' },
          { label: 'OrderHistory.tsx', changes: '+5 −1' },
        ],
      },
      { label: 'hooks/useBasket.ts', changes: '+19 −12' },
    ],
  },
  {
    label: 'backend',
    children: [
      { label: 'payments', children: [{ label: 'refunds.go', changes: '+64 −0' }] },
      { label: 'go.mod', changes: '+1 −1' },
    ],
  },
]

const query = ref('')

// Keeps the files whose name matches, and the folders that still have a match inside.
const filterItems = (list: TreeItem[], needle: string): TreeItem[] =>
  list.flatMap((item) => {
    if (!item.children) return item.label!.toLowerCase().includes(needle) ? [item] : []

    const children = filterItems(item.children, needle)

    return children.length ? [{ ...item, children }] : []
  })

const filtered = computed(() => filterItems(items, query.value.trim().toLowerCase()))

const collectFolders = (list: TreeItem[]): string[] =>
  list.flatMap((item) => (item.children ? [item.label!, ...collectFolders(item.children)] : []))

const expanded = ref<string[]>([])

// Every folder with a match opens while the filter changes; the user can still collapse them.
watch(filtered, (list) => (expanded.value = collectFolders(list)), { immediate: true })
</script>
