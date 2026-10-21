<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { DashboardGroup, DashboardNavbar, DashboardPanel, DashboardSidebar, DashboardSidebarCollapse, NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const details: NavigationMenuItem[] = [
  { label: 'Members', icon: gravityIcon('persons'), href: '#', active: true },
  { label: 'Files', icon: gravityIcon('folder'), href: '#' },
  { label: 'Pinned', icon: gravityIcon('pin'), href: '#' },
]
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardPanel>
      <template #header>
        <!-- Below `lg` the collapse button hides and the navbar's toggle opens the details as a sheet. -->
        <DashboardNavbar title="Conversation" toggle-side="right">
          <template #right>
            <DashboardSidebarCollapse side="right" />
          </template>
        </DashboardNavbar>
      </template>
      <template #body>
        <div class="h-full rounded-xl border border-dashed border-separator bg-surface/50" />
      </template>
    </DashboardPanel>

    <DashboardSidebar id="collapse-aside" collapsible side="right" :default-size="15" :max-size="22" :min-size="12">
      <template #header="{ collapsed }">
        <span v-if="!collapsed" class="truncate px-1 text-sm font-semibold text-foreground">Details</span>
      </template>
      <template #default="{ collapsed }">
        <NavigationMenu :items="details" orientation="vertical" :collapsed="collapsed" tooltip />
      </template>
    </DashboardSidebar>
  </DashboardGroup>
</template>
