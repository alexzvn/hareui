<script setup lang="ts">
import type { BreadcrumbsItem, DropdownEntry, NavigationMenuItem } from '@hareui/vue'
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
import { h, ref } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const notify = ref(true)

// The ⋮ menu at the end of a row: shown on hover and keyboard focus, always in the mobile sheet.
const pageActions: DropdownEntry[] = [
  { value: 'open', label: 'Open', icon: gravityIcon('folder-open') },
  { value: 'duplicate', label: 'Duplicate', icon: gravityIcon('copy') },
  { value: 'delete', label: 'Delete', icon: gravityIcon('trash-bin'), variant: 'danger' },
]

const items: NavigationMenuItem[] = [
  // The current row always shows its actions; Dashboard's only show in the mobile sheet.
  {
    label: 'Dashboard',
    icon: gravityIcon('house'),
    href: '#',
    active: true,
    slot: 'dashboard',
    actions: pageActions,
    ui: { linkActions: 'hidden in-[[role=dialog]]:flex' },
  },
  {
    label: 'Analytics',
    icon: gravityIcon('chart-column'),
    defaultOpen: true,
    children: [
      { label: 'Overview', href: '#', actions: pageActions },
      { label: 'Reports', href: '#', actions: pageActions },
      { label: 'Conversions', href: '#', actions: pageActions },
    ],
  },
  {
    label: 'Tracker',
    icon: gravityIcon('list-check'),
    href: '#',
    badge: { label: 'New', color: 'success', variant: 'soft' },
  },
  {
    label: 'Settings',
    icon: gravityIcon('gear'),
    children: [
      { label: 'General', href: '#' },
      { label: 'Billing', href: '#' },
    ],
  },
]

const footerItems: NavigationMenuItem[] = [
  { label: 'Help & Information', icon: gravityIcon('circle-question'), href: '#' },
  { label: 'Log out', icon: gravityIcon('arrow-right-from-square'), href: '#' },
]

const breadcrumbs: BreadcrumbsItem[] = [{ label: 'Dashboard', icon: 'gravity-ui:house' }]
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <!-- Collapsible to an icon rail: the trigger in the navbar toggles it. -->
    <DashboardSidebar
      id="app-layout-default"
      collapsible
      :default-size="15"
      :collapsed-size="3"
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
        >
          <!-- An extra action before Dashboard's ⋮ menu, styled like it: a notifications toggle. -->
          <template #dashboard-actions="{ ui }">
            <button
              type="button"
              aria-label="Notify Dashboard"
              :aria-pressed="notify"
              :class="ui.linkAction()"
              @click="notify = !notify"
            >
              <Icon :icon="notify ? 'gravity-ui:bell' : 'gravity-ui:bell-slash'" />
            </button>
          </template>
        </NavigationMenu>
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
          <p class="mt-2 text-sm text-muted">
            Welcome back, Kate. Here is an overview of your projects and recent activity.
          </p>
        </div>
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>
