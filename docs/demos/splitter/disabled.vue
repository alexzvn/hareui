<template>
  <div class="h-64 w-full overflow-hidden rounded-xl border border-border bg-background">
    <Splitter disabled :items="items" type="drag">
      <template #seats>Seat map</template>
      <template #summary>Summary</template>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Splitter } from '@hareui/vue'

const items: SplitterItem[] = [
  {
    slot: 'seats',
    defaultSize: 65,
    class: 'bg-surface text-surface-foreground items-center justify-center text-sm font-medium',
  },
  {
    slot: 'summary',
    defaultSize: 35,
    class: 'items-center justify-center text-sm font-medium',
  },
]
</script>
