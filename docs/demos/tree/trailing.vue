<template>
  <Tree :items="items" class="w-80">
    <template #item-trailing="{ item }">
      <span
        v-if="item.status"
        :class="['w-3 text-center text-xs font-medium', STATUS_CLASS[item.status]]"
      >
        {{ item.status }}
      </span>
    </template>
  </Tree>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'

type Status = 'A' | 'M' | 'D'

const STATUS_CLASS: Record<Status, string> = {
  A: 'text-success',
  M: 'text-warning',
  D: 'text-danger',
}

const items: (TreeItem & { status?: Status })[] = [
  {
    label: 'server',
    defaultExpanded: true,
    children: [
      {
        label: 'routes',
        defaultExpanded: true,
        children: [
          { label: 'bookings.ts', status: 'M' },
          { label: 'waitlist.ts', status: 'A' },
        ],
      },
      { label: 'legacy-cron.ts', status: 'D' },
    ],
  },
  { label: 'README.md', status: 'M' },
]
</script>
