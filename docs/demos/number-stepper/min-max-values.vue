<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-6">
      <div class="flex flex-col">
        <span class="text-sm text-foreground">Spice level</span>
        <span class="text-xs text-muted">1 to 3</span>
      </div>
      <NumberStepper aria-label="Spice level" :default-value="2" :min="1" :max="3" />
    </div>
    <div class="flex items-center justify-between gap-6">
      <div class="flex flex-col">
        <span class="text-sm text-foreground">UTC offset</span>
        <span class="text-xs text-muted">−12 to +14</span>
      </div>
      <NumberStepper aria-label="UTC offset" :default-value="1" :min="-12" :max="14" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
</script>
