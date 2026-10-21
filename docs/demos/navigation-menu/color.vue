<script setup lang="ts">
import type { NavigationMenuProps } from '@hareui/vue'
import { NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const links = [
  { label: 'Overview', icon: icon('house'), href: '#overview' },
  { label: 'Inbox', icon: icon('envelope'), href: '#inbox', active: true },
  { label: 'Reports', icon: icon('chart-column'), href: '#reports' },
]
const colors: NonNullable<NavigationMenuProps['color']>[] = ['default', 'accent', 'success', 'warning', 'danger']
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <NavigationMenu v-for="color in colors" :key="color" :color="color" :items="links" :ui="{ linkLabel: 'max-sm:sr-only' }" class="w-full justify-center" />
  </div>
</template>
