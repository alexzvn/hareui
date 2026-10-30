<template>
  <Timeline :items="items" default-value="draft-3" reverse class="w-full max-w-sm" />
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Timeline } from '@hareui/vue'

// Newest first: the drafts below the active one are already done.
const items: TimelineItem[] = [
  { value: 'final', title: 'Final manuscript', date: 'Due Nov 30' },
  {
    value: 'draft-3',
    title: 'Third draft',
    date: 'Oct 12',
    description: 'Chapters 9 to 14 rewritten.',
  },
  { value: 'draft-2', title: 'Second draft', date: 'Aug 28', description: 'Editor notes applied.' },
  {
    value: 'draft-1',
    title: 'First draft',
    date: 'Jun 3',
    description: 'All fourteen chapters written.',
  },
]
</script>
