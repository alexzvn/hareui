<template>
  <div class="flex w-full flex-col gap-6">
    <div v-for="type in types" :key="type" class="flex flex-col gap-2">
      <span class="text-xs font-medium tracking-wide text-muted uppercase">{{ type }}</span>
      <div class="h-44 w-full overflow-hidden rounded-xl border border-border bg-background">
        <Splitter :items="items" :type="type">
          <template #before>Before</template>
          <template #after>After</template>
        </Splitter>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Splitter } from '@hareui/vue'

const types = ['line', 'drag', 'pill', 'handle'] as const

const items: SplitterItem[] = [
  {
    slot: 'before',
    defaultSize: 50,
    minSize: 20,
    class: 'bg-surface text-surface-foreground items-center justify-center text-sm font-medium',
  },
  {
    slot: 'after',
    defaultSize: 50,
    minSize: 20,
    class: 'items-center justify-center text-sm font-medium',
  },
]
</script>
