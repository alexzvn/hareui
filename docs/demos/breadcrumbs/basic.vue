<script setup lang="ts">
import { Breadcrumbs } from 'herouse'

const items = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Electronics', href: '#' },
  { label: 'Laptop' },
]
</script>

<template>
  <Breadcrumbs :items="items" />
</template>
