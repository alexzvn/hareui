<template>
  <div class="flex min-h-svh bg-background">
    <Sidebar v-model:open="isOpen" title="Handbook" description="Edition 4">
      <NavigationMenu :items="items" orientation="vertical" type="multiple" />
    </Sidebar>

    <main class="flex min-w-0 flex-1 flex-col">
      <div class="flex h-16 items-center gap-3 px-4">
        <Button
          aria-label="Toggle sidebar"
          icon-only
          size="sm"
          variant="ghost"
          @click="isOpen = !isOpen"
        >
          <Icon icon="gravity-ui:layout-side-content-left" />
        </Button>
        <p class="text-sm text-muted">Working here</p>
        <Icon class="size-3 text-muted" icon="gravity-ui:chevron-right" />
        <p class="text-sm font-medium text-foreground">Time off</p>
      </div>
      <div class="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center md:hidden">
        <p class="text-sm text-muted">Below 768px the sidebar opens as a sheet.</p>
        <Button size="sm" variant="secondary" @click="isOpen = true">
          <Icon icon="gravity-ui:layout-side-content-left" />
          Open sidebar
        </Button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { Button, NavigationMenu, Sidebar } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const isOpen = ref(true)

// Items with `children` collapse; `defaultOpen` expands a group on first render.
const items: NavigationMenuItem[][] = [
  [
    { label: 'Welcome', type: 'label' },
    {
      label: 'Start here',
      children: [
        { label: 'Our mission', href: '#' },
        { label: 'First week', href: '#' },
      ],
    },
  ],
  [
    { label: 'Working here', type: 'label' },
    {
      label: 'Policies',
      defaultOpen: true,
      children: [
        { label: 'Remote work', href: '#' },
        { label: 'Time off', href: '#', active: true },
        { label: 'Expenses', href: '#' },
        { label: 'Equipment', href: '#' },
      ],
    },
  ],
  [
    { label: 'Reference', type: 'label' },
    {
      label: 'Glossary',
      children: [
        { label: 'Teams', href: '#' },
        { label: 'Tools', href: '#' },
      ],
    },
  ],
]
</script>
