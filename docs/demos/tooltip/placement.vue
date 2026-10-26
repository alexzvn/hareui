<template>
  <div class="grid grid-cols-3 gap-4">
    <div />
    <Tooltip arrow :delay="0" side="top" text="Top placement">
      <Button class="w-full" variant="tertiary">Top</Button>
    </Tooltip>
    <div />

    <Tooltip arrow :delay="0" side="left" text="Left placement">
      <Button class="w-full" variant="tertiary">Left</Button>
    </Tooltip>

    <div class="flex items-center justify-center">
      <span class="text-sm text-muted">Hover buttons</span>
    </div>

    <Tooltip arrow :delay="0" side="right" text="Right placement">
      <Button class="w-full" variant="tertiary">Right</Button>
    </Tooltip>

    <div />
    <Tooltip arrow :delay="0" side="bottom" text="Bottom placement">
      <Button class="w-full" variant="tertiary">Bottom</Button>
    </Tooltip>
    <div />
  </div>
</template>

<script setup lang="ts">
import { Button, Tooltip } from '@hareui/vue'
</script>
