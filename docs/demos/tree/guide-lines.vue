<template>
  <div class="grid w-full gap-6 sm:grid-cols-3">
    <div v-for="mode in modes" :key="mode.label" class="flex min-w-0 flex-col gap-2">
      <span class="text-xs text-muted">{{ mode.label }}</span>
      <Tree :items="items" :show-guide-lines="mode.value" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'

const modes = [
  { label: 'always', value: true },
  { label: 'hover', value: 'hover' },
  { label: 'none', value: false },
] as const

const items: TreeItem[] = [
  {
    label: 'course',
    defaultExpanded: true,
    children: [
      {
        label: 'week-1',
        defaultExpanded: true,
        children: [{ label: 'reading.pdf' }, { label: 'quiz.md' }],
      },
      { label: 'week-2', defaultExpanded: true, children: [{ label: 'lab.ipynb' }] },
    ],
  },
  { label: 'syllabus.md' },
]
</script>
