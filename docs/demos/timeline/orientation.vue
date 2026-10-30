<template>
  <Timeline :items="items" orientation="horizontal" :default-value="1" class="w-full" />
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Timeline } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: TimelineItem[] = [
  { date: '09:00', title: 'Doors open', icon: icon('ticket') },
  { date: '10:30', title: 'Opening talk', icon: icon('microphone') },
  { date: '12:30', title: 'Lunch', icon: icon('mug') },
  { date: '14:00', title: 'Workshops', icon: icon('wrench') },
]
</script>
