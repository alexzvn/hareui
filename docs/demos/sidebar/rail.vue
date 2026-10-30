<template>
  <div class="flex min-h-svh bg-background">
    <Sidebar v-model:open="isOpen" collapsible="icon" rail>
      <template #header="{ state }">
        <div class="flex min-w-0 items-center gap-3 px-1 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >T</span
          >
          <span v-if="state === 'expanded'" class="truncate text-sm font-semibold text-foreground"
            >Tidepool</span
          >
        </div>
      </template>

      <template #default="{ state }">
        <NavigationMenu
          :collapsed="state === 'collapsed'"
          :items="items"
          orientation="vertical"
          tooltip
        />
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
        <p class="text-sm font-semibold text-foreground">Tide tables</p>
      </div>
      <p class="px-6 text-muted max-md:hidden">
        Click the inner edge of the sidebar to collapse or expand it.
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
  { label: 'Tide tables', icon: gravityIcon('chart-line'), href: '#', active: true },
  { label: 'Stations', icon: gravityIcon('globe'), href: '#' },
  { label: 'Alerts', icon: gravityIcon('bell'), href: '#', badge: '2' },
  { label: 'Exports', icon: gravityIcon('file-text'), href: '#' },
]
</script>
