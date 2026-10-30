<template>
  <div class="flex min-h-svh bg-background">
    <Sidebar v-model:open="isOpen" variant="floating">
      <template #header>
        <div class="flex min-w-0 items-center gap-3 px-1 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >P</span
          >
          <span class="truncate text-sm font-semibold text-foreground">Parcel</span>
        </div>
      </template>

      <NavigationMenu :items="items" orientation="vertical" />
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
        <p class="text-sm font-semibold text-foreground">Shipments</p>
      </div>
      <p class="px-6 text-muted max-md:hidden">
        The floating sidebar sits 8px from the edges of the viewport.
      </p>
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
import { Button, NavigationMenu, Sidebar } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const isOpen = ref(true)

const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Shipments', icon: gravityIcon('box'), href: '#', active: true },
  { label: 'Routes', icon: gravityIcon('globe'), href: '#' },
  { label: 'Drivers', icon: gravityIcon('persons'), href: '#' },
  { label: 'Schedule', icon: gravityIcon('calendar'), href: '#' },
  { label: 'Settings', icon: gravityIcon('gear'), href: '#' },
]
</script>
