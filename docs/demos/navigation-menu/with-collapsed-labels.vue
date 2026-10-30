<template>
  <NavigationMenu
    collapsed
    orientation="vertical"
    :items="items"
    :ui="{
      link: 'h-auto flex-col gap-1 py-2',
      linkLabel: 'block text-[10px]/3 text-center',
    }"
    class="w-16"
  />
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Home', icon: icon('house') },
  { label: 'Search', icon: icon('magnifier') },
  { label: 'Users', icon: icon('persons'), active: true },
  { label: 'Settings', icon: icon('gear') },
]
</script>
