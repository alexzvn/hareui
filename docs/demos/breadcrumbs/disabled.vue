<script setup lang="ts">
import type { BreadcrumbsItem } from '@hareui/vue'
import { Breadcrumbs } from '@hareui/vue'

const items: BreadcrumbsItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Electronics', href: '#' },
  { label: 'Laptop' },
]
</script>

<template>
  <Breadcrumbs disabled :items="items" />
</template>
