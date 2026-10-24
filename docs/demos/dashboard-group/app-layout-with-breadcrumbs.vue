<script setup lang="ts">
import type { BreadcrumbsItem, NavigationMenuItem } from '@hareui/vue'
import { Avatar, Breadcrumbs, Button, DashboardGroup, DashboardNavbar, DashboardPanel, DashboardSidebar, DashboardSidebarCollapse, NavigationMenu, Separator, Tooltip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

// An array of arrays renders groups separated by a divider.
const items: NavigationMenuItem[][] = [
  [
    { label: 'Overview', icon: gravityIcon('house'), href: '#' },
    { label: 'Components', icon: gravityIcon('layout-columns'), href: '#', active: true },
    { label: 'Tokens', icon: gravityIcon('palette'), href: '#' },
    { label: 'Typography', icon: gravityIcon('text-align-left'), href: '#' },
    { label: 'Changelog', icon: gravityIcon('square-article'), href: '#' },
    { label: 'Settings', icon: gravityIcon('gear'), href: '#' },
  ],
  [
    { type: 'label', label: 'Workspaces' },
    { label: 'Frontend', icon: gravityIcon('folder'), href: '#' },
    { label: 'Backend', icon: gravityIcon('folder'), href: '#' },
  ],
]

const footerItems: NavigationMenuItem[] = [
  { label: 'Help', icon: gravityIcon('circle-question'), href: '#' },
]

// Every crumb keeps its natural width. The navbar is a size container (sized by its content box): under 36rem
// (`@max-xl`) the middle ancestors fold into a "…" crumb that links to the nearest one and names the hidden path
// in a tooltip, under 24rem (`@max-sm`, a phone) Home folds into it too, and under 20rem (`@max-xs`) only the
// current page is left.
const breadcrumbs: BreadcrumbsItem[] = [
  { label: 'Home', href: '#', class: '@max-sm:hidden' },
  { label: 'Design System', href: '#', collapsed: 'Projects › Design System', class: 'hidden @max-xl:flex @max-sm:hidden' },
  { label: 'Design System', href: '#', collapsed: 'Home › Projects › Design System', class: 'hidden @max-sm:flex @max-xs:hidden' },
  { label: 'Projects', href: '#', class: '@max-xl:hidden' },
  { label: 'Design System', href: '#', class: '@max-xl:hidden' },
  { label: 'Components', icon: 'gravity-ui:layout-columns' },
]
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardSidebar id="app-layout-with-breadcrumbs" collapsible :default-size="15" :collapsed-size="3" :menu="{ title: 'Navigation' }">
      <template #header="{ collapsed }">
        <div class="flex min-w-0 items-center gap-3 px-1 py-2">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-xs font-bold text-accent-foreground">DS</span>
          <span v-if="!collapsed" class="truncate text-sm font-semibold text-foreground">Design System</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <NavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
      </template>

      <template #footer="{ collapsed }">
        <NavigationMenu aria-label="Secondary" :items="footerItems" orientation="vertical" :collapsed="collapsed" tooltip class="w-full" />
      </template>
    </DashboardSidebar>

    <DashboardPanel :ui="{ body: 'p-6 sm:p-6' }">
      <template #header>
        <DashboardNavbar class="@container">
          <template #leading>
            <DashboardSidebarCollapse />
            <Breadcrumbs :items="breadcrumbs" class="min-w-0" :ui="{ item: 'last:min-w-0 last:shrink', link: 'min-w-0' }">
              <template #item="{ item }">
                <Tooltip v-if="item.collapsed" :text="item.collapsed" :delay="500">
                  <span class="flex items-center">
                    <Icon icon="gravity-ui:ellipsis" aria-hidden="true" class="size-4" />
                    <span class="sr-only">{{ item.collapsed }}</span>
                  </span>
                </Tooltip>
                <span v-else class="flex min-w-0 items-center gap-2">
                  <Icon v-if="item.icon" :icon="item.icon" class="size-4 shrink-0" />
                  <span class="truncate">{{ item.label }}</span>
                </span>
              </template>
            </Breadcrumbs>
          </template>

          <template #right>
            <Button aria-label="Search" variant="ghost" size="sm" class="h-7 w-10 rounded-lg p-0 text-muted hover:text-foreground">
              <Icon icon="gravity-ui:magnifier" />
            </Button>
            <Button aria-label="Notifications" variant="ghost" size="sm" class="h-7 w-10 rounded-lg p-0 text-muted hover:text-foreground @max-md:hidden">
              <Icon icon="gravity-ui:bell" />
            </Button>
            <Separator orientation="vertical" class="h-6 min-h-0 self-center @max-md:hidden" />
            <Button aria-label="Account" variant="ghost" icon-only>
              <Avatar src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg" alt="Account" class="size-6" />
            </Button>
          </template>
        </DashboardNavbar>
      </template>

      <template #body>
        <div>
          <p class="text-xl font-semibold text-foreground">
            Components
          </p>
          <p class="mt-2 text-sm text-muted">
            Design system components shared across the web and mobile apps.
          </p>
        </div>
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>
