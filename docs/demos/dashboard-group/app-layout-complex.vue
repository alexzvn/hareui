<template>
  <DashboardGroup unit="rem" :persistent="false">
    <!-- Compact: a smaller `--spacing` on the sidebar tightens every spacing utility inside it. The 3rem rail keeps
         its width, so the rows and the brand get wider start padding (`px-3.5` / `px-3`) that centres them there. -->
    <DashboardSidebar
      id="app-layout-complex"
      collapsible
      :default-size="15"
      :collapsed-size="3"
      :menu="{ title: 'Navigation' }"
      :ui="{ root: '[--spacing:0.2rem]' }"
    >
      <template #header="{ collapsed }">
        <div class="flex w-full min-w-0 items-center justify-between gap-3 px-3 py-2">
          <div class="flex min-w-0 items-center gap-3">
            <span
              class="flex size-6 shrink-0 items-center justify-center rounded-md bg-success text-sm font-bold text-success-foreground"
              >A</span
            >
            <span v-if="!collapsed" class="truncate text-sm font-semibold text-foreground"
              >Acme Labs</span
            >
          </div>
          <Button
            v-if="!collapsed"
            aria-label="New note"
            variant="ghost"
            size="sm"
            icon-only
            class="size-7"
          >
            <Icon icon="gravity-ui:pencil" class="size-4" />
          </Button>
        </div>
      </template>

      <template #default="{ collapsed }">
        <NavigationMenu
          :items="items"
          orientation="vertical"
          :collapsed="collapsed"
          tooltip
          popover
          :ui="{ link: 'px-3.5' }"
        />
      </template>

      <template #footer="{ collapsed }">
        <div class="flex w-full min-w-0 flex-col gap-1">
          <div v-if="!collapsed" class="flex items-center gap-2 px-2 py-2">
            <Button
              variant="tertiary"
              size="sm"
              class="h-9 flex-1 gap-2 bg-surface text-sm text-muted shadow-surface"
            >
              <Icon icon="gravity-ui:sparkles" class="size-4" />
              New chat
              <Kbd :keys="['command']" class="text-xs"> N </Kbd>
            </Button>
            <Button aria-label="Compose" variant="tertiary" size="sm" icon-only>
              <Icon icon="gravity-ui:pencil" class="size-4 text-muted" />
            </Button>
          </div>
          <Dropdown :items="accountItems">
            <button
              type="button"
              data-slot="dropdown-trigger"
              aria-label="Junior Garcia"
              class="flex w-full min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 text-start outline-none hover:bg-default focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Avatar :src="avatar" alt="" size="sm" class="shrink-0" />
              <template v-if="!collapsed">
                <span class="truncate text-sm font-medium text-foreground">Junior Garcia</span>
                <Icon icon="gravity-ui:chevron-down" class="ms-auto size-3 shrink-0 text-muted" />
              </template>
            </button>
          </Dropdown>
        </div>
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
            <Button aria-label="Account" variant="ghost" icon-only>
              <Avatar :src="avatar" alt="Junior Garcia" class="size-6" />
            </Button>
          </template>
        </DashboardNavbar>
      </template>

      <template #body>
        <div>
          <p class="text-xl font-semibold text-foreground">Roadmap</p>
          <p class="mt-2 text-sm text-muted">
            Plan upcoming releases, track progress across teams and share updates with stakeholders.
          </p>
        </div>
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>

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
  Dropdown,
  Kbd,
  NavigationMenu,
  Separator,
} from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const chat = gravityIcon('sparkles')

const items: NavigationMenuItem[][] = [
  [
    { label: 'New Agent', icon: gravityIcon('magic-wand'), href: '#' },
    { label: 'Search', icon: gravityIcon('magnifier'), href: '#', kbds: ['command', 'K'] },
    { label: 'Home', icon: gravityIcon('house'), href: '#' },
    {
      label: 'Inbox',
      icon: gravityIcon('envelope'),
      href: '#',
      badge: { label: '3', color: 'accent', variant: 'soft' },
    },
    { label: 'Meetings', icon: gravityIcon('calendar'), href: '#' },
    { type: 'label', label: 'Recent chats' },
    { label: 'Refactor auth module', icon: chat, href: '#' },
    { label: 'Debug payment flow', icon: chat, href: '#' },
    { label: 'Write API docs', icon: chat, href: '#' },
    { label: 'Review PR #482', icon: chat, href: '#' },
    { type: 'label', label: 'Agents', badge: { label: 'Beta', variant: 'soft' } },
    { label: 'Coder', icon: gravityIcon('code'), href: '#' },
    { label: 'Reviewer', icon: gravityIcon('book-open'), href: '#' },
    { label: 'Writer', icon: gravityIcon('file-text'), href: '#' },
    { label: 'Add agent', icon: gravityIcon('plus'), href: '#' },
    { type: 'label', label: 'Teamspaces' },
    {
      label: 'Acme HQ',
      icon: gravityIcon('house'),
      defaultOpen: true,
      children: [
        { label: 'Home', icon: gravityIcon('house'), href: '#' },
        { label: 'My Tasks', icon: gravityIcon('square-check'), href: '#' },
        { label: 'Projects', icon: gravityIcon('target'), href: '#' },
        { label: 'Epics', icon: gravityIcon('rocket'), href: '#' },
        { label: 'Roadmap', icon: gravityIcon('chart-column'), href: '#', active: true },
        { label: 'Eng Board', icon: gravityIcon('code'), href: '#' },
      ],
    },
  ],
  [
    { type: 'label', label: 'Apps' },
    { label: 'Docs', icon: gravityIcon('book'), href: '#' },
    { label: 'Calendar', icon: gravityIcon('calendar'), href: '#' },
  ],
]

type Crumb = BreadcrumbsItem & { icon: string }

const breadcrumbs: Crumb[] = [{ label: 'Roadmap', icon: 'gravity-ui:chart-column' }]

const accountItems: DropdownEntry[] = [
  { value: 'profile', label: 'Profile', icon: 'gravity-ui:person' },
  { value: 'settings', label: 'Settings', icon: 'gravity-ui:gear' },
  {
    value: 'logout',
    label: 'Log Out',
    icon: 'gravity-ui:arrow-right-from-square',
    variant: 'danger',
  },
]

const avatar = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg'
</script>
