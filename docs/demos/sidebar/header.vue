<template>
  <div class="flex min-h-svh bg-background">
    <Sidebar v-model:open="isOpen" close description="Spring term" title="Biology 201">
      <template #actions>
        <Button aria-label="New lesson" icon-only size="sm" variant="ghost">
          <Icon icon="gravity-ui:pencil-to-square" />
        </Button>
      </template>

      <NavigationMenu :items="items" orientation="vertical" />
    </Sidebar>

    <main class="flex min-w-0 flex-1 flex-col">
      <div class="flex h-16 items-center gap-3 px-4">
        <Button
          v-if="!isOpen"
          aria-label="Open sidebar"
          icon-only
          size="sm"
          variant="ghost"
          @click="isOpen = true"
        >
          <Icon icon="gravity-ui:layout-side-content-left" />
        </Button>
        <p class="text-sm font-semibold text-foreground">Lessons</p>
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
import { Button, NavigationMenu, Sidebar } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const isOpen = ref(true)

const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Lessons', icon: gravityIcon('book-open'), href: '#', active: true },
  { label: 'Assignments', icon: gravityIcon('list-check'), href: '#', badge: '5' },
  { label: 'Grades', icon: gravityIcon('chart-column'), href: '#' },
  { label: 'Students', icon: gravityIcon('persons'), href: '#' },
]
</script>
