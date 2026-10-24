<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import {
  Button,
  DashboardGroup,
  DashboardPanel,
  DashboardSidebar,
  DashboardSidebarToggle,
  Kbd,
  NavigationMenu,
} from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, onBeforeUnmount, onMounted, ref } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Home', icon: gravityIcon('house'), href: '#', active: true },
  { label: 'Inbox', icon: gravityIcon('envelope'), href: '#' },
  { label: 'Contacts', icon: gravityIcon('persons'), href: '#' },
  { label: 'Settings', icon: gravityIcon('gear'), href: '#' },
]

const collapsed = ref(false)

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement
  if (
    event.key.toLowerCase() === 'c' &&
    !event.metaKey &&
    !event.ctrlKey &&
    !/input|textarea|select/i.test(target.tagName)
  )
    collapsed.value = !collapsed.value
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardSidebar
      id="control-collapsed"
      v-model:collapsed="collapsed"
      collapsible
      :default-size="14"
    >
      <template #header>
        <div class="flex min-w-0 items-center gap-3 px-1.5 py-2">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground"
            >A</span
          >
          <span v-if="!collapsed" class="truncate text-sm font-semibold text-foreground">Acme</span>
        </div>
      </template>
      <NavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
    </DashboardSidebar>

    <DashboardPanel>
      <template #header>
        <div class="flex h-16 shrink-0 items-center gap-3 px-4">
          <DashboardSidebarToggle />
          <p class="min-w-0 truncate text-sm font-semibold text-foreground">Dashboard</p>
          <Button size="sm" variant="secondary" class="ms-auto" @click="collapsed = !collapsed">
            {{ collapsed ? 'Expand' : 'Collapse' }}
            <Kbd>C</Kbd>
          </Button>
        </div>
      </template>
      <template #body>
        <div class="h-full rounded-xl border border-dashed border-separator bg-surface/50" />
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>
