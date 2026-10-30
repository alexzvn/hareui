<template>
  <div class="flex min-h-svh bg-background">
    <Sidebar v-model:open="isOpen" variant="inset" title="Fieldnote" description="Research team">
      <NavigationMenu :items="items" orientation="vertical" />
    </Sidebar>

    <!-- The inset variant drops the sidebar edge: style the page content as a card next to it. -->
    <main
      class="m-2 flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-surface shadow-surface md:ms-0"
    >
      <div class="flex h-14 items-center gap-3 px-3">
        <Button
          aria-label="Toggle sidebar"
          icon-only
          size="sm"
          variant="ghost"
          @click="isOpen = !isOpen"
        >
          <Icon icon="gravity-ui:layout-side-content-left" />
        </Button>
        <p class="text-sm text-muted">Interviews</p>
        <Icon class="size-3 text-muted" icon="gravity-ui:chevron-right" />
        <p class="text-sm font-medium text-foreground">Onboarding study</p>
      </div>
      <div class="grid gap-4 p-4 sm:grid-cols-3">
        <div
          v-for="n in 3"
          :key="n"
          class="h-24 rounded-xl border border-dashed border-separator"
        />
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

const items: NavigationMenuItem[][] = [
  [
    { label: 'Workspace', type: 'label' },
    { label: 'Inbox', icon: gravityIcon('tray'), href: '#' },
    { label: 'Interviews', icon: gravityIcon('microphone'), href: '#', active: true },
    { label: 'Insights', icon: gravityIcon('sparkles'), href: '#' },
  ],
  [
    { label: 'Studies', type: 'label' },
    { label: 'Onboarding study', icon: gravityIcon('flask'), href: '#' },
    { label: 'Pricing survey', icon: gravityIcon('square-list-ul'), href: '#' },
  ],
]
</script>
