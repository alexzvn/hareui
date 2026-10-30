<template>
  <div class="flex w-full flex-col gap-6">
    <div v-for="option in options" :key="option.variant" class="flex flex-col gap-2">
      <span class="text-xs font-medium tracking-wide text-muted uppercase">
        {{ option.variant }} on {{ option.label }}
      </span>
      <div
        class="h-40 w-full overflow-hidden rounded-xl border border-border"
        :class="option.surface"
      >
        <Splitter :items="items" :variant="option.variant">
          <template #income>Income</template>
          <template #expenses>Expenses</template>
        </Splitter>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Splitter } from '@hareui/vue'

const options = [
  { variant: 'primary', label: 'background', surface: 'bg-background text-foreground' },
  { variant: 'secondary', label: 'surface', surface: 'bg-surface text-surface-foreground' },
  {
    variant: 'tertiary',
    label: 'secondary surface',
    surface: 'bg-surface-secondary text-surface-secondary-foreground',
  },
] as const

const items: SplitterItem[] = [
  { slot: 'income', class: 'items-center justify-center text-sm font-medium' },
  { slot: 'expenses', class: 'items-center justify-center text-sm font-medium' },
]
</script>
