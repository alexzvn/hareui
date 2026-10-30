<template>
  <!-- A docs-site navbar: nav next to the brand, search and a theme segment on the right. -->
  <!-- Unlike the default equal side columns, the nav keeps its width and the right side takes what is left. -->
  <Header breakpoint="md" title="HareUI" to="#" :ui="{ left: 'md:flex-none', right: 'min-w-0' }">
    <template #left>
      <a
        aria-label="HareUI"
        class="rounded-lg text-foreground outline-none focus-visible:status-focused"
        href="#"
      >
        <span class="flex items-center gap-2">
          <svg aria-hidden="true" fill="currentColor" height="22" viewBox="0 0 32 32" width="22">
            <path
              d="M14.125 5.5C14.125 1.99 15.115 1 18.625 1L25.875 1C29.385 1 30.375 1.99 30.375 5.5L30.375 12.75C30.375 16.26 29.385 17.25 25.875 17.25L22.875 17.25C18.975 17.25 17.875 18.35 17.875 22.25L17.875 26.5C17.875 30.01 16.885 31 13.375 31L6.125 31C2.615 31 1.625 30.01 1.625 26.5L1.625 19.25C1.625 15.74 2.615 14.75 6.125 14.75L9.125 14.75C13.025 14.75 14.125 13.65 14.125 9.75Z"
              transform="rotate(-1.5 16 16)"
            />
          </svg>
          <span class="text-lg font-semibold">HareUI</span>
        </span>
      </a>
      <nav aria-label="Main" class="ms-4 hidden items-center md:flex">
        <a
          v-for="item in items"
          :key="item.label"
          :aria-current="item.active ? 'page' : undefined"
          :class="itemClass"
          :data-current="item.active"
          :href="item.href"
        >
          {{ item.label }}
        </a>
      </nav>
    </template>

    <template #right>
      <!-- A search trigger with a ⌘K hint. In a narrow bar it shrinks: the label truncates and the hint drops out
           below 10rem (a container query on the button). -->
      <Button
        class="@container hidden h-8 w-50 min-w-0 shrink justify-between overflow-hidden rounded-xl px-3 font-normal text-muted sm:inline-flex"
        size="sm"
        variant="tertiary"
      >
        <span class="flex min-w-0 items-center gap-2">
          <Icon class="shrink-0" icon="gravity-ui:magnifier" />
          <span class="truncate">Search docs</span>
        </span>
        <Kbd class="-me-2 hidden shrink-0 text-xs @[10rem]:inline-flex" keys="command"> K </Kbd>
      </Button>

      <ToggleButtonGroup
        v-model="theme"
        class="hidden sm:inline-flex"
        detached
        :ui="{ base: 'gap-0' }"
        selection-mode="single"
        size="sm"
      >
        <ToggleButton
          aria-label="Light"
          :class="themeButtonClass"
          icon-only
          value="light"
          variant="ghost"
        >
          <Icon icon="gravity-ui:sun" />
        </ToggleButton>
        <ToggleButton
          aria-label="Dark"
          :class="themeButtonClass"
          icon-only
          value="dark"
          variant="ghost"
        >
          <Icon icon="gravity-ui:moon" />
        </ToggleButton>
        <ToggleButton
          aria-label="System"
          :class="themeButtonClass"
          icon-only
          value="system"
          variant="ghost"
        >
          <Icon icon="gravity-ui:display" />
        </ToggleButton>
      </ToggleButtonGroup>
    </template>

    <template #body>
      <NavigationMenu :items="items" orientation="vertical" :ui="menuUi" />
    </template>
  </Header>

  <main class="flex flex-col gap-3 p-6">
    <h1 class="text-xl font-semibold text-foreground">Getting started</h1>
    <p class="text-sm text-muted">
      HareUI is a Vue component library built on Tailwind CSS, with accessible and themeable
      components.
    </p>
    <p class="text-sm text-muted">
      Install the package, import the stylesheet and compose your pages from buttons, menus and
      forms.
    </p>
  </main>
</template>

<script setup lang="ts">
import { Button, Header, Kbd, NavigationMenu, ToggleButton, ToggleButtonGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

// Touch-sized rows for the mobile menu.
const menuUi = {
  list: 'gap-1',
  link: 'min-h-11 gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground',
}

const items = [
  { label: 'Docs', href: '#docs', active: true },
  { label: 'Components', href: '#components' },
  { label: 'Blog', href: '#blog' },
  { label: 'Changelog', href: '#changelog' },
]

const theme = ref(['system'])

const itemClass =
  'inline-flex h-8 items-center rounded-lg px-2 text-sm text-muted no-underline outline-none transition-colors hover:text-foreground focus-visible:status-focused data-[current=true]:text-foreground'

// Theme switch: ghost icons, muted until hovered or selected, no fill on the selected one.
const themeButtonClass =
  'size-7 [--toggle-button-fg:var(--muted)] hover:[--toggle-button-fg:var(--foreground)] [--toggle-button-bg-selected:transparent] [--toggle-button-bg-selected-hover:var(--default)] [--toggle-button-fg-selected:var(--foreground)]'
</script>
