<template>
  <!-- The divider is an inset shadow: a border would shrink the 64px row to 63px and put the toggle on a half pixel.
       The menu's header row gets it too, so the toggle sits on exactly the same pixel when the menu opens. -->
  <Header
    class="shadow-[inset_0_-1px_0_var(--color-separator)]"
    hide-on-scroll
    title="HareUI"
    to="#"
    :ui="{ header: 'shadow-[inset_0_-1px_0_var(--color-separator)]' }"
  >
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
    </template>

    <NavigationMenu :items="items" variant="link" />

    <template #right>
      <Button size="sm"> Sign up </Button>
    </template>

    <template #body>
      <NavigationMenu :items="items" orientation="vertical" :ui="menuUi" />
    </template>
  </Header>

  <div class="flex flex-col gap-4 p-6 text-sm text-muted">
    <p class="font-medium text-foreground">Release notes</p>
    <p v-for="n in 14" :key="n">
      Version 2.{{ n }} adds new components, fixes keyboard navigation in overlays and improves dark
      mode contrast. Upgrade with your package manager; no code changes are required.
    </p>
  </div>
</template>

<script setup lang="ts">
import { Button, Header, NavigationMenu } from '@hareui/vue'

const items = [
  { label: 'Features', href: '#features', active: true },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
]

// Touch-sized rows for the mobile menu.
const menuUi = {
  list: 'gap-1',
  link: 'min-h-11 gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground',
}
</script>
