<script setup lang="ts">
import { Breadcrumbs } from '@hareui/vue'

const items = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Electronics', href: '#' },
  { label: 'Laptop' },
]
</script>

<template>
  <Breadcrumbs disabled :items="items" />
</template>
