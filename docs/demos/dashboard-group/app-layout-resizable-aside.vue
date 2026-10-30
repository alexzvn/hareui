<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardSidebar
      id="app-layout-resizable-aside"
      resizable
      :default-size="12"
      :min-size="10"
      :max-size="20"
      :menu="{ title: 'Navigation' }"
    >
      <template #header>
        <div class="flex min-w-0 items-center gap-3 px-1 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >I</span
          >
          <span class="truncate text-sm font-semibold text-foreground">Inbox</span>
        </div>
      </template>

      <NavigationMenu :items="items" orientation="vertical" />
    </DashboardSidebar>

    <DashboardPanel :ui="{ body: 'p-6 sm:p-6' }">
      <template #header>
        <!-- `@container`: the bar sizes its contents by its own width (the aside narrows it), so `@max-sm:` hides secondary actions when it's under 24rem. -->
        <DashboardNavbar class="@container">
          <template #leading>
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
              class="h-7 w-10 rounded-lg p-0 text-muted hover:text-foreground @max-sm:hidden"
            >
              <Icon icon="gravity-ui:bell" />
            </Button>
            <Button aria-label="JG account" variant="ghost" icon-only>
              <Avatar
                fallback="JG"
                color="success"
                variant="soft"
                class="size-6"
                :ui="{ fallback: 'text-xs font-semibold' }"
              />
            </Button>
            <!-- Below `lg` the aside is a sheet, opened by the toggle. -->
            <DashboardSidebarToggle side="right" class="-me-2">
              <Icon icon="gravity-ui:layout-side-content-right" />
            </DashboardSidebarToggle>
            <DashboardSidebarCollapse side="right" />
          </template>
        </DashboardNavbar>
      </template>

      <template #body>
        <div>
          <p class="text-xl font-semibold text-foreground">Inbox</p>
          <p class="mt-2 max-w-xl text-sm text-muted">
            8 open conversations across 4 teams. Select one to see its details.
          </p>
        </div>
      </template>
    </DashboardPanel>

    <!-- A resizable right sidebar that also collapses fully from the navbar trigger. -->
    <DashboardSidebar
      id="app-layout-resizable-aside-details"
      aria-label="Details"
      side="right"
      resizable
      collapsible
      :default-size="14"
      :min-size="12"
      :max-size="24"
      :collapsed-size="0"
      :ui="{
        root: 'w-(--width) overflow-hidden shadow-none',
        header: 'min-h-0 px-4 pt-4 pb-1',
        body: 'gap-0 px-4 pt-0',
      }"
    >
      <template #header="{ collapsed }">
        <p v-if="!collapsed" class="truncate text-sm font-semibold text-foreground">Details</p>
      </template>

      <template #default="{ collapsed }">
        <dl v-if="!collapsed" class="flex flex-col gap-1 text-sm">
          <div class="flex min-h-7 items-center justify-between gap-4">
            <dt class="text-muted">Status</dt>
            <dd>
              <Chip color="success" variant="soft" size="sm"> Open </Chip>
            </dd>
          </div>
          <div class="flex min-h-7 items-center justify-between gap-4">
            <dt class="text-muted">Priority</dt>
            <dd class="text-foreground">Normal</dd>
          </div>
        </dl>
      </template>
    </DashboardSidebar>
  </DashboardGroup>
</template>

<script setup lang="ts">
import type { BreadcrumbsItem, NavigationMenuItem } from '@hareui/vue'
import {
  Avatar,
  Breadcrumbs,
  Button,
  Chip,
  DashboardGroup,
  DashboardNavbar,
  DashboardPanel,
  DashboardSidebar,
  DashboardSidebarCollapse,
  DashboardSidebarToggle,
  NavigationMenu,
} from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Inbox', icon: gravityIcon('envelope'), href: '#', active: true },
  { label: 'Home', icon: gravityIcon('house'), href: '#' },
]

type Crumb = BreadcrumbsItem & { icon: string }

const breadcrumbs: Crumb[] = [{ label: 'Inbox', icon: 'gravity-ui:envelope' }]
</script>
