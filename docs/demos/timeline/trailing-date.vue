<template>
  <Timeline
    :items="items"
    size="sm"
    density="compact"
    class="w-full max-w-md"
    :ui="{
      wrapper: 'grid grid-cols-[minmax(0,1fr)_auto] gap-x-4',
      date: 'col-start-2 row-start-1',
      description: 'col-span-2',
    }"
  />
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
    title: 'Refund issued',
    date: 'Feb 14, 4:52 PM',
    description: 'The duplicate charge of $18.00 was returned to the card ending 4417.',
    icon: icon('arrow-rotate-left'),
    status: 'success',
  },
  {
    title: 'Duplicate charge flagged',
    date: 'Feb 14, 4:31 PM',
    icon: icon('triangle-exclamation'),
    status: 'warning',
  },
  { title: 'Payment captured', date: 'Feb 14, 4:30 PM', icon: icon('credit-card') },
  { title: 'Invoice sent', date: 'Feb 14, 4:28 PM', icon: icon('envelope') },
]
</script>
