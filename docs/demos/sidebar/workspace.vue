<template>
  <div class="flex min-h-svh bg-background">
    <Sidebar v-model:open="isOpen" class="[--spacing:0.2rem]">
      <template #header>
        <div class="flex min-w-0 items-center gap-2 px-1 py-1">
          <span
            class="flex size-5 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground"
          >
            <Icon class="size-3" icon="gravity-ui:sparkles" />
          </span>
          <span class="truncate text-sm font-semibold text-foreground">Copilot Studio</span>
        </div>
      </template>

      <template #actions>
        <Button aria-label="New thread" icon-only size="sm" variant="ghost">
          <Icon icon="gravity-ui:pencil-to-square" />
        </Button>
      </template>

      <NavigationMenu :items="items" orientation="vertical" />

      <template #footer>
        <Button class="w-full" size="sm" variant="secondary">
          <Icon icon="gravity-ui:sparkles" />
          New thread
          <Kbd keys="command">N</Kbd>
        </Button>
        <button
          class="flex h-9 w-full items-center gap-2 rounded-xl px-1.5 text-sm text-foreground outline-none hover:bg-default focus-visible:status-focused"
          type="button"
        >
          <Avatar
            class="size-6 shrink-0 text-[10px]"
            color="warning"
            fallback="TW"
            size="sm"
            variant="soft"
          />
          <span class="min-w-0 flex-1 truncate text-start font-medium">Theo Wright</span>
        </button>
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
        <Icon class="size-4 text-muted" icon="gravity-ui:code" />
        <p class="text-sm font-semibold text-foreground">Billing service</p>
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
import type { NavigationMenuItem } from '@hareui/vue'
import { Avatar, Button, Kbd, NavigationMenu, Sidebar } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const isOpen = ref(true)

const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const threadActions = [
  { value: 'rename', label: 'Rename' },
  { value: 'archive', label: 'Archive' },
  { value: 'delete', label: 'Delete', variant: 'danger' as const },
]

const items: NavigationMenuItem[][] = [
  [
    { label: 'Home', icon: gravityIcon('house'), href: '#' },
    { label: 'Activity', icon: gravityIcon('clock'), href: '#' },
    { label: 'Templates', icon: gravityIcon('cube'), href: '#' },
  ],
  [
    { label: 'Recent threads', type: 'label' },
    { label: 'Migrate cron jobs', icon: gravityIcon('comment'), href: '#' },
    { label: 'Fix flaky checkout test', icon: gravityIcon('comment'), href: '#' },
    { label: 'Summarize incident 112', icon: gravityIcon('comment'), href: '#' },
  ],
  [
    { label: 'Projects', type: 'label' },
    {
      label: 'Platform',
      icon: gravityIcon('folder'),
      defaultOpen: true,
      children: [
        {
          label: 'Billing service',
          icon: gravityIcon('code'),
          href: '#',
          active: true,
          actions: threadActions,
        },
        { label: 'Search indexer', icon: gravityIcon('code'), href: '#', actions: threadActions },
      ],
    },
    { label: 'New project', icon: gravityIcon('plus'), href: '#', class: 'text-muted' },
  ],
]
</script>
