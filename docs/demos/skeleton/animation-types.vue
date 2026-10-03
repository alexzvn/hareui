<script setup lang="ts">
import { Skeleton } from '@hareui/vue'

const types = [
  { type: 'shimmer', label: 'Shimmer' },
  { type: 'pulse', label: 'Pulse' },
  { type: 'none', label: 'None' },
] as const
</script>

<template>
  <div class="grid w-full max-w-xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="item in types" :key="item.type" class="space-y-2">
      <p class="truncate text-xs text-muted">{{ item.label }}</p>
      <div class="shadow-panel space-y-3 rounded-lg bg-transparent p-4">
        <Skeleton :animation-type="item.type" class="h-20 rounded-lg" />
        <Skeleton :animation-type="item.type" class="h-3 w-3/5 rounded-lg" />
        <Skeleton :animation-type="item.type" class="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  </div>
</template>
