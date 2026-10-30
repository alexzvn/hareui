<template>
  <Timeline :items="items" size="sm" class="w-full max-w-md">
    <template #release-description="{ item }">
      <Card class="mt-2" variant="secondary">
        <p class="text-sm font-medium text-foreground">{{ item.description }}</p>
        <ul class="flex flex-wrap gap-1.5">
          <li v-for="change in item.changes" :key="change">
            <Chip size="sm" variant="soft">{{ change }}</Chip>
          </li>
        </ul>
      </Card>
    </template>
  </Timeline>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Card, Chip, Timeline } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

type Release = TimelineItem & { changes?: string[] }

const items: Release[] = [
  {
    title: 'Version 3.2 released',
    date: 'Today',
    description: 'Offline mode for field notes',
    slot: 'release',
    changes: ['Offline sync', 'Photo captions', '12 fixes'],
    icon: icon('rocket'),
    status: 'success',
  },
  {
    title: 'Beta opened to 200 testers',
    date: 'Last week',
    description: 'Feedback collected through the in-app form.',
    icon: icon('persons'),
  },
  {
    title: 'Version 3.1 released',
    date: 'Last month',
    description: 'Dark mode and faster search',
    slot: 'release',
    changes: ['Dark mode', 'Search index', '8 fixes'],
    icon: icon('rocket'),
  },
]
</script>
