<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardSidebar id="navbar-title" :default-size="14" :min-size="12" :max-size="18">
      <template #header>
        <div class="flex min-w-0 items-center gap-3 px-0.5 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >A</span
          >
          <span class="truncate text-sm font-semibold text-foreground">Acme</span>
        </div>
      </template>
      <NavigationMenu :items="items" orientation="vertical" />
    </DashboardSidebar>

    <DashboardPanel>
      <template #header>
        <DashboardNavbar title="Dashboard" />
      </template>

      <template #body>
        <div
          class="h-full min-h-24 rounded-xl border border-dashed border-separator bg-surface/50"
        />
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import {
  DashboardGroup,
  DashboardNavbar,
  DashboardPanel,
  DashboardSidebar,
  NavigationMenu,
} from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

// NavigationMenu takes icon components: wrap an Iconify icon and forward the menu's classes to it.
const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Home', icon: icon('house'), href: '#', active: true },
  { label: 'Inbox', icon: icon('envelope'), href: '#' },
  { label: 'Contacts', icon: icon('persons'), href: '#' },
  { label: 'Settings', icon: icon('gear'), href: '#' },
]
</script>
