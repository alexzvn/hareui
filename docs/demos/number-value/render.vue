<template>
  <div class="flex flex-col gap-3">
    <div v-for="row in rows" :key="row.label" class="flex items-baseline gap-4">
      <span class="w-28 text-xs text-muted">{{ row.label }}</span>
      <NumberValue
        class="text-xl font-semibold"
        :value="row.change"
        format="percent"
        sign-display="exceptZero"
        :maximum-fraction-digits="1"
      >
        <template #default="{ formatted, value }">
          <span :class="value < 0 ? 'text-danger' : 'text-success'">{{ formatted }}</span>
        </template>
      </NumberValue>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NumberValue } from '@hareui/vue'

const rows = [
  { label: 'Signups', change: 0.124 },
  { label: 'Sessions', change: -0.031 },
  { label: 'Repeat orders', change: 0.008 },
]
</script>
