<template>
  <Breadcrumbs :items="items" />
</template>

<script setup lang="ts">
import type { BreadcrumbsItem } from '@hareui/vue'
import { Breadcrumbs } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: BreadcrumbsItem[] = [
  { label: 'Workspace', icon: icon('house'), href: '#' },
  { label: 'Recipes', icon: icon('folder'), href: '#' },
  { label: 'Lemon pasta', icon: icon('file-text') },
]
</script>
