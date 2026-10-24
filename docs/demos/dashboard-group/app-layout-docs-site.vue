<template>
  <DashboardGroup unit="rem" :persistent="false">
    <!-- Offcanvas: the long docs tree slides fully away, the article takes the whole width. -->
    <DashboardSidebar
      id="app-layout-docs-site"
      collapsible
      :default-size="15"
      :collapsed-size="0"
      :menu="{ title: 'Documentation' }"
      :ui="{ root: 'w-(--width) overflow-hidden' }"
    >
      <template #header>
        <div class="flex min-w-0 items-center gap-3 px-1 py-2">
          <Icon icon="gravity-ui:layers-3-diagonal" class="size-5 shrink-0 text-foreground" />
          <div class="flex min-w-0 flex-col">
            <span class="truncate text-sm leading-tight font-semibold text-foreground"
              >HareUI Docs</span
            >
            <span class="truncate text-xs leading-tight text-muted">v3.0 Beta</span>
          </div>
        </div>
      </template>

      <template #default>
        <NavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{ label: '[&_[data-slot=linkLeadingIcon]]:size-3.5' }"
        />
      </template>

      <template #footer>
        <NavigationMenu
          aria-label="Secondary"
          :items="footerItems"
          orientation="vertical"
          class="w-full"
        />
      </template>
    </DashboardSidebar>

    <DashboardPanel :ui="{ body: 'p-6 sm:p-6' }">
      <template #header>
        <DashboardNavbar class="@container">
          <template #leading>
            <DashboardSidebarCollapse />
          </template>

          <!-- The default slot is the centred region of the bar, shown from `lg` up. Below `lg`, or when the bar is
               under 26rem, the search field becomes an icon button. -->
          <div class="relative w-50 @max-[26rem]:hidden">
            <SearchField
              aria-label="Search docs"
              placeholder="Search docs..."
              variant="secondary"
              :ui="{ group: 'h-8', input: 'h-full min-w-0 py-0 pe-10' }"
            />
            <Kbd
              keys="command"
              class="pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2 text-xs"
            >
              K
            </Kbd>
          </div>

          <template #right>
            <Button
              aria-label="Search docs"
              variant="ghost"
              size="sm"
              class="h-7 w-10 rounded-lg p-0 text-muted hover:text-foreground lg:@min-[26rem]:hidden"
            >
              <Icon icon="gravity-ui:magnifier" />
            </Button>
            <ToggleButtonGroup
              v-model="theme"
              selection-mode="single"
              size="sm"
              aria-label="Theme"
              disallow-empty-selection
            >
              <ToggleButton
                v-for="option in themes"
                :key="option.value"
                :value="option.value"
                :aria-label="option.label"
                icon-only
              >
                <Icon :icon="option.icon" class="size-3.5" />
              </ToggleButton>
            </ToggleButtonGroup>
          </template>
        </DashboardNavbar>
      </template>

      <template #body>
        <article>
          <div class="flex items-center gap-2">
            <Icon icon="gravity-ui:rocket" class="size-5 text-accent" />
            <span class="text-xs font-medium tracking-wider text-muted uppercase"
              >Getting Started</span
            >
          </div>
          <p class="mt-3 text-2xl font-bold text-foreground">Introduction</p>
          <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            HareUI is a Vue component library built on accessible primitives and Tailwind CSS v4.
            Every component is keyboard accessible, themeable and ready for server-side rendering.
          </p>
          <p class="mt-8 text-lg font-semibold text-foreground">Features</p>
          <ul class="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
            <li>Accessible by default</li>
            <li>Tailwind CSS v4 with design tokens</li>
            <li>Slot-based component patterns</li>
            <li>Dark mode support</li>
            <li>Server-side rendering compatible</li>
          </ul>
        </article>
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import {
  Button,
  DashboardGroup,
  DashboardNavbar,
  DashboardPanel,
  DashboardSidebar,
  DashboardSidebarCollapse,
  Kbd,
  NavigationMenu,
  SearchField,
  ToggleButton,
  ToggleButtonGroup,
} from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const pages = (...labels: string[]): NavigationMenuItem[] =>
  labels.map((label) => ({ label, href: '#' }))

// One flat list: each section is a label (with an icon) followed by text-only pages.
const items: NavigationMenuItem[] = [
  { type: 'label', label: 'Getting Started', icon: gravityIcon('rocket') },
  { label: 'Introduction', href: '#', active: true },
  ...pages('Installation', 'Project Structure', 'Editor Setup', 'Quick Start'),
  { type: 'label', label: 'Foundations', icon: gravityIcon('palette') },
  ...pages('Design Tokens', 'Colors', 'Typography', 'Spacing', 'Dark Mode', 'Accessibility'),
  { type: 'label', label: 'Components', icon: gravityIcon('cube') },
  { label: 'Actions', children: pages('Button', 'Button Group', 'Close Button') },
  {
    label: 'Inputs',
    defaultOpen: true,
    children: [
      ...pages('TextField', 'Select'),
      { label: 'Combobox', href: '#', badge: { label: 'Beta', color: 'accent', variant: 'soft' } },
      ...pages('Checkbox', 'Radio Group', 'Switch', 'Slider'),
    ],
  },
  { label: 'Data Display', children: pages('Avatar', 'Chip', 'Table') },
  { label: 'Feedback', children: pages('Alert', 'Spinner', 'Toast') },
  { label: 'Navigation', children: pages('Breadcrumbs', 'Link', 'Tabs') },
  { label: 'Overlays', children: pages('Modal', 'Popover', 'Tooltip') },
  { type: 'label', label: 'Hooks', icon: gravityIcon('code') },
  ...pages('useTheme', 'useDisclosure', 'useMediaQuery', 'useControlledState', 'useInterval'),
  { type: 'label', label: 'Guides', icon: gravityIcon('book') },
  ...pages(
    'Theming',
    'Customizing Components',
    'Server Components',
    'Migrating from v2',
    'Testing',
  ),
]

const footerItems: NavigationMenuItem[] = [
  {
    label: 'Changelog',
    icon: gravityIcon('square-article'),
    href: '#',
    badge: { label: 'New', color: 'success', variant: 'soft' },
  },
  { label: 'GitHub', icon: gravityIcon('logo-github'), href: '#' },
  { label: 'Help & Support', icon: gravityIcon('life-ring'), href: '#' },
]

const themes = [
  { value: 'light', label: 'Light', icon: 'gravity-ui:sun' },
  { value: 'dark', label: 'Dark', icon: 'gravity-ui:moon' },
  { value: 'system', label: 'System', icon: 'gravity-ui:display' },
]
const theme = ref(['system'])
</script>
