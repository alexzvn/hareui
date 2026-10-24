<script setup lang="ts">
import { Button, Tooltip } from '@hareui/vue'
</script>

<template>
  <Tooltip
    :delay="0"
    text="Copied to clipboard"
    :ui="{
      base: 'rounded-lg border border-border/80 bg-surface px-2.5 py-1 text-xs text-foreground shadow-sm',
    }"
  >
    <Button variant="secondary">Share link</Button>
  </Tooltip>
</template>
