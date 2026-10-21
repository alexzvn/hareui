<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Home', icon: icon('house'), active: true },
  { label: 'Samples', icon: icon('circle-play') },
  { label: 'Explore', icon: icon('compass') },
  { label: 'Library', icon: icon('bookmark') },
]
</script>

<template>
  <NavigationMenu
    :items="items"
    :ui="{
      root: 'justify-around border-t border-separator py-2',
      item: 'py-0',
      link: 'flex-col gap-1 px-3',
      linkLeadingIcon: 'size-5',
      linkLabel: 'text-[10px]/3 font-normal',
    }"
    class="w-full"
  />
</template>
