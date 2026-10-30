<template>
  <div class="grid w-full gap-6 sm:grid-cols-2">
    <div class="flex flex-col gap-2">
      <span class="text-xs text-muted">Disabled items</span>
      <Tree :items="items" />
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-xs text-muted">Disabled tree</span>
      <Tree :items="items" disabled />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'

const items: TreeItem[] = [
  {
    label: 'exports',
    defaultExpanded: true,
    children: [{ label: 'report-final.pdf' }, { label: 'report-processing.pdf', disabled: true }],
  },
  { label: 'archive', disabled: true, children: [{ label: '2024.zip' }] },
]
</script>
