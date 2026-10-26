<template>
  <Breadcrumbs :items="items" />
</template>

<script setup lang="ts">
import type { BreadcrumbsItem } from '@hareui/vue'
import { Breadcrumbs } from '@hareui/vue'

const items: BreadcrumbsItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Category', href: '#' },
  { label: 'Current Page' },
]
</script>
