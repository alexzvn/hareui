<template>
  <div class="flex min-h-svh bg-background">
    <Sidebar :key="collapsible" v-model:open="isOpen" :collapsible="collapsible">
      <template #header="{ state }">
        <div class="flex min-w-0 items-center gap-3 px-1 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >O</span
          >
          <span v-if="state === 'expanded'" class="truncate text-sm font-semibold text-foreground"
            >Orbit</span
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
          :disabled="collapsible === 'none'"
          icon-only
          size="sm"
          variant="ghost"
          @click="isOpen = !isOpen"
        >
          <Icon icon="gravity-ui:layout-side-content-left" />
        </Button>
        <p class="text-sm font-semibold text-foreground">Launches</p>
      </div>
      <div class="flex flex-wrap gap-2 px-6">
        <Button
          v-for="value in modes"
          :key="value"
          size="sm"
          :variant="collapsible === value ? 'primary' : 'tertiary'"
          @click="collapsible = value"
        >
          {{ value }}
        </Button>
      </div>
      <div
        v-if="collapsible !== 'none'"
        class="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center md:hidden"
      >
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
import type { NavigationMenuItem, SidebarProps } from '@hareui/vue'
import { Button, NavigationMenu, Sidebar } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

type Collapsible = NonNullable<SidebarProps['collapsible']>

const modes: Collapsible[] = ['offcanvas', 'icon', 'none']
const collapsible = ref<Collapsible>('icon')
const isOpen = ref(true)

const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Launches', icon: gravityIcon('rocket'), href: '#', active: true },
  { label: 'Calendar', icon: gravityIcon('calendar'), href: '#' },
  { label: 'Crew', icon: gravityIcon('persons'), href: '#' },
  { label: 'Telemetry', icon: gravityIcon('chart-line'), href: '#' },
  { label: 'Settings', icon: gravityIcon('gear'), href: '#' },
]
</script>
