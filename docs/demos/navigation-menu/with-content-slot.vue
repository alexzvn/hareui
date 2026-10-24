<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  {
    label: 'Docs',
    icon: icon('book-open'),
    slot: 'docs',
    children: [
      { label: 'Icons', description: 'Use any icon set with HareUI components.' },
      { label: 'Colors', description: 'Choose a primary and neutral color for your app.' },
      { label: 'Theme', description: 'Customize the look of every component from one config.' },
    ],
  },
  {
    label: 'Components',
    icon: icon('box'),
    slot: 'components',
    children: [
      { label: 'Link', description: 'Style any element as a link.' },
      { label: 'Modal', description: 'Display a modal within your application.' },
      { label: 'NavigationMenu', description: 'Display a list of links.' },
      { label: 'Pagination', description: 'Display a list of pages.' },
      {
        label: 'Popover',
        description: 'Display a non-modal dialog that floats around a trigger element.',
      },
      { label: 'Progress', description: 'Show a horizontal bar to indicate task progression.' },
    ],
  },
  { label: 'GitHub', icon: icon('logo-github') },
]
</script>

<template>
  <NavigationMenu
    :items="items"
    :ui="{
      viewport: 'sm:w-(--reka-navigation-menu-viewport-width)',
      content: 'sm:w-auto',
      childList: 'sm:w-96',
      childLinkDescription: 'text-balance line-clamp-2',
      linkLabel: 'max-sm:sr-only',
    }"
    class="w-full justify-center"
  >
    <template #docs-content="{ item }">
      <ul class="grid gap-2 p-4 lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
        <li class="row-span-3">
          <a
            class="flex size-full flex-col justify-end gap-1 rounded-xl bg-default p-4 text-left text-sm lg:min-h-48"
            href="#"
          >
            <Icon class="mb-2 size-6 text-accent" icon="gravity-ui:book-open" />
            <p class="font-medium text-foreground">HareUI docs</p>
            <p class="text-muted">Guides, theming and every component, in one place.</p>
          </a>
        </li>
        <li v-for="child in item.children" :key="child.label">
          <a
            class="block rounded-xl p-3 text-left text-sm transition-colors hover:bg-default"
            href="#"
          >
            <p class="font-medium text-foreground">
              {{ child.label }}
            </p>
            <p class="line-clamp-2 text-muted">
              {{ child.description }}
            </p>
          </a>
        </li>
      </ul>
    </template>
  </NavigationMenu>
</template>
