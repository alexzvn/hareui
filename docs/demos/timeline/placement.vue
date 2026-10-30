<template>
  <Timeline :items="items" axis="center" placement="alternate" size="sm" class="w-full max-w-xl" />
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
    date: 'Spring 2024',
    title: 'Library closes for works',
    description: 'Lending moves to the pop-up branch on Mill Street.',
    icon: icon('lock'),
  },
  {
    date: 'Autumn 2024',
    title: 'New reading room',
    description: 'Skylights and 60 study desks on the first floor.',
    icon: icon('book-open'),
  },
  {
    date: 'Winter 2025',
    title: "Children's wing",
    description: 'Story corner, craft tables and a puppet theatre.',
    icon: icon('face-smile'),
  },
  {
    date: 'Summer 2025',
    title: 'Grand reopening',
    description: 'Free membership week with late opening hours.',
    icon: icon('star'),
    status: 'success',
  },
]
</script>
