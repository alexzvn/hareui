<template>
  <div class="w-full max-w-md">
    <ListView v-model="selected" :items="items" selectable multiple aria-label="Project files" />
    <p class="mt-3 text-sm text-muted">Selected: {{ selected.join(', ') || 'none' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ListViewItem, ListViewValue } from '@hareui/vue'
import { ListView } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: ListViewItem[] = [
  {
    value: 'brand',
    label: 'Brand assets',
    description: 'Edited 3 hours ago',
    icon: icon('folder'),
  },
  {
    value: 'report',
    label: 'Quarterly report.pdf',
    description: 'Edited yesterday',
    icon: icon('file-text'),
  },
  {
    value: 'interviews',
    label: 'Interview notes',
    description: 'Edited 2 days ago',
    icon: icon('folder'),
  },
  {
    value: 'budget',
    label: 'Budget 2027.xlsx',
    description: 'Edited last week',
    icon: icon('file'),
  },
  {
    value: 'launch',
    label: 'Launch plan.md',
    description: 'Edited last month',
    icon: icon('file-text'),
  },
]

const selected = ref<ListViewValue[]>(['report'])
</script>
