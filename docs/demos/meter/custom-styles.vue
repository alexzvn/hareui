<script setup lang="ts">
import { Meter } from 'herouse'
</script>

<template>
  <Meter
    aria-label="Storage used"
    class="w-64"
    label="Storage used"
    :ui="{
      label: 'font-medium text-foreground',
      output: 'text-muted tabular-nums',
      track: 'rounded-full bg-default',
      fill: 'rounded-full bg-warning',
    }"
    :value="68"
  />
</template>
