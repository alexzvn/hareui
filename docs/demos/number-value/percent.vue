<template>
  <div class="flex flex-col gap-3">
    <div v-for="row in rows" :key="row.label" class="flex items-baseline gap-4">
      <span class="w-28 text-xs text-muted">{{ row.label }}</span>
      <NumberValue
        class="text-2xl font-semibold"
        :value="row.value"
        format="percent"
        :maximum-fraction-digits="1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NumberValue } from '@hareui/vue'

// `percent` multiplies by 100: pass the fraction.
const rows = [
  { label: 'Open rate', value: 0.418 },
  { label: 'Bounce rate', value: 0.027 },
  { label: 'Uptime', value: 0.9935 },
]
</script>
