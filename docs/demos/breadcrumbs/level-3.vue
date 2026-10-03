<script setup lang="ts">
import { Breadcrumbs } from '@hareui/vue'

const items = [
  { label: 'Home', href: '#' },
  { label: 'Category', href: '#' },
  { label: 'Current Page' },
]
</script>

<template>
  <Breadcrumbs :items="items" />
</template>
