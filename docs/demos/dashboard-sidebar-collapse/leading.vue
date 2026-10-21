<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { DashboardGroup, DashboardNavbar, DashboardPanel, DashboardSidebar, DashboardSidebarCollapse, NavigationMenu } from '@hareui/vue'
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
    <DashboardSidebar id="collapse-leading" collapsible :default-size="15" :max-size="22" :min-size="12">
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
        <DashboardNavbar title="Home">
          <template #leading>
            <DashboardSidebarCollapse />
          </template>
        </DashboardNavbar>
      </template>
      <template #body>
        <div class="h-full rounded-xl border border-dashed border-separator bg-surface/50" />
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>
