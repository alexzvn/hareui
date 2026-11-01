<template>
  <div class="w-full max-w-md">
    <ListView :items="items" aria-label="Inbox" @action="(value) => (opened = String(value))" />
    <p class="mt-3 text-sm text-muted">Opened: {{ opened ?? 'nothing yet' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ListViewItem } from '@hareui/vue'
import { ListView } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: ListViewItem[] = [
  {
    value: 'invoice',
    label: 'Invoice #4021',
    description: 'Northwind Traders',
    icon: icon('envelope'),
  },
  { value: 'offsite', label: 'Offsite agenda', description: 'Priya Raman', icon: icon('envelope') },
  {
    value: 'release',
    label: 'Release notes draft',
    description: 'Tom Becker',
    icon: icon('envelope'),
  },
]

const opened = ref<string>()
</script>
