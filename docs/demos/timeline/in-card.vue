<template>
  <Card class="w-full max-w-sm">
    <template #header>
      <h3 class="text-base font-semibold text-foreground">Edit history</h3>
    </template>

    <Timeline :items="items" size="sm" density="compact">
      <template #description="{ item }">
        <span>{{ item.description }}</span>
        <span class="mt-1 block text-foreground">{{ item.author }} · {{ item.when }}</span>
      </template>
    </Timeline>
  </Card>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Card, Timeline } from '@hareui/vue'

const items: TimelineItem[] = [
  {
    title: 'Budget 2026, rev 6',
    description: 'Moved travel costs into a separate tab.',
    author: 'Noor Lindqvist',
    when: 'Open in another tab',
    status: 'current',
  },
  {
    title: 'Rev 5',
    description: 'Approved by the finance lead.',
    author: 'Felix Osei',
    when: 'Mar 4, 4:40 PM',
    status: 'success',
  },
  {
    title: 'Rev 4',
    description: 'Rounded every figure to the nearest hundred.',
    author: 'Noor Lindqvist',
    when: 'Mar 3, 10:12 AM',
  },
  {
    title: 'Rev 3',
    description: 'Imported last year as a starting point.',
    author: 'Ruth Calder',
    when: 'Feb 27, 6:25 PM',
  },
]
</script>
