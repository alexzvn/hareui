<template>
  <div
    class="w-[250px] space-y-5 rounded-xl border border-border/80 bg-surface p-4 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
  >
    <Skeleton class="h-32 animate-shine rounded-lg bg-neutral-200/90 dark:bg-neutral-800/90" />
    <div class="space-y-3">
      <Skeleton
        class="h-3 w-3/5 animate-shine rounded-lg bg-neutral-200/90 dark:bg-neutral-800/90"
      />
      <Skeleton
        class="h-3 w-4/5 animate-shine rounded-lg bg-neutral-200/90 dark:bg-neutral-800/90"
      />
      <Skeleton
        class="h-3 w-2/5 animate-shine rounded-lg bg-neutral-200/90 dark:bg-neutral-800/90"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@hareui/vue'
</script>
