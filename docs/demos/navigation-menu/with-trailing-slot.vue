<script setup lang="ts">
import type { DropdownEntry, NavigationMenuItem } from '@hareui/vue'
import { Button, Dropdown, NavigationMenu } from '@hareui/vue'
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

const actions: DropdownEntry[] = [
  { value: 'view', label: 'View Project', icon: 'gravity-ui:folder-open' },
  { value: 'share', label: 'Share Project', icon: 'gravity-ui:link' },
  { type: 'separator' },
  { value: 'delete', label: 'Delete Project', icon: 'gravity-ui:trash-bin', variant: 'danger' },
]
</script>

<template>
  <NavigationMenu orientation="vertical" :items="items" :ui="{ link: 'group/link overflow-hidden has-data-[state=open]:bg-default' }" class="w-64">
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
    <template #item-trailing>
      <div class="-mr-1.5 flex translate-x-full transition-transform group-hover/link:translate-x-0 has-data-[state=open]:translate-x-0">
        <Dropdown :items="actions" align="start">
          <Button as="div" aria-label="Project actions" class="mr-1.5 size-6 text-muted" icon-only size="sm" variant="ghost">
            <Icon icon="gravity-ui:ellipsis" />
          </Button>
          <template #item-leading="{ item }">
            <Icon class="size-4 shrink-0" :class="item.variant === 'danger' ? 'text-danger' : 'text-muted'" :icon="item.icon" />
          </template>
        </Dropdown>
      </div>
    </template>
  </NavigationMenu>
</template>
