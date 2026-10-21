<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[][] = [
  [
    { label: 'Guide', icon: icon('book-open'), chip: { color: 'danger' } },
    { label: 'Composables', icon: icon('database'), chip: { color: 'success' } },
    { label: 'Components', icon: icon('box'), href: '#components', active: true, chip: true },
  ],
  [
    { label: 'GitHub', icon: icon('logo-github'), href: 'https://github.com/alexzvn/hareui', target: '_blank' },
    { label: 'Help', icon: icon('circle-question'), disabled: true },
  ],
]
</script>

<template>
  <NavigationMenu collapsed orientation="vertical" :items="items" />
</template>
