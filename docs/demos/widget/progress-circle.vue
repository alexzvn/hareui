<template>
  <Widget class="w-full max-w-[360px]" title="Storage" description="Team plan">
    <div class="flex items-center gap-4">
      <ProgressCircle aria-label="Storage used" :value="68" size="lg" />
      <div class="flex flex-col">
        <span class="text-2xl font-semibold text-foreground tabular-nums">68%</span>
        <span class="text-xs text-muted">340 GB of 500 GB used</span>
      </div>
    </div>
  </Widget>
</template>

<script setup lang="ts">
import { ProgressCircle, Widget } from '@hareui/vue'
</script>
