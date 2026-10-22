<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'

const rows = [
  { variant: 'primary', label: 'Pull requests', pill: true },
  { variant: 'secondary', label: 'Reviewers', pill: true },
  { variant: 'tertiary', label: 'Retries', pill: false },
  { variant: 'outline', label: 'Workers', pill: false },
] as const
</script>

<template>
  <div class="flex w-[300px] max-w-full flex-col gap-3">
    <div v-for="row in rows" :key="row.variant" class="flex items-center justify-between gap-4">
      <div class="flex flex-col">
        <span class="text-sm text-foreground">{{ row.label }}</span>
        <span class="text-xs text-muted">{{ row.variant }}</span>
      </div>
      <NumberStepper
        :aria-label="row.label"
        :default-value="2"
        :min="0"
        :increment="{ variant: row.variant, size: 'sm' }"
        :decrement="{ variant: row.variant, size: 'sm' }"
        :ui="{ group: row.pill ? 'gap-2' : 'gap-2 bg-transparent' }"
      />
    </div>
  </div>
</template>
