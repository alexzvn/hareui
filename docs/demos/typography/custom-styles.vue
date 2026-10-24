<template>
  <div
    class="flex max-w-md flex-col gap-2 rounded-xl border border-border/80 bg-surface-secondary p-4"
  >
    <Typography class="text-xs font-medium tracking-wide text-accent uppercase" type="body-xs">
      Changelog
    </Typography>
    <Typography class="font-semibold tracking-tight text-foreground" type="h4">
      Faster search results
    </Typography>
    <Typography class="text-sm leading-relaxed text-muted" type="body-sm">
      Queries now return in under 200ms thanks to an improved index.
    </Typography>
  </div>
</template>

<script setup lang="ts">
import { Typography } from '@hareui/vue'
</script>
