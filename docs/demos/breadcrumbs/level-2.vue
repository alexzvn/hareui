<script setup lang="ts">
import { Breadcrumbs } from 'herouse'

const items = [
  { label: 'Home', href: '#' },
  { label: 'Current Page' },
]
</script>

<template>
  <Breadcrumbs :items="items" />
</template>
