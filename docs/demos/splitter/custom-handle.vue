<template>
  <div class="h-80 w-full overflow-hidden rounded-xl border border-border bg-background">
    <Splitter
      :items="items"
      :ui="{
        handle: 'w-1 bg-accent-soft data-[state=drag]:bg-accent data-[state=hover]:bg-accent',
      }"
    >
      <template #resize-handle="{ index }">
        <span
          class="absolute top-1/2 left-1/2 -translate-1/2 rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground"
        >
          {{ index + 1 }}
        </span>
      </template>

      <template #draft>Draft</template>
      <template #review>Review</template>
      <template #published>Published</template>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Splitter } from '@hareui/vue'

const items: SplitterItem[] = [
  { slot: 'draft', minSize: 20, class: 'items-center justify-center text-sm font-medium' },
  {
    slot: 'review',
    minSize: 20,
    class: 'bg-surface text-surface-foreground items-center justify-center text-sm font-medium',
  },
  { slot: 'published', minSize: 20, class: 'items-center justify-center text-sm font-medium' },
]
</script>
