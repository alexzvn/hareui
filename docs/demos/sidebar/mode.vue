<template>
  <div class="flex min-h-svh bg-background">
    <Sidebar v-model:open="isOpen" :mode="mode" title="Pantry">
      <NavigationMenu :items="items" orientation="vertical" />

      <template #footer>
        <p class="px-2 text-xs text-muted">Synced 2 minutes ago</p>
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
          <Icon icon="gravity-ui:bars" />
        </Button>
        <p class="text-sm font-semibold text-foreground">Recipes</p>
      </div>
      <div class="flex flex-wrap gap-2 px-4">
        <Button
          v-for="value in modes"
          :key="value"
          size="sm"
          :variant="mode === value ? 'primary' : 'tertiary'"
          @click="mode = value"
        >
          {{ value }}
        </Button>
      </div>
      <div class="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center md:hidden">
        <p class="text-sm text-muted">Pick a mode, then open the menu.</p>
        <Button size="sm" variant="secondary" @click="isOpen = true">
          <Icon icon="gravity-ui:bars" />
          Open menu
        </Button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem, SidebarMode } from '@hareui/vue'
import { Button, NavigationMenu, Sidebar } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const modes: SidebarMode[] = ['slideover', 'drawer', 'modal']
const mode = ref<SidebarMode>('slideover')
const isOpen = ref(false)

const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Recipes', icon: gravityIcon('book-open'), href: '#', active: true },
  { label: 'Shopping list', icon: gravityIcon('list-check'), href: '#' },
  { label: 'Meal plan', icon: gravityIcon('calendar'), href: '#' },
  { label: 'Favorites', icon: gravityIcon('star'), href: '#' },
]
</script>
