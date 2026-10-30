<template>
  <ProgressBar
    aria-label="Upload progress"
    class="w-64"
    label="Uploading resume.pdf"
    :ui="{
      label: 'font-medium text-foreground',
      output: 'text-xs text-muted tabular-nums',
      track: 'rounded-full bg-default',
      fill: 'rounded-full bg-accent',
    }"
    :value="45"
  />
</template>

<script setup lang="ts">
import { ProgressBar } from '@hareui/vue'
</script>
