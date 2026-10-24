<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import {
  Button,
  DashboardGroup,
  DashboardPanel,
  DashboardSidebar,
  NavigationMenu,
} from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Home', icon: gravityIcon('house'), href: '#', active: true },
  { label: 'Inbox', icon: gravityIcon('envelope'), href: '#' },
  { label: 'Contacts', icon: gravityIcon('persons'), href: '#' },
  { label: 'Settings', icon: gravityIcon('gear'), href: '#' },
]

const modes = ['slideover', 'drawer', 'modal'] as const
const mode = ref<(typeof modes)[number]>('drawer')
const open = ref(false)
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardSidebar id="mode" v-model:open="open" :mode="mode">
      <template #header>
        <div class="flex min-w-0 items-center gap-3 px-1 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >A</span
          >
          <span class="truncate text-sm font-semibold text-foreground">Acme</span>
        </div>
      </template>
      <NavigationMenu :items="items" orientation="vertical" />
    </DashboardSidebar>

    <DashboardPanel>
      <template #header>
        <div class="flex h-16 shrink-0 items-center gap-3 px-4">
          <Button
            aria-label="Open sidebar"
            icon-only
            size="sm"
            variant="ghost"
            @click="open = true"
          >
            <Icon icon="gravity-ui:bars" />
          </Button>
          <p class="min-w-0 truncate text-sm font-semibold text-foreground">Dashboard</p>
        </div>
      </template>
      <template #body>
        <div
          class="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-separator bg-surface/50 p-4"
        >
          <p class="text-sm text-muted">Open the menu as a</p>
          <div class="flex flex-wrap justify-center gap-1.5">
            <Button
              v-for="m in modes"
              :key="m"
              size="sm"
              :variant="mode === m ? 'primary' : 'secondary'"
              @click="mode = m"
            >
              {{ m }}
            </Button>
          </div>
        </div>
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>
