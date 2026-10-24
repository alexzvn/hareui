<script setup lang="ts">
import type { BreadcrumbsItem, NavigationMenuItem } from '@hareui/vue'
import { Avatar, Breadcrumbs, Button, Chip, DashboardGroup, DashboardNavbar, DashboardPanel, DashboardSidebar, DashboardSidebarCollapse, NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, useId } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[][] = [
  [
    { label: 'Search', icon: gravityIcon('magnifier'), href: '#' },
    { label: 'Drafts', icon: gravityIcon('square-article'), href: '#', badge: { label: '4', variant: 'tertiary', class: 'bg-transparent text-xs text-muted' } },
  ],
  [
    { label: 'Overview', icon: gravityIcon('house'), href: '#', active: true },
    { label: 'Episodes', icon: gravityIcon('microphone'), href: '#' },
    { label: 'Guests', icon: gravityIcon('persons'), href: '#' },
    { label: 'Analytics', icon: gravityIcon('chart-column'), href: '#' },
    { label: 'Campaigns', icon: gravityIcon('megaphone'), href: '#' },
    { label: 'Settings', icon: gravityIcon('gear'), href: '#' },
    { type: 'label', label: 'Upcoming releases' },
    { label: 'Designing for attention spans', href: '#' },
    { label: 'The pricing conversation nobody wants', href: '#' },
    { label: 'Building a creative studio from zero', href: '#' },
    { label: 'Late-night debugging with Ada', href: '#' },
  ],
]

const footerItems: NavigationMenuItem[] = [
  { label: 'Help Center', icon: gravityIcon('circle-question'), href: '#' },
  { label: 'What\'s new', icon: gravityIcon('sparkles'), href: '#' },
]

const breadcrumbs: BreadcrumbsItem[] = [{ label: 'Overview', icon: 'gravity-ui:house' }]

// Sparkline: a smooth-enough polyline plus the same line closed to the bottom for the gradient fill.
function sparkline(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const step = 100 / (values.length - 1)
  const points = values.map((v, i) => `${(i * step).toFixed(1)},${(36 - ((v - min) / (max - min || 1)) * 28).toFixed(1)}`)
  const line = `M${points.join(' L')}`
  return { line, area: `${line} L100,48 L0,48 Z` }
}

const stats = [
  { label: 'Monthly plays', value: '84,210', delta: '+14%', color: 'var(--color-accent)', data: [12, 14, 11, 15, 13, 18, 16, 21, 19, 24, 25, 28] },
  { label: 'Active subscribers', value: '3,487', delta: '+6%', color: 'var(--color-success)', data: [20, 21, 20, 22, 21, 23, 23, 24, 24, 25, 25, 26] },
  { label: 'Episodes published', value: '48', note: '2 scheduled', color: 'var(--color-muted)', data: [10, 10, 9, 11, 12, 12, 13, 13, 12, 13, 14, 15] },
].map(stat => ({ ...stat, path: sparkline(stat.data) }))

// Gradient ids must be unique on the page and valid inside `url(#…)`.
const gradientId = useId()

const episodes = [
  { title: 'Designing for attention spans', guest: 'Ada Park', plays: '12,489', age: '2d' },
  { title: 'The pricing conversation nobody wants', guest: 'Mateo Silva', plays: '8,902', age: '1w' },
  { title: 'Building a creative studio from zero', guest: 'Lenna Huang', plays: '21,008', age: '2w' },
  { title: 'Late-night debugging with Ada', guest: 'Kai Johansen', plays: '4,132', age: '3w' },
]
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <!-- Inset: no divider, the sidebar sits on the same surface as the content cards. -->
    <DashboardSidebar
      id="app-layout-inset-dashboard"
      collapsible
      :default-size="15"
      :collapsed-size="3"
      :menu="{ title: 'Navigation' }"
      :ui="{ root: 'shadow-none' }"
    >
      <template #header="{ collapsed }">
        <button type="button" class="flex w-full min-w-0 items-center gap-2 rounded-xl px-1.5 py-1.5 text-start outline-none hover:bg-default focus-visible:ring-2 focus-visible:ring-focus">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
            <Icon icon="gravity-ui:headphones" class="size-3.5" />
          </span>
          <template v-if="!collapsed">
            <span class="truncate text-sm font-semibold text-foreground">Soundwave Studio</span>
            <Icon icon="gravity-ui:chevrons-expand-vertical" class="ms-auto size-3.5 shrink-0 text-muted" />
          </template>
        </button>
      </template>

      <template #default="{ collapsed }">
        <NavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
      </template>

      <template #footer="{ collapsed }">
        <NavigationMenu aria-label="Secondary" :items="footerItems" orientation="vertical" :collapsed="collapsed" tooltip class="w-full" />
      </template>
    </DashboardSidebar>

    <DashboardPanel :ui="{ body: 'gap-6 p-6 sm:p-6' }">
      <template #header>
        <DashboardNavbar>
          <template #leading>
            <DashboardSidebarCollapse />
            <Breadcrumbs :items="breadcrumbs" class="min-w-0" :ui="{ item: 'min-w-0 shrink', link: 'min-w-0' }">
              <template #item="{ item }">
                <span class="flex min-w-0 items-center gap-2">
                  <Icon :icon="item.icon" class="size-4 shrink-0" />
                  <span class="truncate">{{ item.label }}</span>
                </span>
              </template>
            </Breadcrumbs>
          </template>

          <template #right>
            <button type="button" aria-label="Nora Kim" class="flex items-center gap-2 rounded-full ps-2 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <span class="max-sm:hidden">Nora Kim</span>
              <Avatar src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg" alt="" class="size-6" />
            </button>
          </template>
        </DashboardNavbar>
      </template>

      <template #body>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div v-for="(stat, i) in stats" :key="stat.label" class="relative flex flex-col overflow-hidden rounded-3xl bg-surface shadow-surface">
            <div class="px-4 pt-4">
              <p class="truncate text-sm text-muted">
                {{ stat.label }}
              </p>
              <div class="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <span class="text-2xl font-semibold text-foreground tabular-nums">{{ stat.value }}</span>
                <Chip v-if="stat.delta" color="success" variant="soft" size="sm" :label="stat.delta" class="shrink-0 whitespace-nowrap">
                  <template #leading>
                    <Icon icon="gravity-ui:arrow-up" class="size-3" />
                  </template>
                </Chip>
                <Chip v-else variant="soft" size="sm" class="shrink-0 whitespace-nowrap">
                  {{ stat.note }}
                </Chip>
              </div>
            </div>
            <svg viewBox="0 0 100 48" preserveAspectRatio="none" class="mt-2 h-16 w-full" aria-hidden="true">
              <defs>
                <linearGradient :id="`${gradientId}-${i}`" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" :stop-color="stat.color" stop-opacity="0.2" />
                  <stop offset="100%" :stop-color="stat.color" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path :d="stat.path.area" :fill="`url(#${gradientId}-${i})`" />
              <path :d="stat.path.line" fill="none" :stroke="stat.color" stroke-width="1.5" vector-effect="non-scaling-stroke" />
            </svg>
          </div>
        </div>

        <div class="rounded-3xl bg-surface p-6 shadow-surface">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-foreground">
              Latest episodes
            </p>
            <Button variant="tertiary" size="sm">
              View all
            </Button>
          </div>
          <ul class="mt-4 flex flex-col gap-4">
            <li v-for="episode in episodes" :key="episode.title" class="flex items-center gap-3">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon icon="gravity-ui:microphone" class="size-4" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-foreground sm:truncate">
                  {{ episode.title }}
                </p>
                <p class="text-xs text-muted sm:truncate">
                  Guest · {{ episode.guest }}
                </p>
              </div>
              <span class="text-sm font-medium text-foreground tabular-nums">{{ episode.plays }}</span>
              <span class="w-6 text-end text-xs text-muted">{{ episode.age }}</span>
            </li>
          </ul>
        </div>
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>
