<script setup lang="ts">
import type { DashboardStorageAdapter, NavigationMenuItem } from '@hareui/vue'
import { Button, DashboardGroup, DashboardPanel, DashboardSidebar, DashboardSidebarToggle, NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

// NavigationMenu takes icon components: an Iconify Gravity UI icon that forwards the menu's icon classes.
const gravityIcon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Home', icon: gravityIcon('house'), href: '#', active: true },
  { label: 'Inbox', icon: gravityIcon('envelope'), href: '#' },
  { label: 'Contacts', icon: gravityIcon('persons'), href: '#' },
  { label: 'Settings', icon: gravityIcon('gear'), href: '#' },
]

// Any `{ getItem, setItem }` object works, e.g. one backed by the request cookies during SSR.
const entries = ref<Record<string, string>>({})
const adapter: DashboardStorageAdapter = {
  getItem: key => entries.value[key],
  setItem: (key, value) => {
    entries.value = { ...entries.value, [key]: value }
  },
}
</script>

<template>
  <DashboardGroup unit="rem" :storage="adapter" storage-key="demo">
    <DashboardSidebar id="storage" collapsible resizable :default-size="14" :max-size="22" :min-size="10">
      <template #default="{ collapsed }">
        <NavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
      </template>
    </DashboardSidebar>

    <DashboardPanel>
      <template #header>
        <div class="flex h-16 shrink-0 items-center gap-3 px-4">
          <DashboardSidebarToggle />
          <p class="min-w-0 truncate text-sm font-semibold text-foreground">
            Settings
          </p>
          <Button size="sm" variant="secondary" class="ms-auto" @click="entries = {}">
            Reset
          </Button>
        </div>
      </template>
      <template #body>
        <pre class="rounded-xl bg-surface-secondary p-4 text-xs text-muted">{{ entries }}</pre>
        <div class="min-h-24 flex-1 rounded-xl border border-dashed border-separator bg-surface/50" />
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>
