<template>
  <Timeline :items="items" size="sm" class="w-full max-w-md">
    <template #note-description="{ item }">
      <div class="mt-2 flex gap-3 rounded-2xl border border-separator p-3">
        <div class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-default">
          <Icon icon="gravity-ui:mug" class="size-6 text-muted" />
        </div>
        <p class="text-xs leading-5 text-muted">{{ item.description }}</p>
      </div>
    </template>
  </Timeline>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Timeline } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: TimelineItem[] = [
  {
    title: 'Priya tasted batch 4',
    date: 'Tue 09:40',
    description: 'Cardamom is too strong. Halve it and steep the milk for two minutes less.',
    slot: 'note',
    avatar: {
      src: 'https://i.pravatar.cc/96?img=32',
      alt: '',
    },
    status: 'current',
  },
  {
    title: 'Mateo updated the recipe card',
    date: 'Tue 11:15',
    description: 'Sugar is now listed per cup instead of per litre.',
    avatar: {
      src: 'https://i.pravatar.cc/96?img=15',
      alt: '',
    },
  },
  {
    title: 'Lena approved the menu',
    date: 'Tue 16:05',
    description: 'Spiced chai goes on the board from Monday.',
    avatar: { fallback: 'LH' },
  },
]
</script>
