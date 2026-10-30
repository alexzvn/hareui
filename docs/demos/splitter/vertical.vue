<template>
  <div class="h-96 w-full overflow-hidden rounded-xl border border-border bg-background">
    <Splitter :items="items" orientation="vertical">
      <template #request>Request</template>
      <template #response>Response</template>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Splitter } from '@hareui/vue'

const items: SplitterItem[] = [
  {
    slot: 'request',
    defaultSize: 55,
    minSize: 25,
    class: 'items-center justify-center text-sm font-medium',
  },
  {
    slot: 'response',
    defaultSize: 45,
    minSize: 25,
    class: 'bg-surface text-surface-foreground items-center justify-center text-sm font-medium',
  },
]
</script>
