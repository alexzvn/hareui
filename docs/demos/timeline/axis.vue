<template>
  <Timeline :items="items" axis="center" size="sm" class="w-full max-w-xl">
    <template #date="{ item }">
      <span class="font-medium text-foreground">{{ item.date }}</span>
      <span class="block text-muted">{{ item.lead }}</span>
    </template>
  </Timeline>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Timeline } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: TimelineItem[] = [
  {
    date: '08:30',
    lead: 'Hana Ito',
    title: 'Venue walkthrough',
    description: 'Stage, loading bay and the two breakout rooms checked.',
    icon: icon('map-pin'),
  },
  {
    date: '11:00',
    lead: 'Luis Ortega',
    title: 'Sound check',
    description: 'Wireless mics swapped after a dropout on channel 3.',
    icon: icon('microphone'),
    status: 'warning',
  },
  {
    date: '14:15',
    lead: 'Hana Ito',
    title: 'Catering confirmed',
    description: 'Final headcount of 180, with 22 vegetarian meals.',
    icon: icon('mug'),
  },
]
</script>
