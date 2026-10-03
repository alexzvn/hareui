<script setup lang="ts">
import { Button, Tooltip } from '@hareui/vue'
</script>

<template>
  <div class="flex items-center gap-4">
    <Tooltip arrow :delay="0" text="Tooltip with arrow indicator">
      <Button variant="secondary">With Arrow</Button>
    </Tooltip>

    <Tooltip arrow :delay="0" :side-offset="12" text="Custom offset from trigger">
      <Button variant="primary">Custom Offset</Button>
    </Tooltip>
  </div>
</template>
