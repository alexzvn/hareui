<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { DashboardGroup, DashboardPanel, DashboardSidebar, DashboardSidebarToggle, NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Home', icon: gravityIcon('house'), href: '#', active: true },
  { label: 'Inbox', icon: gravityIcon('envelope'), href: '#' },
  { label: 'Contacts', icon: gravityIcon('persons'), href: '#' },
  { label: 'Settings', icon: gravityIcon('gear'), href: '#' },
]
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardSidebar id="aside-main" collapsible resizable :default-size="14" :max-size="22" :min-size="10">
      <template #header="{ collapsed }">
        <div class="flex min-w-0 items-center gap-3 px-1.5 py-2">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground">A</span>
          <span v-if="!collapsed" class="truncate text-sm font-semibold text-foreground">Acme</span>
        </div>
      </template>
      <template #default="{ collapsed }">
        <NavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
      </template>
    </DashboardSidebar>

    <DashboardPanel>
      <template #header>
        <div class="flex h-16 shrink-0 items-center gap-3 px-4">
          <DashboardSidebarToggle />
          <p class="min-w-0 truncate text-sm font-semibold text-foreground">
            Document
          </p>
          <!-- Below `lg` the aside is a sheet; this toggle opens it. -->
          <DashboardSidebarToggle side="right" class="ms-auto">
            <Icon icon="gravity-ui:layout-side-content-right" />
          </DashboardSidebarToggle>
        </div>
      </template>
      <template #body>
        <div class="h-full rounded-xl border border-dashed border-separator bg-surface/50" />
      </template>
    </DashboardPanel>

    <!-- The aside is a right sidebar with its own state: `useDashboard().sidebars.right`. -->
    <DashboardSidebar id="aside-details" aria-label="Details" collapsible resizable side="right" :collapsed-size="0" :default-size="16" :max-size="24" :min-size="12">
      <template #header="{ collapsed }">
        <span v-if="!collapsed" class="truncate text-sm font-semibold">Details</span>
      </template>
      <template #default="{ collapsed }">
        <div v-if="!collapsed" class="h-24 shrink-0 rounded-xl border border-dashed border-separator bg-surface/50" />
      </template>
    </DashboardSidebar>
  </DashboardGroup>
</template>
