<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const navItems = [
  { icon: 'gravity-ui:house', label: 'Home' },
  { icon: 'gravity-ui:magnifier', label: 'Search' },
  { icon: 'gravity-ui:bell', label: 'Notifications' },
  { icon: 'gravity-ui:envelope', label: 'Messages' },
  { icon: 'gravity-ui:person', label: 'Profile' },
  { icon: 'gravity-ui:gear', label: 'Settings' },
]
</script>

<template>
  <Drawer placement="left" title="Navigation">
    <Button variant="secondary">
      <Icon height="16" icon="gravity-ui:bars" width="16" />
      Menu
    </Button>
    <template #body>
      <nav class="flex flex-col gap-1">
        <button
          v-for="item in navItems"
          :key="item.label"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
          type="button"
        >
          <Icon class="size-5 text-muted" :icon="item.icon" />
          {{ item.label }}
        </button>
      </nav>
    </template>
  </Drawer>
</template>
