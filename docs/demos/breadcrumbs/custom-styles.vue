<script setup lang="ts">
import { Breadcrumbs } from '@hareui/vue'

const items = [
  { label: 'Home', href: '#', class: 'text-muted hover:text-accent' },
  { label: 'Products', href: '#', class: 'text-muted hover:text-accent' },
  { label: 'Laptop', class: 'font-medium text-foreground' },
]
</script>

<template>
  <Breadcrumbs class="rounded-lg bg-default-soft px-3 py-2" :items="items" />
</template>
