<template>
  <ColorSlider
    channel="hue"
    class="w-full max-w-sm"
    default-value="hsl(220, 70%, 50%)"
    label="Hue"
    :ui="{
      label: 'font-medium text-foreground',
      output: 'text-muted tabular-nums',
      track:
        'h-4! rounded-none! ring-1 ring-border [&::after]:rounded-r-sm! [&::before]:rounded-l-sm!',
      thumb:
        'size-4 rounded-sm! border-2 border-background shadow-md ring-1 ring-black/10 dark:ring-white/20',
    }"
  />
</template>

<script setup lang="ts">
import { ColorSlider } from '@hareui/vue'
</script>
