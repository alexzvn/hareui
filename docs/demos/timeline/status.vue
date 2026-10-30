<template>
  <Timeline :items="items" size="sm" density="compact" class="w-full max-w-md" />
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
    title: 'Nightly backup verified',
    description: 'All 412 tables match their checksums.',
    status: 'success',
    icon: icon('circle-check'),
  },
  {
    title: 'Restoring last snapshot',
    description: 'The staging copy is being rebuilt from 02:00.',
    status: 'current',
    icon: icon('arrow-rotate-left'),
  },
  {
    title: 'Disk usage above 85%',
    description: 'Older archives will be moved to cold storage.',
    status: 'warning',
    icon: icon('triangle-exclamation'),
  },
  {
    title: 'Replica lost connection',
    description: 'Failover kicked in after 30 seconds.',
    status: 'danger',
    icon: icon('circle-xmark'),
  },
  { title: 'Snapshot scheduled', description: 'Runs every night at 02:00.', icon: icon('clock') },
  { title: 'Old policy retired', status: 'muted', icon: icon('archive') },
]
</script>
