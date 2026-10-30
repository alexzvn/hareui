<template>
  <div class="flex min-h-svh bg-background">
    <Sidebar v-model:open="isOpen">
      <template #header>
        <div class="flex min-w-0 items-center gap-3 px-1 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >L</span
          >
          <span class="truncate text-sm font-semibold text-foreground">Lumen</span>
        </div>
      </template>

      <NavigationMenu :items="items" orientation="vertical" />

      <template #footer>
        <NavigationMenu aria-label="Account" :items="account" orientation="vertical" />
      </template>
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
        <p class="text-sm font-semibold text-foreground">Overview</p>
      </div>
      <p class="px-6 text-muted max-md:hidden">
        Shrink the preview below 768px to open the sidebar as a sheet.
      </p>
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
import { h, ref } from 'vue'

const isOpen = ref(true)

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Overview', icon: gravityIcon('house'), href: '#', active: true },
  {
    label: 'Reports',
    icon: gravityIcon('chart-column'),
    defaultOpen: true,
    children: [
      { label: 'Revenue', href: '#' },
      { label: 'Retention', href: '#' },
      { label: 'Funnels', href: '#' },
    ],
  },
  { label: 'Invoices', icon: gravityIcon('receipt'), href: '#', badge: '3' },
  { label: 'Settings', icon: gravityIcon('gear'), children: [{ label: 'Billing', href: '#' }] },
]

const account: NavigationMenuItem[] = [
  { label: 'Support', icon: gravityIcon('circle-question'), href: '#' },
  { label: 'Sign out', icon: gravityIcon('arrow-right-from-square'), href: '#' },
]
</script>
