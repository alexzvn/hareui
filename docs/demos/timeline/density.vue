<template>
  <div class="grid w-full gap-8 sm:grid-cols-2">
    <div v-for="density in densities" :key="density" class="flex flex-col gap-3">
      <p class="text-xs font-medium text-muted">{{ density }}</p>
      <Timeline :items="items" :density="density" size="sm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Timeline } from '@hareui/vue'

const densities = ['compact', 'comfortable'] as const

const items: TimelineItem[] = [
  { title: 'Ticket opened', date: '08:12' },
  { title: 'Assigned to Priya', date: '08:15' },
  { title: 'Replacement shipped', date: '11:40' },
  { title: 'Ticket closed', date: '16:02' },
]
</script>
