<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { Button, NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[][] = [
  [
    { label: 'Personal', type: 'label', slot: 'personal-label' },
    { label: 'Design System', icon: icon('folder'), active: true },
    { label: 'Travel', icon: icon('folder') },
  ],
  [
    { label: 'Teams', type: 'label', slot: 'teams-label' },
    { label: 'Engineering', icon: icon('folder') },
    { label: 'Marketing', icon: icon('folder') },
  ],
]

const updated: Record<string, string> = {
  'Design System': '2h',
  'Travel': '3d',
  'Engineering': '5m',
  'Marketing': '1w',
}
const updatedOf = (item: NavigationMenuItem) => updated[item.label ?? '']
</script>

<template>
  <NavigationMenu orientation="vertical" :items="items" class="w-64">
    <template #personal-label-trailing>
      <Button aria-label="New personal project" class="size-6" icon-only size="sm" variant="ghost">
        <Icon icon="gravity-ui:plus" />
      </Button>
    </template>
    <template #teams-label-trailing>
      <Button aria-label="New team project" class="size-6" icon-only size="sm" variant="ghost">
        <Icon icon="gravity-ui:plus" />
      </Button>
    </template>
    <template #item-trailing="{ item }">
      <span class="ms-auto text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {{ updatedOf(item) }}
      </span>
    </template>
  </NavigationMenu>
</template>
