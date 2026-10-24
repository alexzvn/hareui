<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardSidebar
      id="app-layout-with-aside"
      v-model:collapsed="isNavCollapsed"
      collapsible
      :default-size="15"
      :collapsed-size="3"
      :menu="{ title: 'Navigation' }"
    >
      <template #header="{ collapsed }">
        <div class="flex min-w-0 items-center gap-3 px-1 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >I</span
          >
          <span v-if="!collapsed" class="truncate text-sm font-semibold text-foreground"
            >Inbox</span
          >
        </div>
      </template>

      <template #default="{ collapsed }">
        <NavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
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

    <DashboardPanel :ui="{ body: 'gap-6 px-6 py-8 sm:px-6 sm:py-8' }">
      <template #header>
        <DashboardNavbar>
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
            <Button aria-label="JG account" variant="ghost" icon-only>
              <Avatar
                fallback="JG"
                color="success"
                variant="soft"
                class="size-6"
                :ui="{ fallback: 'text-xs font-semibold' }"
              />
            </Button>
            <!-- `side="right"` targets the aside instead of the navigation sidebar: the collapse button from `lg` up, the sheet toggle below. -->
            <DashboardSidebarToggle side="right" class="-me-2">
              <Icon icon="gravity-ui:layout-side-content-right" />
            </DashboardSidebarToggle>
            <DashboardSidebarCollapse side="right" />
          </template>
        </DashboardNavbar>
      </template>

      <template #body>
        <header class="flex items-center gap-3">
          <Avatar :src="avatars.blue" alt="Dan Fox" class="size-10" />
          <div class="flex flex-col gap-0.5">
            <p class="text-base leading-tight font-semibold text-foreground">Dan Fox</p>
            <p class="text-xs text-muted tabular-nums">Email · 6 months ago</p>
          </div>
        </header>

        <div class="flex flex-col gap-6">
          <div
            v-for="(message, i) in messages"
            :key="i"
            class="flex items-end gap-2"
            :class="{ 'flex-row-reverse': message.from === 'agent' }"
          >
            <Avatar
              :src="message.from === 'agent' ? avatars.green : avatars.blue"
              :alt="message.from"
              size="sm"
            />
            <div
              class="flex max-w-md flex-col gap-1"
              :class="message.from === 'agent' ? 'items-end' : 'items-start'"
            >
              <div
                class="rounded-2xl px-3.5 py-2 text-foreground"
                :class="message.from === 'agent' ? 'bg-surface-tertiary' : 'bg-surface'"
              >
                <p class="text-sm leading-relaxed">
                  {{ message.text }}
                </p>
              </div>
              <p class="px-1 text-xs text-muted tabular-nums">6mo</p>
            </div>
          </div>
        </div>
      </template>
    </DashboardPanel>

    <!-- The aside is a right sidebar with its own state: `useDashboard().sidebars.right`. -->
    <DashboardSidebar
      id="app-layout-with-aside-details"
      aria-label="Details"
      side="right"
      collapsible
      :default-size="18"
      :collapsed-size="0"
      :ui="{
        root: 'w-(--width) overflow-hidden shadow-none',
        header: 'min-h-0 px-4 pt-4 pb-2',
        body: 'gap-0 px-4 pt-0 pb-4',
        footer: 'flex-col items-stretch gap-1.5 border-t border-border px-4 py-3',
      }"
    >
      <template #header="{ collapsed }">
        <p v-if="!collapsed" class="truncate text-sm font-semibold text-foreground">
          Conversation details
        </p>
      </template>

      <template #default="{ collapsed }">
        <template v-if="!collapsed">
          <dl class="flex flex-col gap-3 px-1 py-2 text-sm">
            <div class="flex min-h-7 items-center justify-between gap-4">
              <dt class="text-muted">Assignee</dt>
              <dd class="flex items-center gap-2 font-medium text-foreground">
                <Avatar :src="avatars.purple" alt="John Steele" class="size-5" />
                John Steele
              </dd>
            </div>
            <div class="flex min-h-7 items-center justify-between gap-4">
              <dt class="text-muted">Team</dt>
              <dd class="font-medium text-foreground">Developers</dd>
            </div>
            <div class="flex min-h-7 items-center justify-between gap-4">
              <dt class="text-muted">Priority</dt>
              <dd class="font-medium text-foreground">Normal</dd>
            </div>
            <div class="flex min-h-7 items-center justify-between gap-4">
              <dt class="text-muted">Status</dt>
              <dd>
                <Chip color="success" variant="soft" size="sm"> Open </Chip>
              </dd>
            </div>
            <div class="flex min-h-7 items-center justify-between gap-4">
              <dt class="text-muted">Tags</dt>
              <dd class="flex flex-wrap justify-end gap-1.5">
                <Chip variant="soft" size="sm"> Billing </Chip>
                <Chip color="accent" variant="soft" size="sm"> Priority </Chip>
              </dd>
            </div>
          </dl>

          <DisclosureGroup v-model="expanded" class="mt-2 flex flex-col gap-2">
            <Disclosure
              v-for="section in sections"
              :key="section.value"
              :value="section.value"
              :ui="{ bodyInner: 'pt-2' }"
            >
              <template #trigger="{ indicator }">
                <Button
                  :variant="expanded.includes(section.value) ? 'secondary' : 'tertiary'"
                  class="h-8 w-full justify-between border-none px-3"
                >
                  <span class="text-sm font-medium">{{ section.title }}</span>
                  <component :is="indicator" class="size-3.5 text-muted" />
                </Button>
              </template>
              <ul v-if="section.list" class="flex flex-col gap-2 pr-1 pb-3 pl-3 text-sm">
                <li
                  v-for="entry in section.list"
                  :key="entry"
                  class="truncate text-foreground"
                  :title="entry"
                >
                  {{ entry }}
                </li>
              </ul>
              <dl v-else class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 pr-1 pb-3 pl-3 text-sm">
                <template v-for="[term, value] in section.rows" :key="term">
                  <dt class="text-muted">
                    {{ term }}
                  </dt>
                  <dd class="min-w-0 truncate font-medium text-foreground" :title="value">
                    {{ value }}
                  </dd>
                </template>
              </dl>
            </Disclosure>
          </DisclosureGroup>
        </template>
      </template>

      <template #footer="{ collapsed }">
        <template v-if="!collapsed">
          <Button size="sm" full-width> Close conversation </Button>
          <Button size="sm" variant="secondary" full-width> Snooze </Button>
        </template>
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
  Disclosure,
  DisclosureGroup,
  NavigationMenu,
} from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const count = (label: string) => ({
  label,
  variant: 'tertiary' as const,
  class: 'text-xs text-muted',
})

// A colored dot centred in the icon box (`attrs` carries the menu's icon size classes).
const dot = (color: string) => (attrs: Record<string, unknown>) =>
  h('span', { ...attrs, class: [attrs.class, 'flex items-center justify-center'] }, [
    h('span', {
      class: 'size-2 rounded-full',
      style: { backgroundColor: `var(--color-${color})` },
    }),
  ])

const items: NavigationMenuItem[] = [
  { label: 'My inbox', icon: gravityIcon('envelope'), href: '#', badge: count('3') },
  {
    label: 'All messages',
    icon: gravityIcon('envelope'),
    href: '#',
    active: true,
    badge: count('13'),
  },
  { label: 'Created by me', icon: gravityIcon('pencil'), href: '#' },
  { label: 'Unassigned', icon: gravityIcon('circle-question'), href: '#', badge: count('10') },
  { type: 'label', label: 'Team inboxes' },
  { label: 'Customer success', icon: dot('success'), href: '#' },
  { label: 'Sales', icon: dot('danger'), href: '#' },
  { label: 'Developers', icon: dot('accent'), href: '#' },
]

const footerItems: NavigationMenuItem[] = [
  { label: 'Analytics', icon: gravityIcon('chart-column'), href: '#' },
  { label: 'Help Center', icon: gravityIcon('circle-question'), href: '#' },
]

type Crumb = BreadcrumbsItem & { icon: string }

const breadcrumbs: Crumb[] = [{ label: 'Inbox', icon: 'gravity-ui:envelope' }]

const avatars = {
  blue: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg',
  green: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg',
  purple: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg',
}

const messages = [
  {
    from: 'customer',
    text: "My direct deposit didn't show up today. It's usually here by now. Can you check what happened?",
  },
  {
    from: 'agent',
    text: "Thanks for reaching out, Dan. I'm looking into this now and will get back to you shortly.",
  },
  { from: 'customer', text: 'Thanks, I appreciate it!' },
  {
    from: 'agent',
    text: "Good news — the deposit has been released and should land in your account within the next hour. Let me know if you don't see it.",
  },
]

const sections = [
  {
    value: 'user',
    title: 'User details',
    rows: [
      ['Name', 'Dan Fox'],
      ['Company', 'Ashby'],
      ['Type', 'Customer'],
      ['Email', 'dan@ashby.com'],
    ],
  },
  {
    value: 'recent',
    title: 'Recent conversations',
    list: ['Payment failed on autopay', 'How do I export invoices?', 'Upgrade plan inquiry'],
  },
  {
    value: 'company',
    title: 'Company information',
    rows: [
      ['Name', 'Ashby'],
      ['Plan', 'Enterprise'],
      ['Size', '201 – 500'],
    ],
  },
]

const expanded = ref<(string | number)[]>(['user'])

// Starts on the icon rail so the conversation keeps room next to the aside.
const isNavCollapsed = ref(true)
</script>
