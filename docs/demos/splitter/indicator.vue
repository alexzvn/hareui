<template>
  <div class="h-96 w-full overflow-hidden rounded-xl border border-border bg-background">
    <Splitter indicator :items="items">
      <template #original>Original</template>
      <template #translation>Translation</template>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Splitter } from '@hareui/vue'

const items: SplitterItem[] = [
  {
    slot: 'original',
    defaultSize: 45,
    minSize: 20,
    class: 'bg-surface text-surface-foreground items-center justify-center text-sm font-medium',
  },
  {
    slot: 'translation',
    defaultSize: 55,
    minSize: 20,
    class: 'items-center justify-center text-sm font-medium',
  },
]
</script>
