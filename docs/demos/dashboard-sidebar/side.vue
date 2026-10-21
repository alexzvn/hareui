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
    <DashboardPanel>
      <template #header>
        <div class="flex h-16 shrink-0 items-center gap-3 px-4">
          <p class="min-w-0 truncate text-sm font-semibold text-foreground">
            Dashboard
          </p>
          <DashboardSidebarToggle side="right" class="ms-auto" />
        </div>
      </template>
      <template #body>
        <div class="h-full rounded-xl border border-dashed border-separator bg-surface/50" />
      </template>
    </DashboardPanel>

    <DashboardSidebar id="side" collapsible resizable side="right" :default-size="14" :max-size="24" :min-size="10">
      <template #default="{ collapsed }">
        <NavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
      </template>
    </DashboardSidebar>
  </DashboardGroup>
</template>
