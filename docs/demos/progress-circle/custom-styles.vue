<template>
  <ProgressCircle
    aria-label="Sync progress"
    class="size-14 text-neutral-700 dark:text-neutral-300"
    :ui="{
      trackCircle: 'stroke-neutral-200 dark:stroke-neutral-800',
      fillCircle: 'stroke-neutral-700 dark:stroke-neutral-300',
    }"
    :value="68"
  />
</template>

<script setup lang="ts">
import { ProgressCircle } from '@hareui/vue'
</script>
