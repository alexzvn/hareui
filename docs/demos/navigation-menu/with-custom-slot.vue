<script setup lang="ts">
import type { DropdownEntry, NavigationMenuItem } from '@hareui/vue'
import { Button, Chip, Dropdown, NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const moreItems: DropdownEntry[] = [
  { value: 'composables', label: 'Composables', icon: 'gravity-ui:database' },
  { value: 'components', label: 'Components', icon: 'gravity-ui:box' },
]

const items: NavigationMenuItem[] = [
  { label: 'Guide', icon: icon('book-open'), href: '#guide' },
  { label: 'Composables', icon: icon('database'), href: '#composables', class: 'hidden' },
  { label: 'Components', icon: icon('box'), href: '#components', class: 'hidden' },
  { slot: 'more', as: 'span', class: 'p-0' },
  { label: 'GitHub', icon: icon('logo-github'), href: 'https://github.com/alexzvn/hareui', target: '_blank', slot: 'github' },
]
</script>

<template>
  <NavigationMenu :items="items" :ui="{ linkLabel: 'max-sm:sr-only' }" class="w-full justify-center">
    <template #more>
      <Dropdown :items="moreItems" align="start">
        <Button variant="ghost" size="sm" aria-label="More">
          More
          <Icon icon="gravity-ui:chevron-down" />
        </Button>
        <template #item-leading="{ item }">
          <Icon class="size-4 shrink-0 text-muted" :icon="item.icon" />
        </template>
      </Dropdown>
    </template>
    <template #github-trailing>
      <Chip label="6k+" size="sm" />
    </template>
  </NavigationMenu>
</template>
