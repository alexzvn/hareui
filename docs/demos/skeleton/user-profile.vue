<template>
  <div class="flex items-center gap-3">
    <Skeleton class="h-10 w-10 shrink-0 rounded-full" />
    <div class="flex-1 space-y-2">
      <Skeleton class="h-3 w-36 rounded-lg" />
      <Skeleton class="h-3 w-24 rounded-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@hareui/vue'
</script>
