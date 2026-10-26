<template>
  <div class="flex w-full flex-col gap-4">
    <NavigationMenu orientation="vertical" :items="items" class="w-60">
      <!-- Buttons before the ⋮ menu: style them with `ui.linkAction()`. -->
      <template #dashboard-actions="{ ui }">
        <button
          type="button"
          aria-label="Notify Dashboard"
          :aria-pressed="shouldNotify"
          :class="ui.linkAction()"
          @click="shouldNotify = !shouldNotify"
        >
          <Icon :icon="shouldNotify ? 'gravity-ui:bell' : 'gravity-ui:bell-slash'" />
        </button>
      </template>
    </NavigationMenu>
    <p class="text-sm text-muted">
      {{ status }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { DropdownEntry, NavigationMenuItem } from '@hareui/vue'
import { NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const shouldNotify = ref(true)
const status = ref('Hover a row, or tab to it, to show its actions.')

const actions = (page: string): DropdownEntry[] => [
  {
    value: 'open',
    label: 'Open',
    icon: icon('folder-open'),
    onSelect: () => (status.value = `Opened ${page}.`),
  },
  {
    value: 'duplicate',
    label: 'Duplicate',
    icon: icon('copy'),
    onSelect: () => (status.value = `Duplicated ${page}.`),
  },
  {
    value: 'delete',
    label: 'Delete',
    icon: icon('trash-bin'),
    variant: 'danger',
    onSelect: () => (status.value = `Deleted ${page}.`),
  },
]

const items: NavigationMenuItem[] = [
  {
    label: 'Dashboard',
    icon: icon('house'),
    active: true,
    slot: 'dashboard',
    actions: actions('Dashboard'),
  },
  {
    label: 'Analytics',
    icon: icon('chart-column'),
    defaultOpen: true,
    children: [
      { label: 'Overview', actions: actions('Overview') },
      { label: 'Reports', actions: actions('Reports') },
      { label: 'Conversions', actions: actions('Conversions') },
    ],
  },
  {
    label: 'Tracker',
    icon: icon('list-check'),
    badge: { label: 'New', color: 'success', variant: 'soft' },
  },
]
</script>
