<script setup lang="ts">
import type { ListBoxItem, SelectValue } from '@hareui/vue'
import { InlineSelect } from '@hareui/vue'
import { ref } from 'vue'

const ranges: ListBoxItem[] = [
  { value: '7d', label: 'last 7 days' },
  { value: '30d', label: 'last 30 days' },
  { value: '90d', label: 'last 90 days' },
  { value: '12m', label: 'last 12 months' },
]

const range = ref<SelectValue>('30d')
</script>

<template>
  <div class="text-sm text-foreground">
    Showing revenue for the
    <InlineSelect v-model="range" aria-label="Date range" :items="ranges" :ui="{ trigger: '-my-0.5', popover: 'w-44' }" />
    across all workspaces.
  </div>
</template>
