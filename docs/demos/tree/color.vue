<template>
  <div class="grid w-full gap-6 sm:grid-cols-2">
    <div v-for="color in colors" :key="color" class="flex flex-col gap-2">
      <span class="text-xs text-muted">{{ color }}</span>
      <Tree :items="items" :color="color" :default-value="items[0]!.children![1]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'

const colors = ['default', 'accent'] as const

const items: TreeItem[] = [
  {
    label: 'invoices',
    defaultExpanded: true,
    children: [{ label: '2026-08.pdf' }, { label: '2026-09.pdf' }, { label: '2026-10.pdf' }],
  },
  { label: 'contracts', children: [{ label: 'lease.pdf' }] },
]
</script>
