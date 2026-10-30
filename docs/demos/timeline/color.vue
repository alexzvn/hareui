<template>
  <div class="grid w-full gap-8 sm:grid-cols-2">
    <Timeline
      v-for="color in colors"
      :key="color"
      :items="items"
      :color="color"
      default-value="proof"
      size="sm"
    />
  </div>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Timeline } from '@hareui/vue'

const colors = ['accent', 'success', 'warning', 'danger'] as const

const items: TimelineItem[] = [
  { value: 'brief', title: 'Brief agreed', date: 'May 2' },
  { value: 'sketch', title: 'Sketches shared', date: 'May 6' },
  { value: 'proof', title: 'Print proof', date: 'May 11' },
  { value: 'press', title: 'On press', date: 'May 15' },
]
</script>
