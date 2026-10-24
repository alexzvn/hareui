<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardSidebar
      id="app-layout-content-scroll"
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
        <NavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
      </template>
    </DashboardSidebar>

    <!-- The panel body is the scroll container: the sidebar, navbar and footer stay put while it scrolls. -->
    <DashboardPanel :ui="{ body: 'gap-8 p-6 sm:p-6' }">
      <template #header>
        <DashboardNavbar>
          <template #leading>
            <DashboardSidebarCollapse />
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
              class="h-7 w-10 rounded-lg p-0 text-muted hover:text-foreground"
            >
              <Icon icon="gravity-ui:bell" />
            </Button>
            <Separator orientation="vertical" class="h-6 min-h-0 self-center" />
            <Button aria-label="Account" variant="ghost" icon-only>
              <Avatar color="success" variant="soft" class="size-6">
                <template #fallback>
                  <Icon icon="gravity-ui:person" class="size-3.5" />
                </template>
              </Avatar>
            </Button>
          </template>
        </DashboardNavbar>
      </template>

      <template #body>
        <nav
          aria-label="Jump to"
          class="sticky top-0 z-10 rounded-xl border border-border bg-surface p-3"
        >
          <p class="text-xs font-medium tracking-wide text-muted uppercase">Jump to</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <Button
              v-for="section in sections"
              :key="section"
              variant="tertiary"
              size="sm"
              @click="jumpTo(section)"
            >
              {{ section }}
            </Button>
          </div>
        </nav>

        <section
          v-for="section in sections"
          :id="sectionId(section)"
          :key="section"
          class="flex flex-col gap-3"
        >
          <p class="text-xl font-semibold text-foreground">
            {{ section }}
          </p>
          <div v-for="n in 5" :key="n" class="rounded-xl border border-border p-4">
            <p class="text-sm font-medium text-foreground">{{ section }} item {{ n }}</p>
            <p class="mt-1 text-sm text-muted">Updated 2 hours ago by Kate Moore.</p>
          </div>
        </section>
      </template>

      <template #footer>
        <div
          class="flex shrink-0 items-center justify-between border-t border-border px-4 py-2 text-xs text-muted"
        >
          <span>Content scroll footer</span>
          <span class="tabular-nums">v1.0.0</span>
        </div>
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import {
  Avatar,
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
  { label: 'Home', icon: gravityIcon('house'), href: '#' },
  { label: 'Analytics', icon: gravityIcon('chart-column'), href: '#' },
  { label: 'Alerts', icon: gravityIcon('bell'), href: '#' },
]

const sections = ['Overview', 'Activity', 'Timeline', 'Metrics', 'Notes']
const sectionId = (section: string) => `content-scroll-${section.toLowerCase()}`

// Scrolls the panel body (the scroll container), never the page around it, and keeps the section clear of the
// sticky "Jump to" bar.
function jumpTo(section: string) {
  const target = document.getElementById(sectionId(section))
  const body = target?.closest<HTMLElement>('[data-slot="dashboard-panel-body"]')
  if (!target || !body) return
  const bar = body.querySelector<HTMLElement>('nav[aria-label="Jump to"]')
  const offset = target.getBoundingClientRect().top - body.getBoundingClientRect().top
  body.scrollTo({
    top: body.scrollTop + offset - (bar?.offsetHeight ?? 0) - 24,
    behavior: 'smooth',
  })
}
</script>
