<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { Avatar, Button, DashboardGroup, DashboardPanel, DashboardSidebar, DashboardSidebarToggle, Kbd, NavigationMenu, Tooltip } from '@hareui/vue'
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

const secondary: NavigationMenuItem[] = [
  { label: 'Feedback', icon: gravityIcon('comment'), href: '#' },
  { label: 'Help & Support', icon: gravityIcon('circle-question'), href: '#' },
]
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardSidebar
      id="basic"
      collapsible
      resizable
      :default-size="15"
      :max-size="22"
      :min-size="12"
    >
      <template #header="{ collapsed }">
        <div class="flex min-w-0 items-center gap-3 px-1.5 py-2">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground">A</span>
          <span v-if="!collapsed" class="truncate text-sm font-semibold text-foreground">Acme</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <Button
          aria-label="Search"
          class="w-full justify-start gap-2 px-2.75 text-muted"
          :icon-only="collapsed"
          variant="outline"
        >
          <Icon class="size-4" icon="gravity-ui:magnifier" />
          <template v-if="!collapsed">
            Search...
            <Kbd class="ms-auto" keys="command">K</Kbd>
          </template>
        </Button>

        <NavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
        <NavigationMenu :items="secondary" orientation="vertical" :collapsed="collapsed" tooltip class="mt-auto" />
      </template>

      <template #footer="{ collapsed }">
        <!-- Same row metrics as the menu: a 24px avatar in the 20px icon column, `gap-3` to the name. -->
        <Tooltip :disabled="!collapsed" side="right" text="Alex">
          <button
            :aria-label="collapsed ? 'Alex' : undefined"
            class="flex h-9 w-full items-center gap-3 rounded-2xl px-1.5 text-sm text-foreground outline-none hover:bg-default focus-visible:status-focused"
            type="button"
          >
            <Avatar class="size-6 shrink-0 text-[10px]" fallback="AB" size="sm" />
            <span v-if="!collapsed" class="truncate">Alex</span>
          </button>
        </Tooltip>
      </template>
    </DashboardSidebar>

    <DashboardPanel>
      <template #header>
        <div class="flex h-16 shrink-0 items-center gap-3 px-4">
          <DashboardSidebarToggle />
          <p class="min-w-0 truncate text-sm font-semibold text-foreground">
            Home
          </p>
        </div>
      </template>
      <template #body>
        <div class="h-full rounded-xl border border-dashed border-separator bg-surface/50" />
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>
