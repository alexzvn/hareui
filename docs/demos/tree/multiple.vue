<template>
  <div class="flex w-72 flex-col gap-3">
    <Tree v-model="selected" :items="items" multiple selection-behavior="replace" />
    <p class="text-xs text-muted">Selected: {{ selected.length }}</p>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'
import { ref } from 'vue'

const items: TreeItem[] = [
  {
    label: 'trip-photos',
    defaultExpanded: true,
    children: [
      { label: 'lisbon-tram.jpg' },
      { label: 'porto-bridge.jpg' },
      { label: 'sintra-palace.jpg' },
      { label: 'coast-sunset.jpg' },
    ],
  },
  { label: 'itinerary.pdf' },
]

const selected = ref<TreeItem[]>([])
</script>
