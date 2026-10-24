<template>
  <div class="shadow-panel w-[250px] space-y-5 rounded-lg bg-transparent p-4">
    <Skeleton class="h-32 rounded-lg" />
    <div class="space-y-3">
      <Skeleton class="h-3 w-3/5 rounded-lg" />
      <Skeleton class="h-3 w-4/5 rounded-lg" />
      <Skeleton class="h-3 w-2/5 rounded-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@hareui/vue'
</script>
