<template>
  <DashboardGroup unit="rem" :persistent="false">
    <!-- Inset: no divider, the sidebar and the main column share one surface. -->
    <DashboardSidebar
      id="app-layout-inset-sidebar"
      collapsible
      :default-size="15"
      :collapsed-size="3"
      :ui="{ root: 'shadow-none' }"
      :menu="{ title: 'Navigation' }"
    >
      <template #header="{ collapsed }">
        <div class="flex min-w-0 items-center gap-3 px-1 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >H</span
          >
          <span v-if="!collapsed" class="truncate text-sm font-semibold text-foreground"
            >HareUI</span
          >
        </div>
      </template>

      <template #default="{ collapsed }">
        <NavigationMenu
          :items="items"
          orientation="vertical"
          :collapsed="collapsed"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <NavigationMenu
          aria-label="Secondary"
          :items="footerItems"
          orientation="vertical"
          :collapsed="collapsed"
          tooltip
          class="w-full"
        />
      </template>
    </DashboardSidebar>

    <DashboardPanel :ui="{ body: 'p-6 sm:p-6' }">
      <template #header>
        <!-- `@container`: the bar sizes its contents by its own width, so `@max-xs:` hides secondary actions when it's under 20rem. -->
        <DashboardNavbar class="@container">
          <template #leading>
            <DashboardSidebarCollapse />
            <Breadcrumbs
              :items="breadcrumbs"
              class="min-w-0"
              :ui="{ item: 'min-w-0 shrink', link: 'min-w-0' }"
            >
              <template #item="{ item }">
                <span class="flex min-w-0 items-center gap-2">
                  <Icon :icon="item.icon" class="size-4 shrink-0" />
                  <span class="truncate">{{ item.label }}</span>
                </span>
              </template>
            </Breadcrumbs>
          </template>

          <template #right>
            <Button
              aria-label="Search"
              variant="ghost"
              size="sm"
              class="h-7 w-10 rounded-lg p-0 text-muted hover:text-foreground"
            >
              <Icon icon="gravity-ui:magnifier" />
            </Button>
            <Button
              aria-label="Notifications"
              variant="ghost"
              size="sm"
              class="h-7 w-10 rounded-lg p-0 text-muted hover:text-foreground @max-xs:hidden"
            >
              <Icon icon="gravity-ui:bell" />
            </Button>
            <Separator orientation="vertical" class="h-6 min-h-0 self-center @max-xs:hidden" />
            <Button aria-label="JG account" variant="ghost" icon-only>
              <Avatar
                fallback="JG"
                color="success"
                variant="soft"
                class="size-6"
                :ui="{ fallback: 'text-xs font-semibold' }"
              />
            </Button>
          </template>
        </DashboardNavbar>
      </template>

      <template #body>
        <div>
          <p class="text-xl font-semibold text-foreground">Dashboard</p>
          <p class="mt-2 text-sm text-muted">Revenue is up 12% compared to last month.</p>
        </div>
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>

<script setup lang="ts">
import type { BreadcrumbsItem, NavigationMenuItem } from '@hareui/vue'
import {
  Avatar,
  Breadcrumbs,
  Button,
  DashboardGroup,
  DashboardNavbar,
  DashboardPanel,
  DashboardSidebar,
  DashboardSidebarCollapse,
  NavigationMenu,
  Separator,
} from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Dashboard', icon: gravityIcon('house'), href: '#', active: true },
  {
    label: 'Analytics',
    icon: gravityIcon('chart-column'),
    defaultOpen: true,
    children: [
      { label: 'Overview', href: '#' },
      { label: 'Reports', href: '#' },
    ],
  },
  {
    label: 'Tracker',
    icon: gravityIcon('list-check'),
    href: '#',
    badge: { label: 'New', color: 'success', variant: 'soft' },
  },
  { label: 'Settings', icon: gravityIcon('gear'), href: '#' },
]

const footerItems: NavigationMenuItem[] = [
  { label: 'Help', icon: gravityIcon('circle-question'), href: '#' },
]

const breadcrumbs: BreadcrumbsItem[] = [{ label: 'Dashboard', icon: 'gravity-ui:house' }]
</script>
