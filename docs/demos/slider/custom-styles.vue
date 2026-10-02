<script setup lang="ts">
import { Slider } from 'herouse'
</script>

<template>
  <Slider
    class="w-full max-w-xs"
    label="Brightness"
    :default-value="40"
    :ui="{
      label: 'font-medium text-foreground',
      output: 'text-xs text-muted tabular-nums',
      track: 'bg-default',
      fill: 'bg-accent',
      thumb: 'bg-accent after:bg-accent-foreground',
    }"
  />
</template>
