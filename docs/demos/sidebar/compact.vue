<template>
  <div class="flex min-h-svh bg-background">
    <!-- Every size in the sidebar derives from `--spacing`; lowering it tightens the whole layout. -->
    <Sidebar v-model:open="isOpen" class="[--spacing:0.2rem]">
      <template #header>
        <div class="flex min-w-0 items-center gap-2 px-1 py-1">
          <span
            class="flex size-5 shrink-0 items-center justify-center rounded-md bg-success text-xs font-bold text-success-foreground"
            >M</span
          >
          <span class="truncate text-sm font-semibold text-foreground">Mosaic</span>
        </div>
      </template>

      <NavigationMenu :items="items" orientation="vertical" />

      <template #footer>
        <Dropdown :items="accountItems" side="top" align="start">
          <button
            class="flex h-9 w-full items-center gap-2 rounded-xl px-1.5 text-sm text-foreground outline-none hover:bg-default focus-visible:status-focused"
            data-slot="dropdown-trigger"
            type="button"
          >
            <Avatar
              class="size-6 shrink-0 text-[10px]"
              color="accent"
              fallback="NK"
              size="sm"
              variant="soft"
            />
            <span class="min-w-0 flex-1 truncate text-start font-medium">Noor Khalil</span>
            <Icon class="size-3.5 text-muted" icon="gravity-ui:chevron-down" />
          </button>
        </Dropdown>
      </template>
    </Sidebar>

    <main class="flex min-w-0 flex-1 flex-col">
      <div class="flex h-16 items-center gap-3 px-4">
        <Button
          aria-label="Toggle sidebar"
          icon-only
          size="sm"
          variant="ghost"
          @click="isOpen = !isOpen"
        >
          <Icon icon="gravity-ui:layout-side-content-left" />
        </Button>
        <p class="text-sm font-semibold text-foreground">Home</p>
      </div>
      <div class="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center md:hidden">
        <p class="text-sm text-muted">Below 768px the sidebar opens as a sheet.</p>
        <Button size="sm" variant="secondary" @click="isOpen = true">
          <Icon icon="gravity-ui:layout-side-content-left" />
          Open sidebar
        </Button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { DropdownEntry, NavigationMenuItem } from '@hareui/vue'
import { Avatar, Button, Dropdown, NavigationMenu, Sidebar } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const isOpen = ref(true)

const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[][] = [
  [
    { label: 'Find', icon: gravityIcon('magnifier'), kbds: ['command', 'P'] },
    { label: 'Home', icon: gravityIcon('house'), href: '#', active: true },
    { label: 'Updates', icon: gravityIcon('bell'), href: '#' },
    { label: 'Explore', icon: gravityIcon('globe'), href: '#' },
  ],
  [
    { label: 'Boards', type: 'label' },
    {
      label: 'Brand refresh',
      icon: gravityIcon('folder-open'),
      defaultOpen: true,
      children: [
        { label: 'Moodboard', icon: gravityIcon('file-text'), href: '#' },
        { label: 'Logo drafts', icon: gravityIcon('file-text'), href: '#' },
        { label: 'Type scale', icon: gravityIcon('file-text'), href: '#' },
      ],
    },
    { label: 'Field trips', icon: gravityIcon('briefcase'), href: '#' },
    { label: 'New board', icon: gravityIcon('plus'), href: '#', class: 'text-muted' },
  ],
]

const accountItems: DropdownEntry[] = [
  { value: 'profile', label: 'Profile' },
  { value: 'preferences', label: 'Preferences' },
  { type: 'separator' },
  { value: 'sign-out', label: 'Sign out', variant: 'danger' },
]
</script>
