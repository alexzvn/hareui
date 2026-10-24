<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
</script>

<template>
  <NumberStepper aria-label="Locker number" :default-value="7" :min="1" :max="48">
    <template #value="{ value }">
      <span class="px-3 font-mono tabular-nums">Locker #{{ String(value).padStart(2, '0') }}</span>
    </template>
  </NumberStepper>
</template>
