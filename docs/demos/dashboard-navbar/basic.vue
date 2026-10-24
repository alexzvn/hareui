<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import {
  Chip,
  DashboardGroup,
  DashboardNavbar,
  DashboardPanel,
  DashboardSidebar,
  DashboardSidebarCollapse,
  NavigationMenu,
  Tabs,
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

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
]
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardSidebar
      id="navbar-basic"
      collapsible
      :default-size="14"
      :min-size="12"
      :max-size="18"
    >
      <template #header="{ collapsed }">
        <div class="flex min-w-0 items-center gap-3 px-1.5 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >A</span
          >
          <span v-if="!collapsed" class="truncate text-sm font-semibold text-foreground">Acme</span>
        </div>
      </template>
      <template #default="{ collapsed }">
        <NavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
      </template>
    </DashboardSidebar>

    <DashboardPanel>
      <template #header>
        <DashboardNavbar title="Inbox">
          <template #leading>
            <DashboardSidebarCollapse />
          </template>

          <template #trailing>
            <Chip size="sm" variant="soft" class="max-sm:hidden"> 4 </Chip>
          </template>

          <template #right>
            <Tabs :items="tabs" default-value="all" :content="false" class="w-fit" />
          </template>
        </DashboardNavbar>
      </template>

      <template #body>
        <div
          class="h-full min-h-24 rounded-xl border border-dashed border-separator bg-surface/50"
        />
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>
