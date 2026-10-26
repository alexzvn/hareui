<template>
  <!-- A team switcher, nav and a user menu. -->
  <Header breakpoint="md" title="HareUI" to="#">
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
      <span aria-hidden="true" class="mx-1 hidden h-5 w-px bg-separator sm:block" />
      <Dropdown :items="teams" @action="selectTeam">
        <Button class="hidden sm:inline-flex" variant="ghost">
          {{ team }}
          <Icon icon="gravity-ui:chevron-down" />
        </Button>
      </Dropdown>
    </template>

    <!-- `variant="link"`: muted text, foreground when current or hovered, no pill. -->
    <NavigationMenu :items="items" variant="link" />

    <template #right>
      <Button aria-label="Notifications" icon-only variant="ghost">
        <Icon icon="gravity-ui:bell" />
      </Button>
      <Dropdown :items="userMenu" align="end">
        <button
          aria-label="JD user menu"
          class="rounded-full outline-none focus-visible:status-focused"
          type="button"
        >
          <Avatar class="size-9 [--avatar-size:2.25rem]" fallback="JD" size="sm" />
        </button>
      </Dropdown>
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
import type { DropdownEntry } from '@hareui/vue'
import { Avatar, Button, Dropdown, Header, NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

// Touch-sized rows for the mobile menu.
const menuUi = {
  list: 'gap-1',
  link: 'min-h-11 gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground',
}

const items = [
  { label: 'Dashboard', href: '#dashboard', active: true },
  { label: 'Projects', href: '#projects' },
  { label: 'Team', href: '#team' },
  { label: 'Billing', href: '#billing' },
]

const teams: DropdownEntry[] = [
  { value: 'acme', label: 'Acme Inc.' },
  { value: 'globex', label: 'Globex' },
  { type: 'separator' },
  { value: 'new-team', label: 'Create team' },
]

const userMenu: DropdownEntry[] = [
  { value: 'profile', label: 'Profile' },
  { value: 'settings', label: 'Settings' },
  { type: 'separator' },
  { value: 'logout', label: 'Log out', variant: 'danger' },
]

const teamNames: Record<string, string> = { acme: 'Acme Inc.', globex: 'Globex' }
const team = ref(teamNames.acme)

const selectTeam = (value: string | number) => {
  team.value = teamNames[value] ?? team.value
}
</script>
