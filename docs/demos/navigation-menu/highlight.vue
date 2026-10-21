<script setup lang="ts">
import { NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const links = [
  { label: 'Overview', icon: icon('house'), href: '#overview' },
  { label: 'Inbox', icon: icon('envelope'), href: '#inbox', active: true },
  { label: 'Reports', icon: icon('chart-column'), href: '#reports' },
  { label: 'Settings', icon: icon('gear'), href: '#settings' },
]
</script>

<template>
  <div class="flex w-full flex-col gap-10">
    <NavigationMenu highlight :items="links" :ui="{ linkLabel: 'max-sm:sr-only' }" class="w-full justify-center" />
    <NavigationMenu highlight :items="links" orientation="vertical" class="w-64 self-center" />
  </div>
</template>
