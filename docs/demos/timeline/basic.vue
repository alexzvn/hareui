<template>
  <Timeline :items="items" class="w-full max-w-sm" />
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
    date: 'March 3',
    title: 'Soil delivered',
    description: 'Twelve raised beds filled with compost mix.',
    icon: icon('box'),
  },
  {
    date: 'March 18',
    title: 'Seeds sown',
    description: 'Tomatoes, basil and runner beans in the greenhouse.',
    icon: icon('sun'),
  },
  {
    date: 'April 9',
    title: 'Volunteer rota published',
    description: 'Watering shifts run every evening until June.',
    icon: icon('persons'),
  },
  {
    date: 'June 21',
    title: 'First harvest',
    description: 'Shared out at the Saturday market stall.',
    icon: icon('gift'),
  },
]
</script>
