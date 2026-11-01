<template>
  <Breadcrumbs :items="items">
    <template #separator>
      <Icon icon="gravity-ui:caret-right" />
    </template>
  </Breadcrumbs>
</template>

<script setup lang="ts">
import type { BreadcrumbsItem } from '@hareui/vue'
import { Breadcrumbs } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: BreadcrumbsItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Electronics', href: '#' },
  { label: 'Laptop' },
]
</script>
