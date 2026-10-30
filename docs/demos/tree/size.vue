<template>
  <div class="grid w-full gap-6 sm:grid-cols-3">
    <div v-for="size in sizes" :key="size" class="flex flex-col gap-2">
      <span class="text-xs text-muted">{{ size }}</span>
      <Tree :items="items" :size="size" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'

const sizes = ['sm', 'md', 'lg'] as const

const items: TreeItem[] = [
  {
    label: 'album',
    defaultExpanded: true,
    children: [
      {
        label: 'side-a',
        defaultExpanded: true,
        children: [{ label: 'intro.wav' }, { label: 'harbour.wav' }],
      },
      { label: 'artwork.png' },
    ],
  },
  { label: 'liner-notes.md' },
]
</script>
